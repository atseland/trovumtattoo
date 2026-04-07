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
      .query('pushSubscriptions')
      .withIndex('by_endpoint', (q) => q.eq('endpoint', endpoint))
      .first()

    if (existing) {
      await ctx.db.patch(existing._id, { keys, createdAt: Date.now() })
      return existing._id
    }

    return await ctx.db.insert('pushSubscriptions', {
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

    return await ctx.db.query('pushSubscriptions').collect()
  },
})
