"use node"

import { action } from '../_generated/server'
import { api, internal } from '../_generated/api'
import { v } from 'convex/values'
import nodemailer from 'nodemailer'
import { getMailConfig, type MailConfig } from './config'
import { requireAdmin } from '../lib/adminAuth'

/**
 * sendAftercare — Convex action for å sende aftercare-melding via SMTP.
 */
export const sendAftercare = action({
  args: {
    projectId: v.id('projects'),
    threadId: v.id('mailThreads'),
    to: v.string(),
    subject: v.string(),
    body: v.string(),
  },
  handler: async (ctx, { projectId, threadId, to, subject, body }) => {
    await requireAdmin(ctx)

    if (subject.length > 500) throw new Error('Subject too long')
    if (body.length > 100_000) throw new Error('Body too long')

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
        to,
        subject,
        text: body,
      })
    } catch (err) {
      console.error('[sendAftercare] SMTP-feil:', err)
      throw new Error(`Kunne ikke sende aftercare-e-post: ${err instanceof Error ? err.message : String(err)}`)
    }

    const now = Date.now()

    // Lagre som outbound melding
    await ctx.runMutation(internal.mail.mutations.upsertMessage, {
      threadId,
      externalId: `aftercare-${now}`,
      direction: 'outbound',
      from: config.from,
      to: [to],
      subject,
      bodyText: body,
      sentAt: now,
      isRead: true,
    })

    // Logg til activityLog
    await ctx.runMutation(internal.activityLogMutations.insert, {
      entityType: 'project',
      entityId: projectId,
      action: 'aftercare_sent',
      payload: { to, subject },
    })

    await ctx.runMutation(api.projects.update, { id: projectId, aftercareSentAt: now })

    return { sent: true }
  },
})
