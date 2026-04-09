'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useQuery, useConvexAuth } from 'convex/react'
import { LayoutDashboard, MessageSquare, Users, Calendar, Settings, Mail, Bell, Search } from 'lucide-react'
import { api } from '@convex/_generated/api'
import { Logo } from '@/components/Logo'

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

  const unreadCount = useQuery(api.notifications.countUnread, isAuthenticated ? {} : 'skip') ?? 0

  function isActive(item: (typeof navItems)[0]) {
    if (item.exact) return pathname === item.href
    return pathname.startsWith(item.href)
  }

  return (
    <>
      {/* Mobile: bottom navigation */}
      <nav className='fixed bottom-0 left-0 right-0 z-50 flex border-t border-rule bg-panel md:hidden'>
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item)
          const isBell = item.href === '/admin/notifications'
          return (
            <Link
              key={item.href}
              href={item.href}
              className='flex flex-1 flex-col items-center justify-center gap-1 py-2 transition-colors duration-[200ms]'
              style={{
                minHeight: '64px',
                color: active ? 'var(--accent)' : 'var(--nav)',
              }}
            >
              <div className='relative inline-flex'>
                <Icon size={22} strokeWidth={1.5} />
                {isBell && unreadCount > 0 && (
                  <span
                    className='absolute font-sans font-bold text-center'
                    style={{
                      top: '-4px',
                      right: '-6px',
                      background: 'var(--accent)',
                      color: 'var(--bg)',
                      fontSize: '0.6rem',
                      padding: '0 4px',
                      borderRadius: '2px',
                      minWidth: '14px',
                    }}
                  >
                    {unreadCount}
                  </span>
                )}
              </div>
              <span className='font-sans text-[7px] uppercase tracking-[0.08em]'>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Desktop: sidebar */}
      <aside className='hidden md:flex md:w-56 md:flex-col md:border-r md:shrink-0 border-rule bg-panel'>
        <div className='px-4 py-6'>
          <Logo context='nav' />
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
                className='flex items-center gap-3 px-3 py-3 font-sans text-[9.5px] tracking-[0.08em] uppercase transition-colors duration-[200ms]'
                style={{
                  minHeight: '44px',
                  background: active ? 'rgba(237,233,230,0.04)' : 'transparent',
                  color: active ? 'var(--accent)' : 'var(--nav)',
                }}
              >
                <div className='relative inline-flex'>
                  <Icon size={18} strokeWidth={1.5} />
                  {isBell && unreadCount > 0 && (
                    <span
                      className='absolute font-sans font-bold text-center'
                      style={{
                        top: '-4px',
                        right: '-6px',
                        background: 'var(--accent)',
                        color: 'var(--bg)',
                        fontSize: '0.55rem',
                        padding: '0 3px',
                        borderRadius: '2px',
                        minWidth: '13px',
                      }}
                    >
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
