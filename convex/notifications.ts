import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

export const list = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('Unauthorized')

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
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) return 0

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
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('Unauthorized')

    await ctx.db.patch(id, { isRead: true })
  },
})

export const markAllRead = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('Unauthorized')

    const unread = await ctx.db
      .query('notifications')
      .withIndex('by_isRead', (q) => q.eq('isRead', false))
      .collect()

    await Promise.all(unread.map((n) => ctx.db.patch(n._id, { isRead: true })))
  },
})
