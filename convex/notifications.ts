import { mutation, query } from './_generated/server'
import { v } from 'convex/values'
import { requireAdmin } from './lib/adminAuth'

export const list = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx)

    return await ctx.db
      .query('notifications')
      .withIndex('by_createdAt')
      .order('desc')
      .collect()
  },
})

export const countUnread = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx)

    const unread = await ctx.db
      .query('notifications')
      .withIndex('by_isRead', (q) => q.eq('isRead', false))
      .collect()

    return unread.length
  },
})

export const markRead = mutation({
  args: { id: v.id('notifications') },
  handler: async (ctx, { id }) => {
    await requireAdmin(ctx)

    await ctx.db.patch(id, { isRead: true })
  },
})

export const markAllRead = mutation({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx)

    const unread = await ctx.db
      .query('notifications')
      .withIndex('by_isRead', (q) => q.eq('isRead', false))
      .collect()

    await Promise.all(unread.map((n) => ctx.db.patch(n._id, { isRead: true })))
  },
})
