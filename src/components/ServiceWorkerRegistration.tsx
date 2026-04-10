'use client'

import { useEffect } from 'react'

const shouldRegisterServiceWorker = process.env.NODE_ENV === 'production'

async function clearBrowserCaches() {
  if (!('caches' in window)) return

  const cacheNames = await caches.keys()
  await Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)))
}

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return

    const syncServiceWorker = async () => {
      try {
        if (!shouldRegisterServiceWorker) {
          const registrations = await navigator.serviceWorker.getRegistrations()
          await Promise.all(registrations.map((registration) => registration.unregister()))
          await clearBrowserCaches()
          return
        }

        await navigator.serviceWorker.register('/sw.js', { scope: '/' })
      } catch (err) {
        console.error('[SW] Sync failed:', err)
      }
    }

    void syncServiceWorker()
  }, [])

  return null
}
