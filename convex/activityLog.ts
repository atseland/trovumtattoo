import { query } from './_generated/server'
import { v } from 'convex/values'

export const listByEntity = query({
  args: {
    entityType: v.string(),
    entityId: v.string(),
  },
  handler: async (ctx, { entityType, entityId }) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('Unauthorized')

    return await ctx.db
      .query('activityLog')
      .withIndex('by_entity', (q) =>
        q.eq('entityType', entityType).eq('entityId', entityId)
      )
      .order('desc')
      .collect()
  },
})
