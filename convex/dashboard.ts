import { query } from './_generated/server'
import { requireAdmin } from './lib/adminAuth'

export const getSummary = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx)

    const [nyCount, trengermInfoCount, venterDepositumCount, recentInquiries] = await Promise.all([
      ctx.db
        .query('inquiries')
        .withIndex('by_status_archived_createdAt', (q) => q.eq('status', 'Ny').eq('archivedAt', undefined))
        .collect()
        .then((r) => r.length),
      ctx.db
        .query('inquiries')
        .withIndex('by_status_archived_createdAt', (q) =>
          q.eq('status', 'Trenger mer info').eq('archivedAt', undefined)
        )
        .collect()
        .then((r) => r.length),
      ctx.db
        .query('inquiries')
        .withIndex('by_status_archived_createdAt', (q) =>
          q.eq('status', 'Venter på depositum').eq('archivedAt', undefined)
        )
        .collect()
        .then((r) => r.length),
      ctx.db
        .query('inquiries')
        .withIndex('by_archived_createdAt', (q) => q.eq('archivedAt', undefined))
        .order('desc')
        .take(5),
    ])

    // Kommende bookinger denne uken
    const now = Date.now()
    const weekEnd = now + 7 * 24 * 60 * 60 * 1000
    const upcomingBookings = await ctx.db
      .query('bookings')
      .withIndex('by_startAt', (q) => q.gte('startAt', now))
      .filter((q) =>
        q.and(
          q.lte(q.field('startAt'), weekEnd),
          q.neq(q.field('status'), 'cancelled'),
          q.eq(q.field('archivedAt'), undefined),
        ),
      )
      .collect()

    return {
      nyCount,
      trengermInfoCount,
      venterDepositumCount,
      upcomingBookingsCount: upcomingBookings.length,
      recentInquiries,
    }
  },
})
