"use node"

import nodemailer from 'nodemailer'
import { action } from '../_generated/server'
import { internal } from '../_generated/api'
import type { Id } from '../_generated/dataModel'
import { v } from 'convex/values'
import { getMailConfig, type MailConfig } from './config'
import { createCustomerMailDraft } from './customerMailPolicy'

export const sendCustomerMessage = action({
  args: {
    clientId: v.id('clients'),
    subject: v.string(),
    body: v.string(),
  },
  handler: async (ctx, { clientId, subject, body }): Promise<{ sent: true; threadId: Id<'mailThreads'> }> => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('Unauthorized')

    const client = await ctx.runQuery(internal.mail.queries.getCustomerMailRecipient, { clientId })
    const draft = createCustomerMailDraft({ client, subject, body })

    const dbConfig = await ctx.runQuery(internal.mail.account.getConfig, {})
    const config: MailConfig = dbConfig ?? getMailConfig()
    const transporter = nodemailer.createTransport({
      host: config.smtp.host,
      port: config.smtp.port,
      secure: config.smtp.secure,
      auth: config.smtp.auth,
    })

    try {
      await transporter.sendMail({
        from: config.from,
        to: draft.to.join(', '),
        subject: draft.subject,
        text: draft.body,
      })
    } catch (err) {
      console.error('[sendCustomerMessage] SMTP-feil:', err)
      throw new Error(`Kunne ikke sende e-post: ${err instanceof Error ? err.message : String(err)}`)
    }

    const sentAt = Date.now()
    const threadId = await ctx.runMutation(internal.mail.mutations.createCustomerOutboundThread, {
      clientId,
      from: config.from,
      to: draft.to,
      subject: draft.subject,
      body: draft.body,
      sentAt,
    }) as Id<'mailThreads'>

    return { sent: true, threadId }
  },
})
