import { cronJobs } from 'convex/server'
import { api } from './_generated/api'
import { internal } from './_generated/api'

const crons = cronJobs()

// Synkroniser e-post hvert 5. minutt
crons.interval(
  'sync-mail',
  { minutes: 5 },
  api.mail.sync.syncMail
)

// Sjekk forfalt depositum daglig kl. 09:00 UTC
crons.daily(
  'check-deposit-overdue',
  { hourUTC: 9, minuteUTC: 0 },
  internal.notificationTriggers.checkDepositOverdue,
)

// Sjekk bookinger i morgen daglig kl. 08:00 UTC
crons.daily(
  'check-booking-tomorrow',
  { hourUTC: 8, minuteUTC: 0 },
  internal.notificationTriggers.checkBookingTomorrow,
)

// Sjekk bookinger i dag daglig kl. 07:00 UTC
crons.daily(
  'check-booking-today',
  { hourUTC: 7, minuteUTC: 0 },
  internal.notificationTriggers.checkBookingToday,
)

export default crons
