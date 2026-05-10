import { mutation, query, internalQuery } from './_generated/server'
import { v } from 'convex/values'
import { requireAdmin } from './lib/adminAuth'

export const save = mutation({
  args: {
    endpoint: v.string(),
    keys: v.object({ p256dh: v.string(), auth: v.string() }),
  },
  handler: async (ctx, { endpoint, keys }) => {
    await requireAdmin(ctx)

    if (endpoint.length > 2_000) throw new Error('Endpoint URL too long')

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

/** Public query — returns only endpoint list (no encryption keys). */
export const getCurrent = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx)

    const subs = await ctx.db.query('pushSubscriptions').collect()
    return subs.map((s) => ({ _id: s._id, _creationTime: s._creationTime, endpoint: s.endpoint }))
  },
})

/** Internal query — returns full subscription data including keys. For server-side push only. */
export const getAll = internalQuery({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('pushSubscriptions').collect()
  },
})
