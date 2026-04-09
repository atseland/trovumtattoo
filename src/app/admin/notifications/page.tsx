'use client'

import { useRouter } from 'next/navigation'
import { useQuery, useMutation, useConvexAuth } from 'convex/react'
import { toast } from 'sonner'
import { api } from '@convex/_generated/api'
import { Doc } from '@convex/_generated/dataModel'
import { Skeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { Btn } from '@/components/ui/Btn'
import { Bell } from 'lucide-react'

const typeNavigation: Record<string, (n: Doc<"notifications">) => string | null> = {
  'new-inquiry': (n) => n.relatedEntityId ? `/admin/inquiries/${n.relatedEntityId}` : null,
  'new-reply': (n) => n.relatedEntityId ? `/admin/mail/${n.relatedEntityId}` : null,
  'booking-today': () => '/admin/calendar',
  'booking-tomorrow': () => '/admin/calendar',
}

function relativeTime(ts: number) {
  const diff = Date.now() - ts
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return 'Akkurat nå'
  if (minutes < 60) return `${minutes}m siden`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}t siden`
  const days = Math.floor(hours / 24)
  return `${days}d siden`
}

export default function NotificationsPage() {
  const { isAuthenticated } = useConvexAuth()
  const router = useRouter()

  const notifications = useQuery(api.notifications.list, isAuthenticated ? {} : 'skip')
  const markRead = useMutation(api.notifications.markRead)
  const markAllRead = useMutation(api.notifications.markAllRead)

  async function handleClick(notification: Doc<"notifications">) {
    if (!notification.isRead) {
      await markRead({ id: notification._id }).catch(() => {})
    }
    const getPath = typeNavigation[notification.type]
    const path = getPath ? getPath(notification) : null
    if (path) router.push(path)
  }

  async function handleMarkAll() {
    try {
      await markAllRead()
      toast.success('Alle merket som lest')
    } catch {
      toast.error('Noe gikk galt')
    }
  }

  const unreadCount = notifications?.filter((n) => !n.isRead).length ?? 0

  return (
    <div className='max-w-2xl'>
      <div className='flex items-center justify-between flex-wrap gap-3 mb-6'>
        <div className='flex items-center gap-3'>
          <h1 className='font-sans font-medium text-[18px] text-paper'>Varsler</h1>
          {unreadCount > 0 && (
            <span
              className='font-sans text-[9px] tracking-[0.08em] uppercase px-[7px] py-[3px]'
              style={{ background: 'var(--accent)', color: 'var(--bg)', borderRadius: '2px' }}
            >
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <Btn variant='sm' onClick={handleMarkAll}>Merk alle som lest</Btn>
        )}
      </div>

      {notifications === undefined ? (
        <div className='flex flex-col gap-2'>
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className='h-[64px]' />)}
        </div>
      ) : notifications.length === 0 ? (
        <EmptyState
          icon={<Bell size={48} strokeWidth={1.5} />}
          title='Ingen varsler'
          text='Nye varsler dukker opp her.'
        />
      ) : (
        <div className='flex flex-col gap-2'>
          {notifications.map((n) => (
            <button
              key={n._id}
              onClick={() => handleClick(n)}
              className='flex items-start gap-3 px-4 py-[14px] bg-panel border border-rule min-h-[64px] text-left w-full transition-colors duration-[200ms] hover:bg-[rgba(237,233,230,0.02)] cursor-pointer'
              style={!n.isRead ? { borderLeftColor: 'var(--accent)', borderLeftWidth: '2px' } : {}}
            >
              <div className='flex-1 min-w-0'>
                <div className='flex justify-between gap-2 flex-wrap mb-1'>
                  <p className={`font-sans text-[14px] ${n.isRead ? 'text-body' : 'font-medium text-paper'}`}>
                    {n.title}
                    {!n.isRead && (
                      <span
                        className='inline-block w-[6px] h-[6px] ml-2 align-middle'
                        style={{ background: 'var(--accent)', borderRadius: '50%' }}
                      />
                    )}
                  </p>
                  <span className='font-sans text-[11px] text-mast-left shrink-0'>{relativeTime(n.createdAt)}</span>
                </div>
                <p className='font-sans text-[12px] text-mast-left'>{n.body}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
