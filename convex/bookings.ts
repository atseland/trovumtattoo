import { mutation, query } from './_generated/server'
import { v } from 'convex/values'
import { cancelBooking, createBooking, updateBooking } from './lib/bookings/mutations'
import {
  getBooking,
  listBookingsByProject,
  listUpcomingBookings,
  listUpcomingBookingsWithDetails,
} from './lib/bookings/queries'

export const create = mutation({
  args: {
    projectId: v.id('projects'),
    startAt: v.number(),
    endAt: v.number(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => await createBooking(ctx, args),
})

export const update = mutation({
  args: {
    id: v.id('bookings'),
    startAt: v.optional(v.number()),
    endAt: v.optional(v.number()),
    status: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, { id, ...fields }) => await updateBooking(ctx, id, fields),
})

export const cancel = mutation({
  args: { id: v.id('bookings') },
  handler: async (ctx, { id }) => await cancelBooking(ctx, id),
})

export const listUpcoming = query({
  args: {},
  handler: async (ctx) => await listUpcomingBookings(ctx),
})

export const listUpcomingWithDetails = query({
  args: {},
  handler: async (ctx) => await listUpcomingBookingsWithDetails(ctx),
})

export const listByProject = query({
  args: { projectId: v.id('projects') },
  handler: async (ctx, { projectId }) => await listBookingsByProject(ctx, projectId),
})

export const searchWithDetails = query({
  args: { searchQuery: v.string() },
  handler: async (ctx, { searchQuery }) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('Unauthorized')

    const normalizedQuery = searchQuery.trim().toLowerCase()
    if (normalizedQuery.length < 2) return []

    const bookings = await ctx.db.query('bookings').withIndex('by_startAt').order('desc').collect()
    const rows = await Promise.all(
      bookings.map(async (booking) => {
        const project = await ctx.db.get(booking.projectId)
        const client = project ? await ctx.db.get(project.clientId) : null
        return { ...booking, project, client }
      }),
    )

    return rows
      .filter((row) => {
        const haystack = [
          row.status,
          row.notes,
          row.project?.status,
          row.client?.name,
          row.client?.email,
          row.client?.phone,
          row.client?.instagramHandle,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()

        return haystack.includes(normalizedQuery)
      })
      .slice(0, 20)
  },
})

export const get = query({
  args: { id: v.id('bookings') },
  handler: async (ctx, { id }) => await getBooking(ctx, id),
})
