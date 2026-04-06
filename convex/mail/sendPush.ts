import { action } from '../_generated/server'
import { v } from 'convex/values'

export const sendPush = action({
  args: {
    title: v.string(),
    body: v.string(),
    url: v.optional(v.string()),
  },
  handler: async (ctx, { title, body, url }) => {
    // TODO: install web-push package and set VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY env vars
    // const webpush = await import('web-push')
    // const vapidPublicKey = process.env.VAPID_PUBLIC_KEY
    // const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY
    // if (!vapidPublicKey || !vapidPrivateKey) {
    //   console.warn('VAPID keys not configured — skipping push')
    //   return
    // }
    // webpush.setVapidDetails('mailto:admin@trovumtattoo.no', vapidPublicKey, vapidPrivateKey)
    // const subscriptions = await ctx.runQuery((api as any).pushSubscriptions.getCurrent, {})
    // const payload = JSON.stringify({ title, body, url })
    // await Promise.allSettled(
    //   subscriptions.map((sub: any) =>
    //     webpush.sendNotification({ endpoint: sub.endpoint, keys: sub.keys }, payload)
    //   )
    // )
    console.log(`[sendPush] ${title}: ${body}`)
  },
})
