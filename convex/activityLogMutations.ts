import { internalMutation } from './_generated/server'
import { v } from 'convex/values'

export const insert = internalMutation({
  args: {
    entityType: v.string(),
    entityId: v.string(),
    action: v.string(),
    payload: v.optional(v.record(v.string(), v.union(v.string(), v.number(), v.boolean(), v.null()))),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('activityLog', {
      ...args,
      createdAt: Date.now(),
    })
  },
})
