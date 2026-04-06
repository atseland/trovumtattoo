import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

export const create = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    instagramHandle: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('Unauthorized')

    const now = Date.now()
    return await ctx.db.insert('clients', {
      ...args,
      createdAt: now,
      updatedAt: now,
    })
  },
})

export const get = query({
  args: { id: v.id('clients') },
  handler: async (ctx, { id }) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('Unauthorized')

    return await ctx.db.get(id)
  },
})

export const list = query({
  args: { searchQuery: v.optional(v.string()) },
  handler: async (ctx, { searchQuery }) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('Unauthorized')

    if (searchQuery && searchQuery.trim()) {
      return await ctx.db
        .query('clients')
        .withSearchIndex('search_clients', (q) => q.search('name', searchQuery))
        .collect()
    }

    return await ctx.db
      .query('clients')
      .order('desc')
      .collect()
  },
})

export const update = mutation({
  args: {
    id: v.id('clients'),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    instagramHandle: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, { id, ...fields }) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('Unauthorized')

    const patch: Record<string, unknown> = { updatedAt: Date.now() }
    for (const [k, v] of Object.entries(fields)) {
      if (v !== undefined) patch[k] = v
    }
    await ctx.db.patch(id, patch)
  },
})
