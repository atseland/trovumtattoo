import { action } from '../_generated/server'
import { api } from '../_generated/api'
import { v } from 'convex/values'
import { getMailConfig } from './config'

/**
 * sendReply — Convex action for å sende e-post via SMTP og lagre som outbound melding.
 *
 * TODO: Installer nodemailer:
 *   cd convex && npm init -y && npm install nodemailer
 *   Eller bruk Convex package.json for actions.
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
    let config: ReturnType<typeof getMailConfig>
    try {
      config = getMailConfig()
    } catch (e) {
      throw new Error(`Mail ikke konfigurert: ${(e as Error).message}`)
    }

    // TODO: Aktiver nodemailer-kode etter installasjon
    // const nodemailer = require('nodemailer')
    // const transporter = nodemailer.createTransport({
    //   host: config.smtp.host,
    //   port: config.smtp.port,
    //   secure: config.smtp.secure,
    //   auth: config.smtp.auth,
    // })
    // await transporter.sendMail({
    //   from: config.from,
    //   to: to.join(', '),
    //   subject,
    //   text: body,
    //   inReplyTo,
    //   references: inReplyTo,
    // })

    const now = Date.now()

    // Lagre som outbound melding
    await ctx.runMutation((api as any).mail.mutations.upsertMessage, {
      threadId,
      externalId: `outbound-${now}`,
      direction: 'outbound',
      from: config.from,
      to,
      subject,
      bodyText: body,
      sentAt: now,
      isRead: true,
    })

    // Oppdater tråd
    await ctx.runMutation((api as any).mail.mutations.upsertThread, {
      externalThreadId: threadId,
      subject,
      participants: to,
      lastMessageAt: now,
      unreadCount: 0,
    })

    return { sent: true }
  },
})
