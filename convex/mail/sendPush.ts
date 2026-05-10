"use node"

import { action } from '../_generated/server'
import { internal } from '../_generated/api'
import { v } from 'convex/values'
import webpush from 'web-push'
import { requireAdmin } from '../lib/adminAuth'

export const sendPush = action({
  args: {
    title: v.string(),
    body: v.string(),
    url: v.optional(v.string()),
  },
  handler: async (ctx, { title, body, url }): Promise<{ sent: number }> => {
    await requireAdmin(ctx)

    const vapidPublicKey = process.env.VAPID_PUBLIC_KEY
    const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY

    if (!vapidPublicKey || !vapidPrivateKey) {
      throw new Error('Push server VAPID keys are not configured')
    }

    webpush.setVapidDetails(
      'mailto:admin@trovumtattoo.no',
      vapidPublicKey,
      vapidPrivateKey,
    )

    const subscriptions = await ctx.runQuery(internal.pushSubscriptions.getAll, {})
    if (!subscriptions || !Array.isArray(subscriptions)) {
      return { sent: 0 }
    }

    const payload = JSON.stringify({ title, body, url })

    const results = await Promise.allSettled(
      subscriptions.map((sub) =>
        webpush.sendNotification(
          { endpoint: sub.endpoint, keys: sub.keys },
          payload,
        ),
      ),
    )

    const sent: number = results.filter((r) => r.status === 'fulfilled').length
    console.log(`[sendPush] ${sent}/${subscriptions.length} push-varsler sendt`)
    return { sent }
  },
})
