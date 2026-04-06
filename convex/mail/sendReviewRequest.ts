"use node"

import { action } from '../_generated/server'
import { api, internal } from '../_generated/api'
import { v } from 'convex/values'
import nodemailer from 'nodemailer'
import { getMailConfig } from './config'

/**
 * sendReviewRequest — Convex action for å sende review request via SMTP.
 */
export const sendReviewRequest = action({
  args: {
    projectId: v.id('projects'),
    threadId: v.id('mailThreads'),
    to: v.string(),
    subject: v.string(),
    body: v.string(),
  },
  handler: async (ctx, { projectId, threadId, to, subject, body }) => {
    const config = getMailConfig()

    const transporter = nodemailer.createTransport({
      host: config.smtp.host,
      port: config.smtp.port,
      secure: config.smtp.secure,
      auth: config.smtp.auth,
    })

    await transporter.sendMail({
      from: config.from,
      to,
      subject,
      text: body,
    })

    const now = Date.now()

    await ctx.runMutation(internal.mail.mutations.upsertMessage, {
      threadId,
      externalId: `review-request-${now}`,
      direction: 'outbound',
      from: config.from,
      to: [to],
      subject,
      bodyText: body,
      sentAt: now,
      isRead: true,
    })

    // Oppdater reviewRequestedAt på project
    await ctx.runMutation(api.projects.update, {
      id: projectId,
      reviewRequestedAt: now,
    })

    // Logg til activityLog
    await ctx.runMutation(internal.activityLogMutations.insert, {
      entityType: 'project',
      entityId: projectId,
      action: 'review_requested',
      payload: { to, subject },
    })

    return { sent: true }
  },
})
