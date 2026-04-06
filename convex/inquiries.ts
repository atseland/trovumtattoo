import { mutation, query } from './_generated/server'
import { v } from 'convex/values'
import { Id } from './_generated/dataModel'

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
    await ctx.db.insert('notifications', {
      type: 'new-inquiry',
      title: 'Ny forespørsel',
      body: `${args.name} sendte inn en forespørsel`,
      relatedEntityType: 'inquiry',
      relatedEntityId: inquiryId,
      priority: 'high',
      isRead: false,
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
  args: {
    status: v.optional(v.string()),
    coverUp: v.optional(v.boolean()),
    touchUp: v.optional(v.boolean()),
  },
  handler: async (ctx, { status, coverUp, touchUp }) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('Unauthorized')

    let rows
    if (status) {
      rows = await ctx.db
        .query('inquiries')
        .withIndex('by_status', (q) => q.eq('status', status))
        .order('desc')
        .collect()
    } else {
      rows = await ctx.db
        .query('inquiries')
        .withIndex('by_createdAt')
        .order('desc')
        .collect()
    }

    if (coverUp !== undefined) rows = rows.filter((r) => r.coverUp === coverUp)
    if (touchUp !== undefined) rows = rows.filter((r) => r.touchUp === touchUp)

    return rows
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

export const getReferenceImages = query({
  args: { inquiryId: v.id('inquiries') },
  handler: async (ctx, { inquiryId }) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('Unauthorized')

    const refs = await ctx.db
      .query('referenceImages')
      .withIndex('by_inquiry', (q) => q.eq('inquiryId', inquiryId))
      .collect()

    const urls = await Promise.all(refs.map((r) => ctx.storage.getUrl(r.storageId)))
    return urls.filter((u): u is string => u !== null)
  },
})

export const addReferenceImages = mutation({
  args: {
    inquiryId: v.id('inquiries'),
    images: v.array(
      v.object({
        storageId: v.id('_storage'),
        url: v.string(),
        altText: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, { inquiryId, images }) => {
    const now = Date.now()
    await Promise.all(
      images.map((img) =>
        ctx.db.insert('referenceImages', {
          inquiryId,
          storageId: img.storageId,
          url: img.url,
          altText: img.altText,
          uploadedAt: now,
        })
      )
    )
  },
})
