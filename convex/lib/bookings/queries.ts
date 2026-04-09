import type { Id } from '../../_generated/dataModel'
import type { QueryCtx } from '../../_generated/server'

async function requireIdentity(ctx: QueryCtx) {
  const identity = await ctx.auth.getUserIdentity()
  if (!identity) throw new Error('Unauthorized')
}

async function listUpcomingBase(ctx: QueryCtx) {
  const now = Date.now()
  return await ctx.db
    .query('bookings')
    .withIndex('by_startAt', (query) => query.gte('startAt', now))
    .filter((query) => query.neq(query.field('status'), 'cancelled'))
    .order('asc')
    .collect()
}

export async function listUpcomingBookings(ctx: QueryCtx) {
  await requireIdentity(ctx)
  return await listUpcomingBase(ctx)
}

export async function listUpcomingBookingsWithDetails(ctx: QueryCtx) {
  await requireIdentity(ctx)
  const bookings = await listUpcomingBase(ctx)

  return await Promise.all(
    bookings.map(async (booking) => {
      const project = await ctx.db.get(booking.projectId)
      const client = project ? await ctx.db.get(project.clientId) : null
      return { ...booking, project, client }
    }),
  )
}

export async function listBookingsByProject(ctx: QueryCtx, projectId: Id<'projects'>) {
  await requireIdentity(ctx)

  return await ctx.db
    .query('bookings')
    .withIndex('by_project', (query) => query.eq('projectId', projectId))
    .order('asc')
    .collect()
}

export async function getBooking(ctx: QueryCtx, id: Id<'bookings'>) {
  await requireIdentity(ctx)
  return await ctx.db.get(id)
}
