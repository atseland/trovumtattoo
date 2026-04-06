"use node"

import { action } from '../_generated/server'
import { api } from '../_generated/api'
import { v } from 'convex/values'
import webpush from 'web-push'

export const sendPush = action({
  args: {
    title: v.string(),
    body: v.string(),
    url: v.optional(v.string()),
  },
  handler: async (ctx, { title, body, url }): Promise<{ sent: number }> => {
    const vapidPublicKey = process.env.VAPID_PUBLIC_KEY
    const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY

    if (!vapidPublicKey || !vapidPrivateKey) {
      console.warn('[sendPush] VAPID keys not configured — skipping push')
      return { sent: 0 }
    }

    webpush.setVapidDetails(
      'mailto:admin@trovumtattoo.no',
      vapidPublicKey,
      vapidPrivateKey,
    )

    const subscriptions: any[] | null = await ctx.runQuery((api as any).pushSubscriptions.getCurrent, {})
    if (!subscriptions || !Array.isArray(subscriptions)) {
      return { sent: 0 }
    }

    const payload = JSON.stringify({ title, body, url })

    const results: PromiseSettledResult<any>[] = await Promise.allSettled(
      subscriptions.map((sub: any) =>
        webpush.sendNotification(
          { endpoint: sub.endpoint, keys: sub.keys },
          payload,
        ),
      ),
    )

    const sent: number = results.filter((r: PromiseSettledResult<any>) => r.status === 'fulfilled').length
    console.log(`[sendPush] ${sent}/${subscriptions.length} push-varsler sendt`)
    return { sent }
  },
})
