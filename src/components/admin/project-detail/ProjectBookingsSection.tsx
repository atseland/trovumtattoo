'use client'

import { Skeleton } from '@/components/ui/Skeleton'
import type { ProjectBookingSummary } from '@/components/admin/project-detail/projectDetailTypes'

interface ProjectBookingsSectionProps {
  bookings: ProjectBookingSummary[] | null | undefined
  onEditBooking: (booking: ProjectBookingSummary) => void
  onRebookBooking: (booking: ProjectBookingSummary) => void
}

export function ProjectBookingsSection({
  bookings,
  onEditBooking,
  onRebookBooking,
}: ProjectBookingsSectionProps) {
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
              className='px-4 py-[14px] bg-panel border border-rule'
            >
              <div className='flex items-start justify-between flex-wrap gap-3'>
                <div className='flex-1 min-w-0'>
                  <p className='font-sans text-[13px] text-paper'>
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
                  </p>
                  {booking.notes && (
                    <p className='font-sans text-[12px] text-mast-left mt-[4px] whitespace-pre-wrap'>
                      {booking.notes}
                    </p>
                  )}
                </div>

                <div className='flex items-center gap-3 shrink-0 flex-wrap justify-end'>
                  <span className='font-sans text-[11px] tracking-[0.1em] uppercase text-mast-left'>
                    {booking.status}
                  </span>
                  <div className='flex gap-2'>
                    <button
                      type='button'
                      onClick={() => onEditBooking(booking)}
                      className='font-sans text-[8.5px] tracking-[0.12em] uppercase min-h-[40px] px-3 border border-rule text-nav cursor-pointer transition-colors duration-[200ms] hover:text-paper hover:border-[rgba(237,233,230,0.22)]'
                      style={{ background: 'transparent' }}
                    >
                      Rediger
                    </button>
                    <button
                      type='button'
                      onClick={() => onRebookBooking(booking)}
                      className='font-sans text-[8.5px] tracking-[0.12em] uppercase min-h-[40px] px-3 border border-rule text-nav cursor-pointer transition-colors duration-[200ms] hover:text-paper hover:border-[rgba(237,233,230,0.22)]'
                      style={{ background: 'transparent' }}
                    >
                      Ombook
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
