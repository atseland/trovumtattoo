import { createAdminServiceWorkerScript } from '@/lib/admin/pwa'

export function GET() {
  return new Response(createAdminServiceWorkerScript(), {
    headers: {
      'Content-Type': 'application/javascript; charset=utf-8',
      'Cache-Control': 'public, max-age=0, must-revalidate',
      'Service-Worker-Allowed': '/admin',
    },
  })
}
