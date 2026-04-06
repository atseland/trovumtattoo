import { internalMutation } from './_generated/server'

export const checkDepositOverdue = internalMutation({
  args: {},
  handler: async (ctx) => {
    const cutoff = Date.now() - 48 * 60 * 60 * 1000 // 48 hours ago

    const pendingProjects = await ctx.db
      .query('projects')
      .filter((q) =>
        q.and(
          q.eq(q.field('depositStatus'), 'pending'),
          q.lt(q.field('createdAt'), cutoff),
        ),
      )
      .collect()

    for (const project of pendingProjects) {
      const client = await ctx.db.get(project.clientId)
      await ctx.db.insert('notifications', {
        type: 'deposit-overdue',
        title: 'Depositum forfalt',
        body: `Klient ${client?.name ?? 'ukjent'} har ikke betalt depositum på 48 timer`,
        relatedEntityType: 'project',
        relatedEntityId: project._id,
        priority: 'high',
        isRead: false,
        createdAt: Date.now(),
      })
    }
  },
})

export const checkBookingTomorrow = internalMutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now()
    const in24h = now + 24 * 60 * 60 * 1000

    const bookings = await ctx.db
      .query('bookings')
      .withIndex('by_startAt')
      .filter((q) =>
        q.and(
          q.gt(q.field('startAt'), now),
          q.lt(q.field('startAt'), in24h),
          q.eq(q.field('status'), 'scheduled'),
        ),
      )
      .collect()

    for (const booking of bookings) {
      const project = await ctx.db.get(booking.projectId)
      const client = project ? await ctx.db.get(project.clientId) : null
      const date = new Intl.DateTimeFormat('nb-NO', { dateStyle: 'short', timeStyle: 'short' }).format(
        new Date(booking.startAt),
      )
      await ctx.db.insert('notifications', {
        type: 'booking-tomorrow',
        title: 'Booking i morgen',
        body: `${client?.name ?? 'Ukjent'} — ${date}`,
        relatedEntityType: 'booking',
        relatedEntityId: booking._id,
        priority: 'normal',
        isRead: false,
        createdAt: Date.now(),
      })
    }
  },
})

export const checkBookingToday = internalMutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now()
    const in4h = now + 4 * 60 * 60 * 1000

    const bookings = await ctx.db
      .query('bookings')
      .withIndex('by_startAt')
      .filter((q) =>
        q.and(
          q.gt(q.field('startAt'), now),
          q.lt(q.field('startAt'), in4h),
          q.eq(q.field('status'), 'scheduled'),
        ),
      )
      .collect()

    for (const booking of bookings) {
      const project = await ctx.db.get(booking.projectId)
      const client = project ? await ctx.db.get(project.clientId) : null
      const date = new Intl.DateTimeFormat('nb-NO', { timeStyle: 'short' }).format(
        new Date(booking.startAt),
      )
      await ctx.db.insert('notifications', {
        type: 'booking-today',
        title: 'Booking i dag',
        body: `${client?.name ?? 'Ukjent'} kl. ${date}`,
        relatedEntityType: 'booking',
        relatedEntityId: booking._id,
        priority: 'high',
        isRead: false,
        createdAt: Date.now(),
      })
    }
  },
})
