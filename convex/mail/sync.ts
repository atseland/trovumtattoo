"use node"

import { action } from '../_generated/server'
import { internal } from '../_generated/api'
import { ImapFlow } from 'imapflow'
import { getMailConfig } from './config'

/**
 * syncMail — Convex action som henter e-post fra IMAP og lagrer i Convex.
 * Krever at MAIL_* miljøvariabler er satt (se convex/mail/config.ts).
 */
export const syncMail = action({
  args: {},
  handler: async (ctx) => {
    let config: ReturnType<typeof getMailConfig>
    try {
      config = getMailConfig()
    } catch (e) {
      console.error('[syncMail] Manglende mail-konfigurasjon:', (e as Error).message)
      return { synced: 0, error: (e as Error).message }
    }

    const client = new ImapFlow({
      host: config.imap.host,
      port: config.imap.port,
      secure: config.imap.secure,
      auth: config.imap.auth,
      logger: false as any,
    })

    let synced = 0

    try {
      await client.connect()
      const lock = await client.getMailboxLock('INBOX')

      try {
        for await (const msg of client.fetch('1:50', { envelope: true, source: true, flags: true })) {
          const envelope = msg.envelope
          if (!envelope) continue

          const externalId = envelope.messageId ?? String(msg.seq)
          const subject = envelope.subject ?? '(Uten emne)'
          const from = envelope.from?.[0]?.address ?? 'ukjent'
          const toAddrs = (envelope.to ?? []).map((a: any) => a.address ?? '').filter(Boolean)
          const participants = [from, ...toAddrs]
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
            bodyText: msg.source?.toString() ?? '',
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

    console.log(`[syncMail] Synkronisert ${synced} meldinger`)
    return { synced }
  },
})
