import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isProtectedRoute = createRouteMatcher(['/admin(.*)'])

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect({ unauthenticatedUrl: new URL('/sign-in', req.url).toString() })
  }
})

export const config = {
  matcher: ['/admin(.*)', '/sign-in(.*)', '/sign-up(.*)'],
}
