'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useQuery, useConvexAuth } from 'convex/react'
import { LayoutDashboard, MessageSquare, Users, Calendar, Settings, Mail, Bell, Search } from 'lucide-react'
// TODO: fjern cast etter npx convex dev
import { api } from '../../../convex/_generated/api'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/inquiries', label: 'Forespørsler', icon: MessageSquare },
  { href: '/admin/clients', label: 'Kunder', icon: Users },
  { href: '/admin/mail', label: 'Mail', icon: Mail },
  { href: '/admin/calendar', label: 'Kalender', icon: Calendar },
  { href: '/admin/notifications', label: 'Varsler', icon: Bell },
  { href: '/admin/search', label: 'Søk', icon: Search },
  { href: '/admin/settings', label: 'Innstillinger', icon: Settings },
]

export function AdminNav() {
  const pathname = usePathname()
  const { isAuthenticated } = useConvexAuth()

  const unreadCount = useQuery((api as any).notifications.countUnread, isAuthenticated ? {} : 'skip') ?? 0

  function isActive(item: (typeof navItems)[0]) {
    if (item.exact) return pathname === item.href
    return pathname.startsWith(item.href)
  }

  return (
    <>
      {/* Mobile: bottom navigation */}
      <nav
        className='fixed bottom-0 left-0 right-0 z-50 flex border-t md:hidden'
        style={{ background: '#141210', borderColor: '#2a2724' }}
      >
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item)
          const isBell = item.href === '/admin/notifications'
          return (
            <Link
              key={item.href}
              href={item.href}
              className='flex flex-1 flex-col items-center justify-center gap-1 py-2 text-xs transition-colors'
              style={{ minHeight: '64px', color: active ? '#c9933a' : '#7a6e62', position: 'relative' }}
            >
              <div style={{ position: 'relative', display: 'inline-flex' }}>
                <Icon size={22} strokeWidth={1.5} />
                {isBell && unreadCount > 0 && (
                  <span style={{ position: 'absolute', top: '-4px', right: '-6px', background: '#c9933a', color: '#0d0c0b', fontSize: '0.6rem', fontWeight: '700', padding: '0 4px', borderRadius: '999px', minWidth: '14px', textAlign: 'center' }}>
                    {unreadCount}
                  </span>
                )}
              </div>
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Desktop: sidebar */}
      <aside
        className='hidden md:flex md:w-56 md:flex-col md:border-r md:shrink-0'
        style={{ background: '#141210', borderColor: '#2a2724' }}
      >
        <div className='px-4 py-6'>
          <span className='font-serif italic text-xl' style={{ color: '#c9b99a' }}>
            Trovum
          </span>
        </div>
        <nav className='flex flex-col gap-1 px-2'>
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item)
            const isBell = item.href === '/admin/notifications'
            return (
              <Link
                key={item.href}
                href={item.href}
                className='flex items-center gap-3 rounded px-3 py-3 text-sm transition-colors'
                style={{
                  minHeight: '48px',
                  background: active ? '#1c1916' : 'transparent',
                  color: active ? '#c9933a' : '#7a6e62',
                }}
              >
                <div style={{ position: 'relative', display: 'inline-flex' }}>
                  <Icon size={18} strokeWidth={1.5} />
                  {isBell && unreadCount > 0 && (
                    <span style={{ position: 'absolute', top: '-4px', right: '-6px', background: '#c9933a', color: '#0d0c0b', fontSize: '0.55rem', fontWeight: '700', padding: '0 3px', borderRadius: '999px', minWidth: '13px', textAlign: 'center' }}>
                      {unreadCount}
                    </span>
                  )}
                </div>
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </aside>
    </>
  )
}
