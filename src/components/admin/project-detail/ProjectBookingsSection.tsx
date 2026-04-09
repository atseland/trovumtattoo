'use client'

import { Skeleton } from '@/components/ui/Skeleton'
import type { ProjectBookingSummary } from '@/components/admin/project-detail/projectDetailTypes'

interface ProjectBookingsSectionProps {
  bookings: ProjectBookingSummary[] | null | undefined
}

export function ProjectBookingsSection({ bookings }: ProjectBookingsSectionProps) {
  const bookingItems = bookings ?? []

  return (
    <div className='mb-6'>
      <h2 className='font-sans text-[10px] tracking-[0.14em] uppercase text-nav mb-3'>Bookinger</h2>
      {bookings === undefined ? (
        <div className='flex flex-col gap-2'>
          {[1, 2].map((i) => <Skeleton key={i} className='h-[52px]' />)}
        </div>
      ) : bookingItems.length === 0 ? (
        <p className='font-sans text-[13px] text-mast-left'>Ingen bookinger ennå.</p>
      ) : (
        <div className='flex flex-col gap-2'>
          {bookingItems.map((booking) => (
            <div
              key={booking._id}
              className='flex items-center justify-between flex-wrap gap-2 px-4 py-[14px] bg-panel border border-rule min-h-[52px]'
            >
              <span className='font-sans text-[13px] text-paper'>
                {new Date(booking.startAt).toLocaleString('nb-NO', {
                  day: '2-digit',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                })}{' '}
                –{' '}
                {new Date(booking.endAt).toLocaleTimeString('nb-NO', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
              <span className='font-sans text-[11px] tracking-[0.1em] uppercase text-mast-left'>
                {booking.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
