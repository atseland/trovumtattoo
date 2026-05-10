import { mutation, query } from './_generated/server'
import { v } from 'convex/values'
import { assertStringLength } from './lib/validate'
import { requireAdmin } from './lib/adminAuth'

export const list = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx)

    const all = await ctx.db.query('messageTemplates').order('asc').collect()
    return all.filter((t) => !t.isDeleted)
  },
})

export const create = mutation({
  args: {
    type: v.string(),
    title: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx)

    assertStringLength(args.title, 'title', 1, 200)
    assertStringLength(args.content, 'content', 1, 50_000)

    const now = Date.now()
    return await ctx.db.insert('messageTemplates', {
      ...args,
      createdAt: now,
      updatedAt: now,
    })
  },
})

export const update = mutation({
  args: {
    id: v.id('messageTemplates'),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
  },
  handler: async (ctx, { id, ...fields }) => {
    await requireAdmin(ctx)

    if (fields.title !== undefined) assertStringLength(fields.title, 'title', 1, 200)
    if (fields.content !== undefined) assertStringLength(fields.content, 'content', 1, 50_000)

    const patch: Record<string, unknown> = { updatedAt: Date.now() }
    for (const [k, v] of Object.entries(fields)) {
      if (v !== undefined) patch[k] = v
    }
    await ctx.db.patch(id, patch)
  },
})

export const remove = mutation({
  args: { id: v.id('messageTemplates') },
  handler: async (ctx, { id }) => {
    await requireAdmin(ctx)

    await ctx.db.patch(id, { isDeleted: true, updatedAt: Date.now() })
  },
})
