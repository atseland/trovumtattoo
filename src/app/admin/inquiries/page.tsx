'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useQuery, useConvexAuth } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { Skeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { MessageSquare } from 'lucide-react'

const STATUS_FILTERS: { label: string; value: string | undefined }[] = [
  { label: 'Alle', value: undefined },
  { label: 'Ny', value: 'Ny' },
  { label: 'Venter på depositum', value: 'Venter på depositum' },
  { label: 'Booket', value: 'Booket' },
]

function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString('nb-NO', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function InquiriesPage() {
  const { isAuthenticated } = useConvexAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

  const activeFilter = searchParams.get('status') ?? undefined
  const coverUpFilter = searchParams.get('coverUp') === '1' ? true : undefined
  const touchUpFilter = searchParams.get('touchUp') === '1' ? true : undefined

  function updateParams(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString())
    if (value === null) params.delete(key)
    else params.set(key, value)
    router.replace(`/admin/inquiries?${params.toString()}`)
  }

  const inquiries = useQuery(
    api.inquiries.list,
    isAuthenticated ? { status: activeFilter, coverUp: coverUpFilter, touchUp: touchUpFilter } : 'skip'
  )

  if (!isAuthenticated) {
    return <div className='flex flex-col gap-2'>{[1,2,3].map(i => <Skeleton key={i} className='h-[60px]' />)}</div>
  }

  return (
    <div className='max-w-2xl'>
      <h1 className='font-sans font-medium text-[18px] text-paper mb-6'>Forespørsler</h1>

      {/* Status filter tabs */}
      <div className='mb-3 flex flex-wrap gap-2'>
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.label}
            onClick={() => updateParams('status', f.value ?? null)}
            className='font-sans text-[8.5px] tracking-[0.12em] uppercase min-h-[44px] px-4 transition-colors duration-[200ms] border'
            style={{
              borderColor: activeFilter === f.value ? 'var(--accent)' : 'var(--rule)',
              color: activeFilter === f.value ? 'var(--paper)' : 'var(--nav)',
              background: 'transparent',
              cursor: 'pointer',
              ...(activeFilter === f.value ? { borderBottomColor: 'var(--accent)', borderBottomWidth: '2px' } : {}),
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Type filter chips */}
      <div className='mb-6 flex flex-wrap gap-2'>
        {([
          { key: 'coverUp', label: 'Cover-up', active: coverUpFilter },
          { key: 'touchUp', label: 'Touch-up', active: touchUpFilter },
        ] as const).map(({ key, label, active }) => (
          <button
            key={key}
            onClick={() => updateParams(key, active ? null : '1')}
            className='font-sans text-[8.5px] tracking-[0.12em] uppercase min-h-[44px] px-4 border transition-colors duration-[200ms]'
            style={{
              borderColor: active ? 'var(--accent)' : 'var(--rule)',
              color: active ? 'var(--paper)' : 'var(--nav)',
              background: 'transparent',
              cursor: 'pointer',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* List */}
      {inquiries === undefined ? (
        <div className='flex flex-col gap-2'>
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className='h-[60px]' />)}
        </div>
      ) : inquiries.length === 0 ? (
        <EmptyState
          icon={<MessageSquare size={48} strokeWidth={1.5} />}
          title='Ingen forespørsler ennå'
          text='Forespørsler vil dukke opp her når kunder sender inn bookingskjemaet.'
          action={(activeFilter || coverUpFilter || touchUpFilter) ? { label: 'Vis alle', onClick: () => router.replace('/admin/inquiries') } : undefined}
        />
      ) : (
        <div className='flex flex-col gap-2'>
          {(inquiries as any[]).map((inq) => (
            <Link
              key={inq._id}
              href={`/admin/inquiries/${inq._id}`}
              className='flex items-center justify-between gap-3 px-4 py-[14px] bg-panel border border-rule min-h-[60px] transition-colors duration-[200ms] hover:bg-[rgba(237,233,230,0.02)] flex-wrap no-underline'
            >
              <div className='flex-1 min-w-0'>
                <p className='font-sans font-medium text-[14px] text-paper mb-[2px]'>{inq.name}</p>
                <p className='font-sans text-[13px] text-body'>{inq.email}</p>
              </div>
              <div className='flex items-center gap-3 shrink-0'>
                <StatusBadge status={inq.status} />
                <span className='font-sans text-[12px] text-mast-left'>{formatDate(inq.createdAt)}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
