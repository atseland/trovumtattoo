export const ADMIN_PWA_MANIFEST_PATH = '/admin/manifest.webmanifest'
export const ADMIN_SERVICE_WORKER_PATH = '/admin/service-worker.js'
export const ADMIN_SERVICE_WORKER_SCOPE = '/admin'
export const ADMIN_NOTIFICATION_FALLBACK_PATH = '/admin/notifications'

export const adminPwaManifest = {
  name: 'Trovum Tattoo Admin',
  short_name: 'Trovum Admin',
  description: 'Adminflate for Trovum Tattoo',
  theme_color: '#0d0b09',
  background_color: '#0d0b09',
  display: 'standalone',
  start_url: '/admin',
  scope: ADMIN_SERVICE_WORKER_SCOPE,
  orientation: 'portrait-primary',
  icons: [
    {
      src: '/icons/icon-192.svg',
      sizes: '192x192',
      type: 'image/svg+xml',
      purpose: 'any maskable',
    },
    {
      src: '/icons/icon-512.svg',
      sizes: '512x512',
      type: 'image/svg+xml',
      purpose: 'any maskable',
    },
  ],
} as const

export function getAdminNotificationTarget(url?: string | null) {
  if (!url) return ADMIN_NOTIFICATION_FALLBACK_PATH

  try {
    const base = 'https://trovumtattoo.no'
    const parsed = new URL(url, base)

    if (parsed.origin !== base) return ADMIN_NOTIFICATION_FALLBACK_PATH
    if (parsed.pathname === '/admin' || parsed.pathname.startsWith('/admin/')) {
      return `${parsed.pathname}${parsed.search}${parsed.hash}`
    }
  } catch {
    return ADMIN_NOTIFICATION_FALLBACK_PATH
  }

  return ADMIN_NOTIFICATION_FALLBACK_PATH
}

export function createAdminServiceWorkerScript() {
  return `
const DEFAULT_NOTIFICATION_URL = '${ADMIN_NOTIFICATION_FALLBACK_PATH}'

function getTargetUrl(data) {
  try {
    const rawUrl = data && typeof data.url === 'string' ? data.url : DEFAULT_NOTIFICATION_URL
    const parsed = new URL(rawUrl, self.location.origin)

    if (parsed.origin !== self.location.origin) return DEFAULT_NOTIFICATION_URL
    if (parsed.pathname === '/admin' || parsed.pathname.startsWith('/admin/')) {
      return parsed.pathname + parsed.search + parsed.hash
    }
  } catch (error) {
    return DEFAULT_NOTIFICATION_URL
  }

  return DEFAULT_NOTIFICATION_URL
}

self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting())
})

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim())
})

self.addEventListener('push', (event) => {
  let data = {}

  try {
    data = event.data ? event.data.json() : {}
  } catch (error) {
    data = {
      title: 'Trovum admin',
      body: event.data ? event.data.text() : undefined,
    }
  }

  const title = typeof data.title === 'string' && data.title ? data.title : 'Trovum admin'
  const options = {
    body: typeof data.body === 'string' ? data.body : undefined,
    data: { url: getTargetUrl(data) },
    icon: '/icons/icon-192.svg',
    badge: '/icons/icon-192.svg',
    tag: typeof data.tag === 'string' ? data.tag : 'trovum-admin',
    renotify: true,
  }

  event.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const targetUrl = getTargetUrl(event.notification.data)

  event.waitUntil((async () => {
    const windows = await self.clients.matchAll({
      type: 'window',
      includeUncontrolled: true,
    })

    for (const client of windows) {
      const clientUrl = new URL(client.url)
      if (clientUrl.origin !== self.location.origin) continue
      if (clientUrl.pathname !== '/admin' && !clientUrl.pathname.startsWith('/admin/')) continue

      if ('navigate' in client && clientUrl.pathname !== targetUrl) {
        await client.navigate(targetUrl)
      }

      if ('focus' in client) return client.focus()
    }

    if (self.clients.openWindow) return self.clients.openWindow(targetUrl)
  })())
})
`.trim()
}
