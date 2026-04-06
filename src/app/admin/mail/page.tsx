'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useQuery, useConvexAuth } from 'convex/react'
// TODO: fjern cast etter npx convex dev
import { api } from '../../../../convex/_generated/api'

function formatDate(ts: number) {
  const diff = Date.now() - ts
  const hours = Math.floor(diff / 3600000)
  if (hours < 24) return `${hours}t`
  return new Date(ts).toLocaleDateString('nb-NO', { day: '2-digit', month: 'short' })
}

export default function MailPage() {
  const { isAuthenticated } = useConvexAuth()
  const [unreadOnly, setUnreadOnly] = useState(false)

  const threads = useQuery(
    (api as any).mail.queries.listThreads,
    isAuthenticated ? { unreadOnly } : 'skip'
  )

  return (
    <div>
      <h1 className='mb-6 text-xl font-medium' style={{ color: '#c9b99a' }}>Innboks</h1>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        {[
          { label: 'Alle', value: false },
          { label: 'Uleste', value: true },
        ].map((f) => (
          <button
            key={f.label}
            onClick={() => setUnreadOnly(f.value)}
            style={{
              padding: '8px 16px',
              borderRadius: '4px',
              border: '1px solid',
              borderColor: unreadOnly === f.value ? '#c9933a' : '#2a2724',
              background: unreadOnly === f.value ? '#2a1e0d' : 'transparent',
              color: unreadOnly === f.value ? '#c9933a' : '#7a6e62',
              fontSize: '0.875rem',
              cursor: 'pointer',
              minHeight: '40px',
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Thread list */}
      {threads === undefined ? (
        <p style={{ color: '#7a6e62' }}>Laster…</p>
      ) : threads.length === 0 ? (
        <div style={{ padding: '40px 0', textAlign: 'center' }}>
          <p style={{ color: '#7a6e62', marginBottom: '8px' }}>Ingen e-poster ennå.</p>
          <p style={{ color: '#7a6e62', fontSize: '0.8rem' }}>
            Sett opp IMAP-tilkobling med <code style={{ color: '#c9933a' }}>npx convex env set</code>-kommandoer
            <br />dokumentert i <code style={{ color: '#c9b99a' }}>convex/mail/config.ts</code>.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {(threads as any[]).map((thread) => (
            <Link
              key={thread._id}
              href={`/admin/mail/${thread._id}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 16px',
                background: thread.unreadCount > 0 ? '#141210' : '#1c1916',
                border: '1px solid',
                borderColor: thread.unreadCount > 0 ? '#2a2724' : '#2a2724',
                borderRadius: '6px',
                textDecoration: 'none',
                gap: '12px',
                flexWrap: 'wrap',
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                  color: thread.unreadCount > 0 ? '#c9b99a' : '#7a6e62',
                  fontWeight: thread.unreadCount > 0 ? '600' : '400',
                  fontSize: '0.9rem',
                  marginBottom: '3px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  {thread.subject}
                </p>
                <p style={{ color: '#7a6e62', fontSize: '0.75rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {thread.participants.join(', ')}
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                {thread.unreadCount > 0 && (
                  <span style={{
                    background: '#c9933a',
                    color: '#0d0c0b',
                    fontSize: '0.7rem',
                    fontWeight: '700',
                    padding: '2px 7px',
                    borderRadius: '999px',
                    minWidth: '20px',
                    textAlign: 'center',
                  }}>
                    {thread.unreadCount}
                  </span>
                )}
                <span style={{ color: '#7a6e62', fontSize: '0.75rem' }}>
                  {formatDate(thread.lastMessageAt)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
