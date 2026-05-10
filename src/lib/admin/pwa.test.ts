import { describe, expect, it } from 'vitest'
import { adminPwaManifest, createAdminServiceWorkerScript, getAdminNotificationTarget } from './pwa'

describe('admin PWA contract', () => {
  it('scopes install metadata to the admin surface', () => {
    expect(adminPwaManifest.start_url).toBe('/admin')
    expect(adminPwaManifest.scope).toBe('/admin')
    expect(adminPwaManifest.name).toContain('Admin')
  })

  it('keeps notification clicks inside admin routes', () => {
    expect(getAdminNotificationTarget()).toBe('/admin/notifications')
    expect(getAdminNotificationTarget('/admin/mail/thread-123')).toBe('/admin/mail/thread-123')
    expect(getAdminNotificationTarget('/kontakt')).toBe('/admin/notifications')
    expect(getAdminNotificationTarget('https://example.com/admin')).toBe('/admin/notifications')
  })

  it('ships an admin push service worker', () => {
    const script = createAdminServiceWorkerScript()

    expect(script).toContain("self.addEventListener('push'")
    expect(script).toContain("self.addEventListener('notificationclick'")
    expect(script).toContain('/admin/notifications')
    expect(script).not.toContain('/manifest.json')
  })
})
