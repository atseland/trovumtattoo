'use client'

import { useEffect } from 'react'
import {
  ADMIN_SERVICE_WORKER_PATH,
  ADMIN_SERVICE_WORKER_SCOPE,
} from '@/lib/admin/pwa'

const shouldRegisterAdminServiceWorker = process.env.NODE_ENV === 'production'

async function clearBrowserCaches() {
  if (!('caches' in window)) return

  const cacheNames = await caches.keys()
  await Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)))
}

function isLegacyRootServiceWorker(registration: ServiceWorkerRegistration) {
  const scopePath = new URL(registration.scope).pathname
  const worker = registration.active ?? registration.waiting ?? registration.installing
  const scriptPath = worker ? new URL(worker.scriptURL).pathname : null

  return scopePath === '/' || scriptPath === '/sw.js'
}

async function unregisterLegacyRootServiceWorkers() {
  const registrations = await navigator.serviceWorker.getRegistrations()
  const legacyRegistrations = registrations.filter(isLegacyRootServiceWorker)

  if (!legacyRegistrations.length) return

  await Promise.all(legacyRegistrations.map((registration) => registration.unregister()))
  await clearBrowserCaches()
}

export function AdminServiceWorkerRegistration() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return

    const syncAdminServiceWorker = async () => {
      try {
        await unregisterLegacyRootServiceWorkers()

        if (!shouldRegisterAdminServiceWorker) return

        const registration = await navigator.serviceWorker.register(ADMIN_SERVICE_WORKER_PATH, {
          scope: ADMIN_SERVICE_WORKER_SCOPE,
          updateViaCache: 'none',
        })
        await registration.update()
      } catch (err) {
        console.error('[Admin SW] Sync failed:', err)
      }
    }

    void syncAdminServiceWorker()
  }, [])

  return null
}
