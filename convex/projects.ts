import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

export const create = mutation({
  args: {
    clientId: v.id('clients'),
    inquiryId: v.optional(v.id('inquiries')),
    status: v.optional(v.string()),
  },
  handler: async (ctx, { clientId, inquiryId, status }) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('Unauthorized')

    const client = await ctx.db.get(clientId)
    if (!client) throw new Error('Client not found')

    const now = Date.now()
    const projectId = await ctx.db.insert('projects', {
      clientId,
      inquiryId,
      status: status ?? 'Ny',
      createdAt: now,
      updatedAt: now,
    })

    await ctx.db.insert('activityLog', {
      entityType: 'project',
      entityId: projectId,
      action: 'created',
      createdAt: now,
    })

    return projectId
  },
})

export const get = query({
  args: { id: v.id('projects') },
  handler: async (ctx, { id }) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('Unauthorized')

    return await ctx.db.get(id)
  },
})

export const update = mutation({
  args: {
    id: v.id('projects'),
    status: v.optional(v.string()),
    estimatedPrice: v.optional(v.number()),
    internalNotes: v.optional(v.string()),
    depositAmount: v.optional(v.number()),
    depositStatus: v.optional(v.string()),
    paymentLink: v.optional(v.string()),
    invoiceReference: v.optional(v.string()),
    accountingStatus: v.optional(v.string()),
    paymentNote: v.optional(v.string()),
  },
  handler: async (ctx, { id, status, ...fields }) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('Unauthorized')

    const project = await ctx.db.get(id)
    if (!project) throw new Error('Project not found')

    const patch: Record<string, unknown> = { updatedAt: Date.now() }
    if (status !== undefined) patch.status = status
    for (const [k, v] of Object.entries(fields)) {
      if (v !== undefined) patch[k] = v
    }

    await ctx.db.patch(id, patch)

    if (status !== undefined && status !== project.status) {
      await ctx.db.insert('activityLog', {
        entityType: 'project',
        entityId: id,
        action: 'status_changed',
        payload: { from: project.status, to: status },
        createdAt: Date.now(),
      })
    }
  },
})

export const listByClient = query({
  args: { clientId: v.id('clients') },
  handler: async (ctx, { clientId }) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('Unauthorized')

    return await ctx.db
      .query('projects')
      .withIndex('by_client', (q) => q.eq('clientId', clientId))
      .order('desc')
      .collect()
  },
})
