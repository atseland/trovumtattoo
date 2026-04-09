import type { Id } from '../../_generated/dataModel'
import type { MutationCtx } from '../../_generated/server'

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
  const identity = await ctx.auth.getUserIdentity()
  if (!identity) throw new Error('Unauthorized')
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
