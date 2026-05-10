import { internalQuery, query } from '../_generated/server'
import { v } from 'convex/values'
import { requireAdmin } from '../lib/adminAuth'

export const listThreads = query({
  args: { unreadOnly: v.optional(v.boolean()), status: v.optional(v.string()) },
  handler: async (ctx, { unreadOnly, status }) => {
    await requireAdmin(ctx)

    const threads = await ctx.db
      .query('mailThreads')
      .withIndex('by_status_lastMessageAt', (q) => q.eq('status', status ?? 'active'))
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
    await requireAdmin(ctx)

    return await ctx.db.get(threadId)
  },
})

export const listMessages = query({
  args: { threadId: v.id('mailThreads') },
  handler: async (ctx, { threadId }) => {
    await requireAdmin(ctx)

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
    await requireAdmin(ctx)

    const threads = await ctx.db
      .query('mailThreads')
      .withIndex('by_client_status', (q) => q.eq('linkedClientId', clientId).eq('status', 'active'))
      .order('desc')
      .collect()
    return threads
  },
})

export const listByProject = query({
  args: { projectId: v.id('projects') },
  handler: async (ctx, { projectId }) => {
    await requireAdmin(ctx)

    const threads = await ctx.db
      .query('mailThreads')
      .withIndex('by_project_status', (q) => q.eq('linkedProjectId', projectId).eq('status', 'active'))
      .order('desc')
      .collect()
    return threads
  },
})

export const getCustomerMailRecipient = internalQuery({
  args: { clientId: v.id('clients') },
  handler: async (ctx, { clientId }) => {
    return await ctx.db.get(clientId)
  },
})
