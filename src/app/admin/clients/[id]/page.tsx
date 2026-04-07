'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import { useQuery, useMutation, useConvexAuth } from 'convex/react'
import { toast } from 'sonner'
import { api } from '../../../../../convex/_generated/api'
import { Id } from '../../../../../convex/_generated/dataModel'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { Skeleton } from '@/components/ui/Skeleton'
import { Rule } from '@/components/ui/Rule'
import { Btn } from '@/components/ui/Btn'

function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString('nb-NO', { day: '2-digit', month: 'short', year: 'numeric' })
}

const ghostInput: React.CSSProperties = {
  background: 'rgba(237,233,230,0.03)',
  border: '1px solid rgba(237,233,230,0.14)',
}

export default function ClientDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { isAuthenticated } = useConvexAuth()
  const [notes, setNotes] = useState<string | null>(null)
  const [savingNotes, setSavingNotes] = useState(false)

  const client = useQuery(api.clients.get, isAuthenticated ? { id: id as Id<"clients"> } : 'skip')
  const projects = useQuery(api.projects.listByClient, isAuthenticated && client ? { clientId: id as Id<"clients"> } : 'skip')
  const mailThreads = useQuery(api.mail.queries.listByClient, isAuthenticated ? { clientId: id as Id<"clients"> } : 'skip')
  const updateClient = useMutation(api.clients.update)

  if (!isAuthenticated || client === undefined) {
    return (
      <div className='max-w-2xl flex flex-col gap-3'>
        <Skeleton className='h-[44px] w-[160px]' />
        <Skeleton className='h-[40px]' />
        <Skeleton className='h-[160px]' />
        <Skeleton className='h-[100px]' />
      </div>
    )
  }

  if (!client) {
    return (
      <div className='max-w-2xl'>
        <p className='font-sans text-[13px] text-[#af8c87] mb-4'>Kunden ble ikke funnet.</p>
        <Link href='/admin/clients' className='font-sans text-[13px] text-nav hover:text-paper transition-colors duration-[200ms]'>
          ← Tilbake
        </Link>
      </div>
    )
  }

  const currentNotes = notes ?? (client.notes || '')

  async function saveNotes() {
    setSavingNotes(true)
    try {
      await updateClient({ id: id as Id<"clients">, notes: currentNotes || undefined })
      toast.success('Notater lagret')
    } catch {
      toast.error('Kunne ikke lagre notater')
    } finally {
      setSavingNotes(false)
    }
  }

  return (
    <div className='max-w-2xl'>
      <Link href='/admin/clients' className='font-sans text-[13px] text-nav hover:text-paper transition-colors duration-[200ms] no-underline block mb-5'>
        ← Tilbake
      </Link>

      <h1 className='font-serif italic text-[clamp(22px,3vw,30px)] text-paper leading-[1.1] tracking-[-0.02em] mb-6'>
        {client.name}
      </h1>

      <Rule className='mb-6' />

      {/* Client info */}
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

        {/* Notes */}
        <div>
          <label className='block font-sans text-[10px] tracking-[0.14em] uppercase text-nav mb-2'>Notater</label>
          <textarea
            value={currentNotes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder='Legg til notater om kunden…'
            rows={3}
            className='w-full font-sans text-[14px] text-paper placeholder:text-mast-left px-4 py-3 outline-none resize-vertical transition-colors duration-[200ms]'
            style={ghostInput}
            onFocus={e => {
              e.currentTarget.style.border = '1px solid rgba(237,233,230,0.35)'
              e.currentTarget.style.background = 'rgba(237,233,230,0.05)'
            }}
            onBlur={e => {
              e.currentTarget.style.border = '1px solid rgba(237,233,230,0.14)'
              e.currentTarget.style.background = 'rgba(237,233,230,0.03)'
            }}
          />
          <div className='mt-2'>
            <Btn variant='sm' onClick={saveNotes} disabled={savingNotes}>
              {savingNotes ? 'Lagrer…' : 'Lagre notater'}
            </Btn>
          </div>
        </div>
      </div>

      {/* Mail threads */}
      {mailThreads && mailThreads.length > 0 && (
        <div className='mb-6'>
          <h2 className='font-sans text-[10px] tracking-[0.14em] uppercase text-nav mb-3'>Koblede e-posttråder</h2>
          <div className='flex flex-col gap-2'>
            {mailThreads.map((t) => (
              <Link
                key={t._id}
                href={`/admin/mail/${t._id}`}
                className='block px-4 py-[14px] bg-panel border border-rule font-sans text-[14px] text-paper hover:bg-[rgba(237,233,230,0.02)] transition-colors duration-[200ms] no-underline'
              >
                {t.subject}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      <div>
        <h2 className='font-sans text-[10px] tracking-[0.14em] uppercase text-nav mb-3'>Prosjekter</h2>
        {projects === undefined ? (
          <div className='flex flex-col gap-2'>
            {[1, 2].map(i => <Skeleton key={i} className='h-[52px]' />)}
          </div>
        ) : projects.length === 0 ? (
          <p className='font-sans text-[13px] text-mast-left'>Ingen prosjekter ennå.</p>
        ) : (
          <div className='flex flex-col gap-2'>
            {projects.map((p) => (
              <Link
                key={p._id}
                href={`/admin/projects/${p._id}`}
                className='flex items-center justify-between gap-3 px-4 py-[14px] bg-panel border border-rule min-h-[52px] hover:bg-[rgba(237,233,230,0.02)] transition-colors duration-[200ms] no-underline flex-wrap'
              >
                <StatusBadge status={p.status} />
                <span className='font-sans text-[12px] text-mast-left'>{formatDate(p.createdAt)}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
