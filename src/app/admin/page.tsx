'use client'

import Link from 'next/link'
import { useQuery, useConvexAuth } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { Skeleton } from '@/components/ui/Skeleton'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { Btn } from '@/components/ui/Btn'

function relativeDate(ts: number) {
  const diff = Date.now() - ts
  const hours = Math.floor(diff / 3600000)
  if (hours < 1) return 'Nettopp'
  if (hours < 24) return `${hours}t siden`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d siden`
  return new Date(ts).toLocaleDateString('nb-NO', { day: '2-digit', month: 'short' })
}

export default function AdminDashboardPage() {
  const { isAuthenticated } = useConvexAuth()
  const summary = useQuery(api.dashboard.getSummary, isAuthenticated ? {} : 'skip')

  const cards = summary
    ? [
        { label: 'Nye forespørsler', value: summary.nyCount },
        { label: 'Trenger mer info', value: summary.trengermInfoCount },
        { label: 'Venter på depositum', value: summary.venterDepositumCount },
        { label: 'Bookinger denne uken', value: summary.upcomingBookingsCount },
      ]
    : []

  return (
    <div className='max-w-2xl'>
      <h1 className='font-sans font-medium text-[18px] text-paper mb-6'>Dashboard</h1>

      {/* Summary cards */}
      {summary === undefined ? (
        <div className='grid grid-cols-2 gap-3 mb-7'>
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className='h-[72px]' />
          ))}
        </div>
      ) : (
        <div className='grid grid-cols-2 gap-3 mb-7'>
          {cards.map((card) => (
            <div
              key={card.label}
              className='bg-panel border border-rule p-4'
            >
              <p className='font-serif text-[36px] text-paper leading-[1]'>{card.value}</p>
              <p className='font-sans text-[10px] tracking-[0.14em] uppercase text-mast-left mt-[6px]'>{card.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Snarveier */}
      <div className='flex flex-wrap gap-2 mb-7'>
        <Btn href='/admin/inquiries' variant='sm'>Alle forespørsler</Btn>
        <Btn href='/admin/clients' variant='sm'>Alle kunder</Btn>
        <Btn href='/book' variant='sm'>Testbooking →</Btn>
      </div>

      {/* Recent inquiries */}
      <div>
        <Eyebrow withLine className='mb-4'>Siste forespørsler</Eyebrow>
        {summary === undefined ? (
          <div className='flex flex-col gap-2'>
            {[1, 2, 3].map((i) => <Skeleton key={i} className='h-[60px]' />)}
          </div>
        ) : summary.recentInquiries.length === 0 ? (
          <p className='font-sans text-[13px] text-mast-left'>Ingen forespørsler ennå.</p>
        ) : (
          <div className='flex flex-col gap-2'>
            {summary.recentInquiries.map((inq) => (
              <Link
                key={inq._id}
                href={`/admin/inquiries/${inq._id}`}
                className='flex items-center justify-between gap-3 px-4 py-[14px] bg-panel border border-rule min-h-[60px] transition-colors duration-[200ms] hover:bg-[rgba(237,233,230,0.02)] flex-wrap no-underline'
              >
                <p className='font-sans font-medium text-[14px] text-paper flex-1 min-w-0'>{inq.name}</p>
                <div className='flex items-center gap-3 shrink-0'>
                  <StatusBadge status={inq.status} />
                  <span className='font-sans text-[12px] text-mast-left'>{relativeDate(inq.createdAt)}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
