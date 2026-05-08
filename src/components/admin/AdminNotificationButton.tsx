'use client'

import Link from 'next/link'
import { useConvexAuth, useQuery } from 'convex/react'
import { Bell } from 'lucide-react'
import { api } from '@convex/_generated/api'

export function AdminNotificationButton() {
  const { isAuthenticated } = useConvexAuth()
  const unreadCount = useQuery(api.notifications.countUnread, isAuthenticated ? {} : 'skip') ?? 0

  return (
    <Link
      href='/admin/notifications'
      aria-label={unreadCount > 0 ? `Varsler, ${unreadCount} uleste` : 'Varsler'}
      className='relative inline-flex h-10 w-10 items-center justify-center border border-rule text-nav transition-colors duration-[200ms] hover:text-paper'
    >
      <Bell size={18} strokeWidth={1.5} />
      {unreadCount > 0 && (
        <span
          className='absolute right-1.5 top-1.5 min-w-[14px] px-1 text-center font-sans text-[9px] font-bold leading-[14px]'
          style={{ background: 'var(--accent)', color: 'var(--bg)', borderRadius: '2px' }}
        >
          {unreadCount}
        </span>
      )}
    </Link>
  )
}
