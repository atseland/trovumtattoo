import { action } from '../_generated/server'
import { api } from '../_generated/api'
import { v } from 'convex/values'
import { getMailConfig } from './config'

/**
 * sendAftercare — Convex action for å sende aftercare-melding via SMTP.
 * TODO: Installer nodemailer (se sendReply.ts)
 * TODO: aftercareSentAt-felt mangler i schema.ts — legg til v.optional(v.number()) i projects-tabellen
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
    let config: ReturnType<typeof getMailConfig>
    try {
      config = getMailConfig()
    } catch (e) {
      throw new Error(`Mail ikke konfigurert: ${(e as Error).message}`)
    }

    // TODO: Aktiver nodemailer etter installasjon (se sendReply.ts for mønster)

    const now = Date.now()

    // Lagre som outbound melding
    await ctx.runMutation((api as any).mail.mutations.upsertMessage, {
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
    await ctx.runMutation((api as any).activityLogMutations.insert, {
      entityType: 'project',
      entityId: projectId,
      action: 'aftercare_sent',
      payload: { to, subject },
    })

    // TODO: Oppdater project.aftercareSentAt etter at feltet er lagt til i schema.ts
    // await ctx.runMutation((api as any).projects.update, { id: projectId, aftercareSentAt: now })

    return { sent: true }
  },
})
