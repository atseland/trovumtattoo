'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useQuery, useConvexAuth } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import { Skeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { Mail } from 'lucide-react'

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
    api.mail.queries.listThreads,
    isAuthenticated ? { unreadOnly } : 'skip'
  )

  return (
    <div className='max-w-2xl'>
      <h1 className='font-sans font-medium text-[18px] text-paper mb-6'>Innboks</h1>

      {/* Filter tabs */}
      <div className='mb-5 flex gap-2'>
        {[
          { label: 'Alle', value: false },
          { label: 'Uleste', value: true },
        ].map((f) => (
          <button
            key={f.label}
            onClick={() => setUnreadOnly(f.value)}
            className='font-sans text-[8.5px] tracking-[0.12em] uppercase min-h-[44px] px-4 transition-colors duration-[200ms] border'
            style={{
              borderColor: unreadOnly === f.value ? 'var(--accent)' : 'var(--rule)',
              color: unreadOnly === f.value ? 'var(--paper)' : 'var(--nav)',
              background: 'transparent',
              cursor: 'pointer',
              ...(unreadOnly === f.value ? { borderBottomColor: 'var(--accent)', borderBottomWidth: '2px' } : {}),
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Thread list */}
      {threads === undefined ? (
        <div className='flex flex-col gap-2'>
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className='h-[64px]' />)}
        </div>
      ) : threads.length === 0 ? (
        <EmptyState
          icon={<Mail size={48} strokeWidth={1.5} />}
          title='Ingen e-poster ennå'
          text='Sett opp IMAP-tilkobling for å synkronisere innboksen.'
        />
      ) : (
        <div className='flex flex-col gap-2'>
          {(threads as any[]).map((thread) => (
            <Link
              key={thread._id}
              href={`/admin/mail/${thread._id}`}
              className='flex items-center justify-between gap-3 px-4 py-[14px] bg-panel border border-rule min-h-[64px] hover:bg-[rgba(237,233,230,0.02)] transition-colors duration-[200ms] no-underline flex-wrap'
              style={thread.unreadCount > 0 ? { borderLeftColor: 'var(--accent)', borderLeftWidth: '2px' } : {}}
            >
              <div className='flex-1 min-w-0'>
                <p className={`font-sans text-[14px] mb-[2px] truncate ${thread.unreadCount > 0 ? 'font-medium text-paper' : 'text-body'}`}>
                  {thread.subject}
                </p>
                <p className='font-sans text-[12px] text-mast-left truncate'>{thread.participants.join(', ')}</p>
              </div>
              <div className='flex items-center gap-2 shrink-0'>
                {thread.unreadCount > 0 && (
                  <span
                    className='font-sans text-[9px] tracking-[0.08em] uppercase px-[6px] py-[2px]'
                    style={{ background: 'var(--accent)', color: 'var(--bg)', borderRadius: '2px' }}
                  >
                    {thread.unreadCount}
                  </span>
                )}
                <span className='font-sans text-[12px] text-mast-left'>{formatDate(thread.lastMessageAt)}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
