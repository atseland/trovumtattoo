import { query } from './_generated/server'

export const getSummary = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('Unauthorized')

    const [nyCount, trengermInfoCount, venterDepositumCount, recentInquiries] = await Promise.all([
      ctx.db
        .query('inquiries')
        .withIndex('by_status', (q) => q.eq('status', 'Ny'))
        .collect()
        .then((r) => r.length),
      ctx.db
        .query('inquiries')
        .withIndex('by_status', (q) => q.eq('status', 'Trenger mer info'))
        .collect()
        .then((r) => r.length),
      ctx.db
        .query('inquiries')
        .withIndex('by_status', (q) => q.eq('status', 'Venter på depositum'))
        .collect()
        .then((r) => r.length),
      ctx.db
        .query('inquiries')
        .withIndex('by_createdAt')
        .order('desc')
        .take(5),
    ])

    // Kommende bookinger denne uken
    const now = Date.now()
    const weekEnd = now + 7 * 24 * 60 * 60 * 1000
    const upcomingBookings = await ctx.db
      .query('bookings')
      .withIndex('by_startAt', (q) => q.gte('startAt', now))
      .filter((q) => q.lte(q.field('startAt'), weekEnd))
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
