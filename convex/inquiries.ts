import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

export const create = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    instagramHandle: v.optional(v.string()),
    description: v.string(),
    bodyPlacement: v.string(),
    size: v.string(),
    style: v.string(),
    budget: v.optional(v.string()),
    desiredTiming: v.optional(v.string()),
    firstTattoo: v.boolean(),
    coverUp: v.boolean(),
    touchUp: v.boolean(),
    extraNotes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const inquiryId = await ctx.db.insert('inquiries', {
      ...args,
      status: 'Ny',
      createdAt: Date.now(),
    })
    await ctx.db.insert('activityLog', {
      entityType: 'inquiry',
      entityId: inquiryId,
      action: 'created',
      createdAt: Date.now(),
    })
    return inquiryId
  },
})

export const updateStatus = mutation({
  args: {
    id: v.id('inquiries'),
    status: v.string(),
    note: v.optional(v.string()),
  },
  handler: async (ctx, { id, status, note }) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('Unauthorized')

    const inquiry = await ctx.db.get(id)
    if (!inquiry) throw new Error('Inquiry not found')

    await ctx.db.patch(id, { status })
    await ctx.db.insert('activityLog', {
      entityType: 'inquiry',
      entityId: id,
      action: 'status_changed',
      payload: { from: inquiry.status, to: status, note },
      createdAt: Date.now(),
    })
  },
})

export const list = query({
  args: { status: v.optional(v.string()) },
  handler: async (ctx, { status }) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('Unauthorized')

    if (status) {
      return await ctx.db
        .query('inquiries')
        .withIndex('by_status', (q) => q.eq('status', status))
        .order('desc')
        .collect()
    }

    return await ctx.db
      .query('inquiries')
      .withIndex('by_createdAt')
      .order('desc')
      .collect()
  },
})

export const get = query({
  args: { id: v.id('inquiries') },
  handler: async (ctx, { id }) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('Unauthorized')

    return await ctx.db.get(id)
  },
})
