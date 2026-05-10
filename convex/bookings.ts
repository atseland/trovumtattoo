import { mutation, query } from './_generated/server'
import { v } from 'convex/values'
import {
  archiveBooking,
  cancelBooking,
  createBooking,
  permanentlyDeleteArchivedBooking,
  restoreBooking,
  updateBooking,
} from './lib/bookings/mutations'
import {
  getBooking,
  listBookingsByProject,
  listUpcomingBookings,
  listUpcomingBookingsWithDetails,
} from './lib/bookings/queries'
import { requireAdmin } from './lib/adminAuth'
import {
  adminSearchHasQuery,
  ADMIN_SEARCH_SCAN_LIMIT,
  limitAdminSearchResults,
  matchesAdminSearch,
  normalizeAdminSearchQuery,
} from './lib/adminSearch'

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

export const archive = mutation({
  args: { id: v.id('bookings'), reason: v.optional(v.string()) },
  handler: async (ctx, { id, reason }) => await archiveBooking(ctx, id, reason),
})

export const restore = mutation({
  args: { id: v.id('bookings') },
  handler: async (ctx, { id }) => await restoreBooking(ctx, id),
})

export const permanentlyDelete = mutation({
  args: { id: v.id('bookings') },
  handler: async (ctx, { id }) => await permanentlyDeleteArchivedBooking(ctx, id),
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
  args: { projectId: v.id('projects'), archived: v.optional(v.boolean()) },
  handler: async (ctx, { projectId, archived }) => await listBookingsByProject(ctx, projectId, archived),
})

export const searchWithDetails = query({
  args: { searchQuery: v.string() },
  handler: async (ctx, { searchQuery }) => {
    await requireAdmin(ctx)

    const normalizedQuery = normalizeAdminSearchQuery(searchQuery)
    if (!adminSearchHasQuery(normalizedQuery)) return []

    const bookings = await ctx.db
      .query('bookings')
      .withIndex('by_startAt')
      .order('desc')
      .take(ADMIN_SEARCH_SCAN_LIMIT)
    const rows = await Promise.all(
      bookings.filter((booking) => booking.archivedAt === undefined).map(async (booking) => {
        const project = await ctx.db.get(booking.projectId)
        const client = project ? await ctx.db.get(project.clientId) : null
        return { ...booking, project, client }
      }),
    )

    return limitAdminSearchResults(
      rows.filter((row) =>
        matchesAdminSearch(normalizedQuery, [
          row.status,
          row.notes,
          row.project?.status,
          row.client?.name,
          row.client?.email,
          row.client?.phone,
          row.client?.instagramHandle,
        ])
      ),
    )
  },
})

export const get = query({
  args: { id: v.id('bookings') },
  handler: async (ctx, { id }) => await getBooking(ctx, id),
})
