"use node"

import { action } from '../_generated/server'
import { internal } from '../_generated/api'
import { ImapFlow } from 'imapflow'
import { getMailConfig, type MailConfig } from './config'

function decodeQuotedPrintable(input: string) {
  const normalized = input.replace(/=\r?\n/g, '')
  const bytes: number[] = []

  for (let i = 0; i < normalized.length; i++) {
    const char = normalized[i]
    if (char === '=' && i + 2 < normalized.length) {
      const hex = normalized.slice(i + 1, i + 3)
      if (/^[0-9A-Fa-f]{2}$/.test(hex)) {
        bytes.push(Number.parseInt(hex, 16))
        i += 2
        continue
      }
    }

    bytes.push(char.charCodeAt(0))
  }

  return Buffer.from(bytes).toString('utf8')
}

function decodeTransferEncodedBody(body: string, encoding?: string) {
  switch (encoding?.toLowerCase()) {
    case 'quoted-printable':
      return decodeQuotedPrintable(body)
    case 'base64':
      return Buffer.from(body.replace(/\s+/g, ''), 'base64').toString('utf8')
    default:
      return body
  }
}

function extractHeaderValue(headers: string, headerName: string) {
  const match = headers.match(new RegExp(`^${headerName}:\\s*(.+)$`, 'im'))
  return match?.[1]?.trim() ?? null
}

function extractMessageBody(rawSource?: Buffer) {
  if (!rawSource) return ''

  const raw = rawSource.toString('utf8')
  const separatorMatch = raw.match(/\r?\n\r?\n/)
  if (!separatorMatch || separatorMatch.index === undefined) return raw.trim()

  const separatorIndex = separatorMatch.index
  const separatorLength = separatorMatch[0].length
  const headers = raw.slice(0, separatorIndex)
  const body = raw.slice(separatorIndex + separatorLength)
  const contentType = extractHeaderValue(headers, 'Content-Type') ?? ''
  const transferEncoding = extractHeaderValue(headers, 'Content-Transfer-Encoding') ?? undefined

  const boundaryMatch = contentType.match(/boundary="?([^";]+)"?/i)
  if (!boundaryMatch) {
    return decodeTransferEncodedBody(body, transferEncoding).trim()
  }

  const boundary = boundaryMatch[1]
  const parts = body.split(`--${boundary}`)

  for (const part of parts) {
    const trimmedPart = part.trim()
    if (!trimmedPart || trimmedPart === '--') continue

    const partSeparatorMatch = trimmedPart.match(/\r?\n\r?\n/)
    if (!partSeparatorMatch || partSeparatorMatch.index === undefined) continue

    const partSeparatorIndex = partSeparatorMatch.index
    const partSeparatorLength = partSeparatorMatch[0].length
    const partHeaders = trimmedPart.slice(0, partSeparatorIndex)
    const partBody = trimmedPart.slice(partSeparatorIndex + partSeparatorLength)
    const partContentType = extractHeaderValue(partHeaders, 'Content-Type') ?? ''
    const partTransferEncoding = extractHeaderValue(partHeaders, 'Content-Transfer-Encoding') ?? undefined

    if (/text\/plain/i.test(partContentType)) {
      return decodeTransferEncodedBody(partBody, partTransferEncoding).trim()
    }
  }

  return decodeTransferEncodedBody(body, transferEncoding).trim()
}

function normalizeAddress(value: string) {
  return value.trim().toLowerCase()
}

/**
 * syncMail — Convex action som henter e-post fra IMAP og lagrer i Convex.
 * Krever at MAIL_* miljøvariabler er satt (se convex/mail/config.ts).
 */
export const syncMail = action({
  args: {},
  handler: async (ctx) => {
    let config: MailConfig
    try {
      const dbConfig = await ctx.runQuery(internal.mail.account.getConfig, {})
      config = dbConfig ?? getMailConfig()
    } catch (e) {
      console.error('[syncMail] Manglende mail-konfigurasjon:', (e as Error).message)
      return { synced: 0, error: (e as Error).message }
    }

    const client = new ImapFlow({
      host: config.imap.host,
      port: config.imap.port,
      secure: config.imap.secure,
      auth: config.imap.auth,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      logger: false as any,
    })

    let synced = 0

    try {
      await client.connect()
      const lock = await client.getMailboxLock('INBOX')

      try {
        const messageCount = client.mailbox ? client.mailbox.exists : 0
        if (messageCount < 1) {
          await ctx.runMutation(internal.mail.account.updateLastSync, {})
          console.log('[syncMail] INBOX er tom, ingen meldinger aa synkronisere')
          return { synced: 0 }
        }

        const fetchRange = `1:${Math.min(messageCount, 50)}`

        for await (const msg of client.fetch(fetchRange, { envelope: true, source: true, flags: true })) {
          const envelope = msg.envelope
          if (!envelope) continue

          const externalId = envelope.messageId ?? String(msg.seq)
          const subject = envelope.subject ?? '(Uten emne)'
          const from = envelope.from?.[0]?.address ?? 'ukjent'
          const toAddrs = (envelope.to ?? []).map((a: { address?: string }) => a.address ?? '').filter(Boolean)
          const participants = Array.from(
            new Set(
              [from, ...toAddrs].filter(
                (address) => normalizeAddress(address) !== normalizeAddress(config.imap.auth.user),
              ),
            ),
          )
          const date = envelope.date ? new Date(envelope.date).getTime() : Date.now()

          const threadId = await ctx.runMutation(internal.mail.mutations.upsertThread, {
            externalThreadId: externalId,
            subject,
            participants,
            lastMessageAt: date,
            unreadCount: msg.flags?.has('\\Seen') ? 0 : 1,
          })

          await ctx.runMutation(internal.mail.mutations.upsertMessage, {
            threadId,
            externalId,
            direction: 'inbound',
            from,
            to: toAddrs,
            subject,
            bodyText: extractMessageBody(msg.source),
            receivedAt: date,
            isRead: msg.flags?.has('\\Seen') ?? false,
          })

          synced++
        }
      } finally {
        lock.release()
      }

      await client.logout()
    } catch (e) {
      console.error('[syncMail] IMAP-feil:', e)
      return { synced, error: (e as Error).message }
    }

    await ctx.runMutation(internal.mail.account.updateLastSync, {})
    console.log(`[syncMail] Synkronisert ${synced} meldinger`)
    return { synced }
  },
})
