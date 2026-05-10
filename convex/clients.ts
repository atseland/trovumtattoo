import { mutation, query } from './_generated/server'
import { v } from 'convex/values'
import {
  assertStringLength,
  assertOptionalStringLength,
  assertEmailFormat,
} from './lib/validate'
import { requireAdmin } from './lib/adminAuth'

export const create = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    instagramHandle: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx)

    assertStringLength(args.name, 'name', 1, 200)
    assertEmailFormat(args.email, 'email')
    assertOptionalStringLength(args.phone, 'phone', 30)
    assertOptionalStringLength(args.instagramHandle, 'instagramHandle', 100)
    assertOptionalStringLength(args.notes, 'notes', 10_000)

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
    await requireAdmin(ctx)

    return await ctx.db.get(id)
  },
})

export const list = query({
  args: { searchQuery: v.optional(v.string()) },
  handler: async (ctx, { searchQuery }) => {
    await requireAdmin(ctx)

    if (searchQuery && searchQuery.trim()) {
      return await ctx.db
        .query('clients')
        .withSearchIndex('search_clients', (q) => q.search('name', searchQuery))
        .take(20)
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
    await requireAdmin(ctx)

    if (fields.name !== undefined) assertStringLength(fields.name, 'name', 1, 200)
    if (fields.email !== undefined) assertEmailFormat(fields.email, 'email')
    assertOptionalStringLength(fields.phone, 'phone', 30)
    assertOptionalStringLength(fields.instagramHandle, 'instagramHandle', 100)
    assertOptionalStringLength(fields.notes, 'notes', 10_000)

    const patch: Record<string, unknown> = { updatedAt: Date.now() }
    for (const [k, v] of Object.entries(fields)) {
      if (v !== undefined) patch[k] = v
    }
    await ctx.db.patch(id, patch)
  },
})
