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

export const get = query({
  args: { id: v.id('bookings') },
  handler: async (ctx, { id }) => await getBooking(ctx, id),
})
