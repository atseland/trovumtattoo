import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

export const save = mutation({
  args: {
    endpoint: v.string(),
    keys: v.object({ p256dh: v.string(), auth: v.string() }),
  },
  handler: async (ctx, { endpoint, keys }) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('Unauthorized')

    const existing = await ctx.db
      .query('pushSubscriptions' as any)
      .filter((q: any) => q.eq(q.field('endpoint'), endpoint))
      .first()

    if (existing) {
      await (ctx.db as any).patch(existing._id, { keys, createdAt: Date.now() })
      return existing._id
    }

    return await ctx.db.insert('pushSubscriptions' as any, {
      endpoint,
      keys,
      createdAt: Date.now(),
    })
  },
})

export const getCurrent = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) return null

    return await ctx.db.query('pushSubscriptions' as any).collect()
  },
})
