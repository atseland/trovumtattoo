'use client'

import { useState } from 'react'
import { useMutation, useQuery, useConvexAuth } from 'convex/react'
import { toast } from 'sonner'
import { api } from '@convex/_generated/api'
import { Id } from '@convex/_generated/dataModel'
import { MailThreadRow } from '@/components/admin/MailThreadRow'
import { Skeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { Mail } from 'lucide-react'

type MailView = 'inbox' | 'unread' | 'archive'

export default function MailPage() {
  const { isAuthenticated } = useConvexAuth()
  const [view, setView] = useState<MailView>('inbox')
  const archiveThread = useMutation(api.mail.mutations.archiveThread)
  const restoreThread = useMutation(api.mail.mutations.restoreThread)
  const permanentlyDeleteThread = useMutation(api.mail.mutations.permanentlyDeleteThread)

  const threads = useQuery(
    api.mail.queries.listThreads,
    isAuthenticated
      ? { unreadOnly: view === 'unread', status: view === 'archive' ? 'archived' : 'active' }
      : 'skip'
  )

  async function handleArchive(threadId: string) {
    try {
      await archiveThread({ threadId: threadId as Id<'mailThreads'> })
      toast.success('Mail arkivert')
    } catch {
      toast.error('Kunne ikke arkivere mail')
    }
  }

  async function handleRestore(threadId: string) {
    try {
      await restoreThread({ threadId: threadId as Id<'mailThreads'> })
      toast.success('Mail gjenopprettet')
    } catch {
      toast.error('Kunne ikke gjenopprette mail')
    }
  }

  async function handleDelete(threadId: string) {
    try {
      await permanentlyDeleteThread({ threadId: threadId as Id<'mailThreads'> })
      toast.success('Mail slettet permanent')
    } catch {
      toast.error('Kunne ikke slette mail permanent')
    }
  }

  return (
    <div className='max-w-2xl'>
      <h1 className='font-sans font-medium text-[18px] text-paper mb-6'>Innboks</h1>

      {/* Filter tabs */}
      <div className='mb-5 flex gap-2'>
        {[
          { label: 'Innboks', value: 'inbox' },
          { label: 'Uleste', value: 'unread' },
          { label: 'Arkiv', value: 'archive' },
        ].map((f) => (
          <button
            key={f.label}
            onClick={() => setView(f.value as MailView)}
            className='font-sans text-[8.5px] tracking-[0.12em] uppercase min-h-[44px] px-4 transition-colors duration-[200ms] border'
            style={{
              borderColor: view === f.value ? 'var(--accent)' : 'var(--rule)',
              color: view === f.value ? 'var(--paper)' : 'var(--nav)',
              background: 'transparent',
              cursor: 'pointer',
              ...(view === f.value ? { borderBottomColor: 'var(--accent)', borderBottomWidth: '2px' } : {}),
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
          title={view === 'archive' ? 'Ingen arkiverte e-poster' : 'Ingen e-poster ennå'}
          text={view === 'archive' ? 'Arkiverte mailtråder vil dukke opp her.' : 'Sett opp IMAP-tilkobling for å synkronisere innboksen.'}
        />
      ) : (
        <div className='flex flex-col gap-2'>
          {threads.map((thread) => (
            <MailThreadRow
              key={thread._id}
              thread={thread}
              mode={view === 'archive' ? 'archived' : 'active'}
              onArchive={handleArchive}
              onRestore={handleRestore}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}
