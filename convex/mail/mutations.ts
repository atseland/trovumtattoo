import { mutation } from '../_generated/server'
import { v } from 'convex/values'

export const upsertThread = mutation({
  args: {
    externalThreadId: v.string(),
    subject: v.string(),
    participants: v.array(v.string()),
    lastMessageAt: v.number(),
    unreadCount: v.number(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('mailThreads')
      .withIndex('by_externalThreadId', (q) => q.eq('externalThreadId', args.externalThreadId))
      .first()

    if (existing) {
      await ctx.db.patch(existing._id, {
        lastMessageAt: args.lastMessageAt,
        unreadCount: args.unreadCount,
      })
      return existing._id
    }

    return await ctx.db.insert('mailThreads', {
      externalThreadId: args.externalThreadId,
      subject: args.subject,
      participants: args.participants,
      lastMessageAt: args.lastMessageAt,
      unreadCount: args.unreadCount,
      status: 'active',
    })
  },
})

export const upsertMessage = mutation({
  args: {
    threadId: v.id('mailThreads'),
    externalId: v.string(),
    direction: v.string(),
    from: v.string(),
    to: v.array(v.string()),
    cc: v.optional(v.array(v.string())),
    subject: v.string(),
    bodyText: v.optional(v.string()),
    bodyHtml: v.optional(v.string()),
    sentAt: v.optional(v.number()),
    receivedAt: v.optional(v.number()),
    isRead: v.boolean(),
  },
  handler: async (ctx, { externalId, ...args }) => {
    // Check for existing message by looking for same externalId in the thread
    const existing = await ctx.db
      .query('mailMessages')
      .withIndex('by_thread', (q) => q.eq('threadId', args.threadId))
      .filter((q) => q.eq(q.field('bodyText'), externalId))
      .first()

    if (existing) {
      await ctx.db.patch(existing._id, { isRead: args.isRead })
      return existing._id
    }

    return await ctx.db.insert('mailMessages', args)
  },
})

export const markThreadRead = mutation({
  args: { threadId: v.id('mailThreads') },
  handler: async (ctx, { threadId }) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('Unauthorized')

    await ctx.db.patch(threadId, { unreadCount: 0 })

    const messages = await ctx.db
      .query('mailMessages')
      .withIndex('by_thread_and_read', (q) => q.eq('threadId', threadId).eq('isRead', false))
      .collect()

    await Promise.all(messages.map((m) => ctx.db.patch(m._id, { isRead: true })))
  },
})

export const linkThread = mutation({
  args: {
    threadId: v.id('mailThreads'),
    linkedClientId: v.optional(v.id('clients')),
    linkedProjectId: v.optional(v.id('projects')),
  },
  handler: async (ctx, { threadId, linkedClientId, linkedProjectId }) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('Unauthorized')

    await ctx.db.patch(threadId, { linkedClientId, linkedProjectId })
  },
})
