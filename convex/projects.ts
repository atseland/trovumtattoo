import { mutation, query } from './_generated/server'
import { v } from 'convex/values'
import { assertNonNegative, assertOptionalStringLength } from './lib/validate'

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
    aftercareSentAt: v.optional(v.number()),
    reviewRequestedAt: v.optional(v.number()),
  },
  handler: async (ctx, { id, status, ...fields }) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('Unauthorized')

    if (fields.estimatedPrice !== undefined) assertNonNegative(fields.estimatedPrice, 'estimatedPrice')
    if (fields.depositAmount !== undefined) assertNonNegative(fields.depositAmount, 'depositAmount')
    assertOptionalStringLength(fields.internalNotes, 'internalNotes', 10_000)
    assertOptionalStringLength(fields.paymentLink, 'paymentLink', 2_000)
    assertOptionalStringLength(fields.invoiceReference, 'invoiceReference', 200)
    assertOptionalStringLength(fields.paymentNote, 'paymentNote', 2_000)

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

export const searchWithClient = query({
  args: { searchQuery: v.string() },
  handler: async (ctx, { searchQuery }) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('Unauthorized')

    const normalizedQuery = searchQuery.trim().toLowerCase()
    if (normalizedQuery.length < 2) return []

    const projects = await ctx.db.query('projects').order('desc').collect()
    const rows = await Promise.all(
      projects.map(async (project) => {
        const client = await ctx.db.get(project.clientId)
        const inquiry = project.inquiryId ? await ctx.db.get(project.inquiryId) : null
        return { ...project, client, inquiry }
      }),
    )

    return rows
      .filter((row) => {
        const haystack = [
          row.status,
          row.client?.name,
          row.client?.email,
          row.client?.phone,
          row.client?.instagramHandle,
          row.inquiry?.name,
          row.inquiry?.email,
          row.inquiry?.description,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()

        return haystack.includes(normalizedQuery)
      })
      .slice(0, 20)
  },
})
