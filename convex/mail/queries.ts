import { query } from '../_generated/server'
import { v } from 'convex/values'

export const listThreads = query({
  args: { unreadOnly: v.optional(v.boolean()) },
  handler: async (ctx, { unreadOnly }) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('Unauthorized')

    const threads = await ctx.db
      .query('mailThreads')
      .withIndex('by_lastMessageAt')
      .order('desc')
      .collect()

    if (unreadOnly) {
      return threads.filter((t) => t.unreadCount > 0)
    }
    return threads
  },
})

export const getThread = query({
  args: { threadId: v.id('mailThreads') },
  handler: async (ctx, { threadId }) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('Unauthorized')

    return await ctx.db.get(threadId)
  },
})

export const listMessages = query({
  args: { threadId: v.id('mailThreads') },
  handler: async (ctx, { threadId }) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('Unauthorized')

    return await ctx.db
      .query('mailMessages')
      .withIndex('by_thread', (q) => q.eq('threadId', threadId))
      .order('asc')
      .collect()
  },
})

export const listByClient = query({
  args: { clientId: v.id('clients') },
  handler: async (ctx, { clientId }) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('Unauthorized')

    return await ctx.db
      .query('mailThreads')
      .withIndex('by_client', (q) => q.eq('linkedClientId', clientId))
      .order('desc')
      .collect()
  },
})

export const listByProject = query({
  args: { projectId: v.id('projects') },
  handler: async (ctx, { projectId }) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('Unauthorized')

    return await ctx.db
      .query('mailThreads')
      .withIndex('by_project', (q) => q.eq('linkedProjectId', projectId))
      .order('desc')
      .collect()
  },
})
