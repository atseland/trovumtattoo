import { adminPwaManifest } from '@/lib/admin/pwa'

export function GET() {
  return Response.json(adminPwaManifest, {
    headers: {
      'Content-Type': 'application/manifest+json; charset=utf-8',
      'Cache-Control': 'public, max-age=0, must-revalidate',
    },
  })
}
