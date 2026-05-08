'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, MessageSquare, Users, Calendar, Settings, Mail, Search, MoreHorizontal } from 'lucide-react'
import { Logo } from '@/components/Logo'

type NavItem = {
  href: string
  label: string
  icon: typeof LayoutDashboard
  exact?: boolean
}

const primaryMobileNavItems: NavItem[] = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/inquiries', label: 'Forespørsler', icon: MessageSquare },
  { href: '/admin/search', label: 'Søk', icon: Search },
  { href: '/admin/calendar', label: 'Kalender', icon: Calendar },
]

const secondaryMobileNavItems: NavItem[] = [
  { href: '/admin/clients', label: 'Kunder', icon: Users },
  { href: '/admin/mail', label: 'Mail', icon: Mail },
  { href: '/admin/settings', label: 'Innstillinger', icon: Settings },
]

const navItems = [...primaryMobileNavItems, ...secondaryMobileNavItems]

export function AdminNav() {
  const pathname = usePathname()
  const [moreOpen, setMoreOpen] = useState(false)

  function isActive(item: (typeof navItems)[0]) {
    if (item.exact) return pathname === item.href
    return pathname.startsWith(item.href)
  }

  const isMoreActive = secondaryMobileNavItems.some((item) => isActive(item))

  return (
    <>
      {/* Mobile: bottom navigation */}
      <div className='md:hidden'>
        {moreOpen && (
          <div className='fixed bottom-[64px] left-0 right-0 z-50 border-t border-rule bg-panel px-3 py-3 shadow-[0_-12px_30px_rgba(0,0,0,0.26)]'>
            <div className='grid grid-cols-2 gap-2'>
              {secondaryMobileNavItems.map((item) => {
                const Icon = item.icon
                const active = isActive(item)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMoreOpen(false)}
                    className='flex min-h-[48px] items-center gap-3 border border-rule px-3 font-sans text-[9px] uppercase tracking-[0.1em] no-underline transition-colors duration-[200ms]'
                    style={{
                      background: active ? 'rgba(237,233,230,0.04)' : 'transparent',
                      color: active ? 'var(--accent)' : 'var(--nav)',
                    }}
                  >
                    <span className='relative inline-flex'>
                      <Icon size={18} strokeWidth={1.5} />
                    </span>
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        <nav className='fixed bottom-0 left-0 right-0 z-50 flex border-t border-rule bg-panel'>
          {primaryMobileNavItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item)
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMoreOpen(false)}
                className='flex flex-1 flex-col items-center justify-center gap-1 py-2 transition-colors duration-[200ms]'
                style={{
                  minHeight: '64px',
                  color: active ? 'var(--accent)' : 'var(--nav)',
                }}
              >
                <Icon size={22} strokeWidth={1.5} />
                <span className='font-sans text-[7px] uppercase tracking-[0.08em]'>{item.label}</span>
              </Link>
            )
          })}

          <button
            type='button'
            onClick={() => setMoreOpen((open) => !open)}
            aria-expanded={moreOpen}
            className='flex flex-1 flex-col items-center justify-center gap-1 py-2 transition-colors duration-[200ms]'
            style={{
              minHeight: '64px',
              color: isMoreActive || moreOpen ? 'var(--accent)' : 'var(--nav)',
              background: 'transparent',
            }}
          >
            <span className='relative inline-flex'>
              <MoreHorizontal size={22} strokeWidth={1.5} />
            </span>
            <span className='font-sans text-[7px] uppercase tracking-[0.08em]'>Mer</span>
          </button>
        </nav>
      </div>

      {/* Desktop: sidebar */}
      <aside className='hidden md:flex md:w-56 md:flex-col md:border-r md:shrink-0 border-rule bg-panel'>
        <div className='px-4 py-6'>
          <Logo context='nav' />
        </div>
        <nav className='flex flex-col gap-1 px-2'>
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item)
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
