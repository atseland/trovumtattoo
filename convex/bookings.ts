import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

export const create = mutation({
  args: {
    projectId: v.id('projects'),
    startAt: v.number(),
    endAt: v.number(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, { projectId, startAt, endAt, notes }) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('Unauthorized')

    if (startAt >= endAt) throw new Error('startAt må være før endAt')

    const now = Date.now()
    const bookingId = await ctx.db.insert('bookings', {
      projectId,
      startAt,
      endAt,
      notes,
      status: 'scheduled',
      createdAt: now,
      updatedAt: now,
    })

    await ctx.db.insert('activityLog', {
      entityType: 'booking',
      entityId: bookingId,
      action: 'created',
      payload: { startAt, endAt },
      createdAt: now,
    })

    // Notification if booking is within 24 hours
    if (startAt - now <= 24 * 60 * 60 * 1000) {
      await ctx.db.insert('notifications', {
        type: 'booking-today',
        title: 'Booking i dag',
        body: `Du har en booking om ${Math.round((startAt - now) / 3600000)} time(r).`,
        relatedEntityType: 'booking',
        relatedEntityId: bookingId,
        priority: 'high',
        isRead: false,
        createdAt: now,
      })
    }

    return bookingId
  },
})

export const update = mutation({
  args: {
    id: v.id('bookings'),
    startAt: v.optional(v.number()),
    endAt: v.optional(v.number()),
    status: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, { id, ...fields }) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('Unauthorized')

    // Validate time range if both or either are provided
    if (fields.startAt !== undefined || fields.endAt !== undefined) {
      const booking = await ctx.db.get(id)
      if (!booking) throw new Error('Booking not found')
      const start = fields.startAt ?? booking.startAt
      const end = fields.endAt ?? booking.endAt
      if (start >= end) throw new Error('startAt må være før endAt')
    }
    if (fields.notes !== undefined && fields.notes.length > 5_000) {
      throw new Error('notes cannot exceed 5000 characters')
    }

    const patch: Record<string, unknown> = { updatedAt: Date.now() }
    for (const [k, v] of Object.entries(fields)) {
      if (v !== undefined) patch[k] = v
    }
    await ctx.db.patch(id, patch)
  },
})

export const cancel = mutation({
  args: { id: v.id('bookings') },
  handler: async (ctx, { id }) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('Unauthorized')

    await ctx.db.patch(id, { status: 'cancelled', updatedAt: Date.now() })
    await ctx.db.insert('activityLog', {
      entityType: 'booking',
      entityId: id,
      action: 'status_changed',
      payload: { to: 'cancelled' },
      createdAt: Date.now(),
    })
  },
})

export const listUpcoming = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('Unauthorized')

    const now = Date.now()
    return await ctx.db
      .query('bookings')
      .withIndex('by_startAt', (q) => q.gte('startAt', now))
      .filter((q) => q.neq(q.field('status'), 'cancelled'))
      .order('asc')
      .collect()
  },
})

export const listUpcomingWithDetails = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('Unauthorized')

    const now = Date.now()
    const bookings = await ctx.db
      .query('bookings')
      .withIndex('by_startAt', (q) => q.gte('startAt', now))
      .filter((q) => q.neq(q.field('status'), 'cancelled'))
      .order('asc')
      .collect()

    return await Promise.all(
      bookings.map(async (booking) => {
        const project = await ctx.db.get(booking.projectId)
        const client = project ? await ctx.db.get(project.clientId) : null
        return { ...booking, project, client }
      })
    )
  },
})

export const listByProject = query({
  args: { projectId: v.id('projects') },
  handler: async (ctx, { projectId }) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('Unauthorized')

    return await ctx.db
      .query('bookings')
      .withIndex('by_project', (q) => q.eq('projectId', projectId))
      .order('asc')
      .collect()
  },
})

export const get = query({
  args: { id: v.id('bookings') },
  handler: async (ctx, { id }) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('Unauthorized')

    return await ctx.db.get(id)
  },
})
