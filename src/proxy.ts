import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isAdminPwaAsset = createRouteMatcher([
  '/admin/manifest.webmanifest',
  '/admin/service-worker.js',
])
const isProtectedRoute = createRouteMatcher(['/admin(.*)'])

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req) && !isAdminPwaAsset(req)) {
    await auth.protect({ unauthenticatedUrl: new URL('/sign-in', req.url).toString() })
  }
})

export const config = {
  matcher: ['/admin(.*)', '/sign-in(.*)', '/sign-up(.*)'],
}
