import { query } from './_generated/server'
import { v } from 'convex/values'
import { requireAdmin } from './lib/adminAuth'

export const listByEntity = query({
  args: {
    entityType: v.string(),
    entityId: v.string(),
  },
  handler: async (ctx, { entityType, entityId }) => {
    await requireAdmin(ctx)

    return await ctx.db
      .query('activityLog')
      .withIndex('by_entity', (q) =>
        q.eq('entityType', entityType).eq('entityId', entityId)
      )
      .order('desc')
      .collect()
  },
})
