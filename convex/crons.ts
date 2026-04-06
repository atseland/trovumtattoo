import { cronJobs } from 'convex/server'
import { api } from './_generated/api'

const crons = cronJobs()

// Synkroniser e-post hvert 5. minutt
crons.interval(
  'sync-mail',
  { minutes: 5 },
  // TODO: fjern cast etter npx convex dev
  (api as any).mail.sync.syncMail
)

export default crons
