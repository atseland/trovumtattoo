import { action } from '../_generated/server'
import { api } from '../_generated/api'
import { v } from 'convex/values'
import { getMailConfig } from './config'

/**
 * sendReviewRequest — Convex action for å sende review request via SMTP.
 * TODO: Installer nodemailer (se sendReply.ts)
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
    let config: ReturnType<typeof getMailConfig>
    try {
      config = getMailConfig()
    } catch (e) {
      throw new Error(`Mail ikke konfigurert: ${(e as Error).message}`)
    }

    // TODO: Aktiver nodemailer etter installasjon

    const now = Date.now()

    await ctx.runMutation((api as any).mail.mutations.upsertMessage, {
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
    await ctx.runMutation((api as any).projects.update, {
      id: projectId,
      reviewRequestedAt: now,
    })

    // Logg til activityLog
    await ctx.runMutation((api as any).activityLogMutations.insert, {
      entityType: 'project',
      entityId: projectId,
      action: 'review_requested',
      payload: { to, subject },
    })

    return { sent: true }
  },
})
