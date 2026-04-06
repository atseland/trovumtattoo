'use client'

import { useRouter } from 'next/navigation'
import { useQuery, useMutation, useConvexAuth } from 'convex/react'
import { toast } from 'sonner'
// TODO: fjern cast etter npx convex dev
import { api } from '../../../../convex/_generated/api'

const typeIcon: Record<string, string> = {
  'new-inquiry': '📥',
  'new-reply': '✉️',
  'deposit-overdue': '⚠️',
  'booking-tomorrow': '📅',
  'booking-today': '🔔',
  'followup-due': '⏰',
}

const typeNavigation: Record<string, (n: any) => string | null> = {
  'new-inquiry': (n) => n.relatedEntityId ? `/admin/inquiries/${n.relatedEntityId}` : null,
  'new-reply': (n) => n.relatedEntityId ? `/admin/mail/${n.relatedEntityId}` : null,
  'booking-today': (n) => n.relatedEntityId ? `/admin/calendar` : null,
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

  const notifications = useQuery((api as any).notifications.list, isAuthenticated ? {} : 'skip')
  const markRead = useMutation((api as any).notifications.markRead)
  const markAllRead = useMutation((api as any).notifications.markAllRead)

  async function handleClick(notification: any) {
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

  const unreadCount = (notifications as any[] | undefined)?.filter((n) => !n.isRead).length ?? 0

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <h1 className='text-xl font-medium' style={{ color: '#c9b99a' }}>Varsler</h1>
          {unreadCount > 0 && (
            <span style={{ background: '#c9933a', color: '#0d0c0b', fontSize: '0.75rem', fontWeight: '700', padding: '2px 8px', borderRadius: '999px' }}>
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAll}
            style={{ padding: '8px 14px', background: 'transparent', color: '#7a6e62', border: '1px solid #2a2724', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', minHeight: '36px' }}
          >
            Merk alle som lest
          </button>
        )}
      </div>

      {notifications === undefined ? (
        <p style={{ color: '#7a6e62' }}>Laster…</p>
      ) : (notifications as any[]).length === 0 ? (
        <p style={{ color: '#7a6e62', fontSize: '0.875rem' }}>Ingen varsler.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {(notifications as any[]).map((n) => (
            <button
              key={n._id}
              onClick={() => handleClick(n)}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                padding: '14px 16px',
                background: n.isRead ? '#1c1916' : '#141210',
                border: '1px solid',
                borderColor: n.isRead ? '#2a2724' : n.priority === 'high' ? '#3a2a10' : '#2a2724',
                borderRadius: '6px',
                textAlign: 'left',
                cursor: 'pointer',
                width: '100%',
                transition: 'opacity 0.15s',
              }}
            >
              <span style={{ fontSize: '1.1rem', flexShrink: 0, marginTop: '1px' }}>
                {typeIcon[n.type] ?? '🔔'}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap' }}>
                  <p style={{ color: n.isRead ? '#7a6e62' : '#c9b99a', fontWeight: n.isRead ? '400' : '600', fontSize: '0.9rem' }}>
                    {n.title}
                    {!n.isRead && <span style={{ display: 'inline-block', width: '6px', height: '6px', background: '#c9933a', borderRadius: '50%', marginLeft: '8px', verticalAlign: 'middle' }} />}
                  </p>
                  <span style={{ color: '#7a6e62', fontSize: '0.7rem', flexShrink: 0 }}>{relativeTime(n.createdAt)}</span>
                </div>
                <p style={{ color: '#7a6e62', fontSize: '0.8rem', marginTop: '3px' }}>{n.body}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
