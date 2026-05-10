"use node"

import { action } from '../_generated/server'
import { internal } from '../_generated/api'
import { v } from 'convex/values'
import nodemailer from 'nodemailer'
import { getMailConfig, type MailConfig } from './config'
import { requireAdmin } from '../lib/adminAuth'

function normalizeEmailAddress(value: string) {
  return value.trim().toLowerCase()
}

/**
 * sendReply — Convex action for å sende e-post via SMTP og lagre som outbound melding.
 */
export const sendReply = action({
  args: {
    threadId: v.id('mailThreads'),
    to: v.array(v.string()),
    subject: v.string(),
    body: v.string(),
    inReplyTo: v.optional(v.string()),
  },
  handler: async (ctx, { threadId, to, subject, body, inReplyTo }) => {
    await requireAdmin(ctx)

    if (subject.length > 500) throw new Error('Subject too long')
    if (body.length > 100_000) throw new Error('Body too long')

    const dbConfig = await ctx.runQuery(internal.mail.account.getConfig, {})
    const config: MailConfig = dbConfig ?? getMailConfig()
    const ownAddresses = new Set([
      normalizeEmailAddress(config.smtp.auth.user),
      normalizeEmailAddress(config.from.match(/<([^>]+)>/)?.[1] ?? config.from),
    ])
    const recipients = Array.from(
      new Set(
        to
          .map((address) => address.trim())
          .filter(Boolean)
          .filter((address) => !ownAddresses.has(normalizeEmailAddress(address))),
      ),
    )

    if (recipients.length < 1) {
      throw new Error('Fant ingen gyldige mottakere etter filtrering av egen mailbox.')
    }

    const transporter = nodemailer.createTransport({
      host: config.smtp.host,
      port: config.smtp.port,
      secure: config.smtp.secure,
      auth: config.smtp.auth,
    })

    try {
      await transporter.sendMail({
        from: config.from,
        to: recipients.join(', '),
        subject,
        text: body,
        inReplyTo,
        references: inReplyTo,
      })
    } catch (err) {
      console.error('[sendReply] SMTP-feil:', err)
      throw new Error(`Kunne ikke sende e-post: ${err instanceof Error ? err.message : String(err)}`)
    }

    const now = Date.now()

    // Lagre som outbound melding
    await ctx.runMutation(internal.mail.mutations.upsertMessage, {
      threadId,
      externalId: `outbound-${now}`,
      direction: 'outbound',
      from: config.from,
      to: recipients,
      subject,
      bodyText: body,
      sentAt: now,
      isRead: true,
    })

    // Oppdater eksisterende tråd i stedet for å opprette en ny "Re:"-tråd.
    await ctx.runMutation(internal.mail.mutations.updateThread, {
      threadId,
      subject,
      participants: recipients,
      lastMessageAt: now,
      unreadCount: 0,
    })

    return { sent: true }
  },
})
