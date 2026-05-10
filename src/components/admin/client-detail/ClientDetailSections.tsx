'use client'

import Link from 'next/link'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { Btn } from '@/components/ui/Btn'
import { Rule } from '@/components/ui/Rule'
import { TextareaField } from '@/components/ui/FormField'
import { Skeleton } from '@/components/ui/Skeleton'

function formatDate(timestamp: number) {
  return new Date(timestamp).toLocaleDateString('nb-NO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

interface ClientHeaderProps {
  name: string
  onComposeMail: () => void
}

export function ClientHeader({ name, onComposeMail }: ClientHeaderProps) {
  return (
    <>
      <Link
        href='/admin/clients'
        className='font-sans text-[13px] text-nav hover:text-paper transition-colors duration-[200ms] no-underline block mb-5'
      >
        ← Tilbake
      </Link>

      <div className='mb-6 flex flex-wrap items-start justify-between gap-3'>
        <h1 className='font-serif italic text-[clamp(22px,3vw,30px)] text-paper leading-[1.1] tracking-[-0.02em]'>
          {name}
        </h1>
        <Btn variant='sm' onClick={onComposeMail}>
          Send e-post
        </Btn>
      </div>

      <Rule className='mb-6' />
    </>
  )
}

interface ClientInfoSectionProps {
  client: {
    email: string
    phone?: string | null
    instagramHandle?: string | null
  }
  notes: string
  savingNotes: boolean
  onNotesChange: (value: string) => void
  onSaveNotes: () => void
}

export function ClientInfoSection({
  client,
  notes,
  savingNotes,
  onNotesChange,
  onSaveNotes,
}: ClientInfoSectionProps) {
  return (
    <div className='bg-panel border border-rule px-5 py-5 mb-4'>
      <div className='flex flex-col gap-3'>
        <div>
          <p className='font-sans text-[10px] tracking-[0.14em] uppercase text-nav mb-[3px]'>E-post</p>
          <p className='font-sans text-[14px] text-paper'>{client.email}</p>
        </div>
        {client.phone && (
          <div>
            <p className='font-sans text-[10px] tracking-[0.14em] uppercase text-nav mb-[3px]'>Telefon</p>
            <p className='font-sans text-[14px] text-paper'>{client.phone}</p>
          </div>
        )}
        {client.instagramHandle && (
          <div>
            <p className='font-sans text-[10px] tracking-[0.14em] uppercase text-nav mb-[3px]'>Instagram</p>
            <p className='font-sans text-[14px] text-paper'>{client.instagramHandle}</p>
          </div>
        )}
      </div>

      <Rule className='my-4' />

      <div>
        <TextareaField
          label='Notater'
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder='Legg til notater om kunden…'
          rows={3}
          className='min-h-[110px]'
        />
        <div className='mt-2'>
          <Btn variant='sm' onClick={onSaveNotes} disabled={savingNotes}>
            {savingNotes ? 'Lagrer…' : 'Lagre notater'}
          </Btn>
        </div>
      </div>
    </div>
  )
}

interface ClientMailThreadsSectionProps {
  mailThreads: Array<{ _id: string; subject: string }> | undefined | null
}

export function ClientMailThreadsSection({ mailThreads }: ClientMailThreadsSectionProps) {
  if (!mailThreads || mailThreads.length === 0) return null

  return (
    <div className='mb-6'>
      <h2 className='font-sans text-[10px] tracking-[0.14em] uppercase text-nav mb-3'>Koblede e-posttråder</h2>
      <div className='flex flex-col gap-2'>
        {mailThreads.map((thread) => (
          <Link
            key={thread._id}
            href={`/admin/mail/${thread._id}`}
            className='block px-4 py-[14px] bg-panel border border-rule font-sans text-[14px] text-paper hover:bg-[rgba(237,233,230,0.02)] transition-colors duration-[200ms] no-underline'
          >
            {thread.subject}
          </Link>
        ))}
      </div>
    </div>
  )
}

interface ClientProjectsSectionProps {
  projects:
    | Array<{ _id: string; status: string; createdAt: number }>
    | undefined
}

export function ClientProjectsSection({ projects }: ClientProjectsSectionProps) {
  return (
    <div>
      <h2 className='font-sans text-[10px] tracking-[0.14em] uppercase text-nav mb-3'>Prosjekter</h2>
      {projects === undefined ? (
        <div className='flex flex-col gap-2'>
          {[1, 2].map((i) => <Skeleton key={i} className='h-[52px]' />)}
        </div>
      ) : projects.length === 0 ? (
        <p className='font-sans text-[13px] text-mast-left'>Ingen prosjekter ennå.</p>
      ) : (
        <div className='flex flex-col gap-2'>
          {projects.map((project) => (
            <Link
              key={project._id}
              href={`/admin/projects/${project._id}`}
              className='flex items-center justify-between gap-3 px-4 py-[14px] bg-panel border border-rule min-h-[52px] hover:bg-[rgba(237,233,230,0.02)] transition-colors duration-[200ms] no-underline flex-wrap'
            >
              <StatusBadge status={project.status} />
              <span className='font-sans text-[12px] text-mast-left'>{formatDate(project.createdAt)}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
