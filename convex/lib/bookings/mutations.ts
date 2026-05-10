import type { Id } from '../../_generated/dataModel'
import type { MutationCtx } from '../../_generated/server'
import { requireAdmin } from '../adminAuth'
import { assertBookingCanBeArchived } from './archivePolicy'

interface CreateBookingArgs {
  projectId: Id<'projects'>
  startAt: number
  endAt: number
  notes?: string
}

interface UpdateBookingArgs {
  startAt?: number
  endAt?: number
  status?: string
  notes?: string
}

async function requireIdentity(ctx: MutationCtx) {
  return await requireAdmin(ctx)
}

function assertBookingRange(startAt: number, endAt: number) {
  if (startAt >= endAt) throw new Error('startAt må være før endAt')
}

async function logBookingCreated(ctx: MutationCtx, bookingId: Id<'bookings'>, startAt: number, endAt: number, now: number) {
  await ctx.db.insert('activityLog', {
    entityType: 'booking',
    entityId: bookingId,
    action: 'created',
    payload: { startAt, endAt },
    createdAt: now,
  })

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
}

export async function createBooking(ctx: MutationCtx, { projectId, startAt, endAt, notes }: CreateBookingArgs) {
  await requireIdentity(ctx)
  assertBookingRange(startAt, endAt)

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

  await logBookingCreated(ctx, bookingId, startAt, endAt, now)
  return bookingId
}

export async function updateBooking(ctx: MutationCtx, id: Id<'bookings'>, fields: UpdateBookingArgs) {
  await requireIdentity(ctx)

  if (fields.startAt !== undefined || fields.endAt !== undefined) {
    const booking = await ctx.db.get(id)
    if (!booking) throw new Error('Booking not found')
    const start = fields.startAt ?? booking.startAt
    const end = fields.endAt ?? booking.endAt
    assertBookingRange(start, end)
  }

  if (fields.notes !== undefined && fields.notes.length > 5_000) {
    throw new Error('notes cannot exceed 5000 characters')
  }

  const patch: Record<string, unknown> = { updatedAt: Date.now() }
  for (const [key, value] of Object.entries(fields)) {
    if (value !== undefined) patch[key] = value
  }
  await ctx.db.patch(id, patch)
}

export async function cancelBooking(ctx: MutationCtx, id: Id<'bookings'>) {
  await requireIdentity(ctx)

  await ctx.db.patch(id, { status: 'cancelled', updatedAt: Date.now() })
  await ctx.db.insert('activityLog', {
    entityType: 'booking',
    entityId: id,
    action: 'status_changed',
    payload: { to: 'cancelled' },
    createdAt: Date.now(),
  })
}

export async function archiveBooking(ctx: MutationCtx, id: Id<'bookings'>, reason?: string) {
  const identity = await requireIdentity(ctx)

  const booking = await ctx.db.get(id)
  if (!booking) throw new Error('Booking not found')

  assertBookingCanBeArchived(booking)

  const now = Date.now()
  await ctx.db.patch(id, {
    archivedAt: now,
    archivedBy: identity.subject,
    archiveReason: reason,
    updatedAt: now,
  })
  await ctx.db.insert('activityLog', {
    entityType: 'booking',
    entityId: id,
    action: 'archived',
    payload: reason ? { reason } : undefined,
    createdAt: now,
  })
}

export async function restoreBooking(ctx: MutationCtx, id: Id<'bookings'>) {
  await requireIdentity(ctx)

  const booking = await ctx.db.get(id)
  if (!booking) throw new Error('Booking not found')

  const now = Date.now()
  await ctx.db.patch(id, {
    archivedAt: undefined,
    archivedBy: undefined,
    archiveReason: undefined,
    updatedAt: now,
  })
  await ctx.db.insert('activityLog', {
    entityType: 'booking',
    entityId: id,
    action: 'restored',
    createdAt: now,
  })
}

export async function permanentlyDeleteArchivedBooking(ctx: MutationCtx, id: Id<'bookings'>) {
  await requireIdentity(ctx)

  const booking = await ctx.db.get(id)
  if (!booking) throw new Error('Booking not found')
  if (!booking.archivedAt) throw new Error('Booking must be archived before permanent delete')

  const activityEntries = await ctx.db
    .query('activityLog')
    .withIndex('by_entity', (query) => query.eq('entityType', 'booking').eq('entityId', id))
    .collect()
  await Promise.all(activityEntries.map((entry) => ctx.db.delete(entry._id)))

  const notifications = await ctx.db
    .query('notifications')
    .withIndex('by_related_entity', (query) =>
      query.eq('relatedEntityType', 'booking').eq('relatedEntityId', id)
    )
    .collect()
  await Promise.all(
    notifications.map((notification) => ctx.db.delete(notification._id)),
  )

  await ctx.db.delete(id)
}
