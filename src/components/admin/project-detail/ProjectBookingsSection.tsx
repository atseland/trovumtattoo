'use client'

import { Skeleton } from '@/components/ui/Skeleton'
import type { ProjectBookingSummary } from '@/components/admin/project-detail/projectDetailTypes'

interface ProjectBookingsSectionProps {
  bookings: ProjectBookingSummary[] | null | undefined
  archived: boolean
  onArchivedChange: (archived: boolean) => void
  onEditBooking: (booking: ProjectBookingSummary) => void
  onRebookBooking: (booking: ProjectBookingSummary) => void
  onCompleteBooking: (booking: ProjectBookingSummary) => void
  onArchiveBooking: (booking: ProjectBookingSummary) => void
  onRestoreBooking: (booking: ProjectBookingSummary) => void
  onPermanentDeleteBooking: (booking: ProjectBookingSummary) => void
  onCancelPermanentDeleteBooking: () => void
  pendingDeleteBookingId: string | null
}

export function ProjectBookingsSection({
  bookings,
  archived,
  onArchivedChange,
  onEditBooking,
  onRebookBooking,
  onCompleteBooking,
  onArchiveBooking,
  onRestoreBooking,
  onPermanentDeleteBooking,
  onCancelPermanentDeleteBooking,
  pendingDeleteBookingId,
}: ProjectBookingsSectionProps) {
  const bookingItems = bookings ?? []

  return (
    <div className='mb-6'>
      <div className='mb-3 flex flex-wrap items-center justify-between gap-2'>
        <h2 className='font-sans text-[10px] tracking-[0.14em] uppercase text-nav'>Bookinger</h2>
        <div className='flex flex-wrap gap-2'>
          <button
            type='button'
            onClick={() => onArchivedChange(false)}
            className='min-h-[36px] border bg-transparent px-3 font-sans text-[8.5px] uppercase tracking-[0.12em] transition-colors duration-[200ms]'
            style={{
              borderColor: archived ? 'var(--rule)' : 'var(--accent)',
              color: archived ? 'var(--nav)' : 'var(--paper)',
            }}
          >
            Aktive
          </button>
          <button
            type='button'
            onClick={() => onArchivedChange(true)}
            className='min-h-[36px] border bg-transparent px-3 font-sans text-[8.5px] uppercase tracking-[0.12em] transition-colors duration-[200ms]'
            style={{
              borderColor: archived ? 'var(--accent)' : 'var(--rule)',
              color: archived ? 'var(--paper)' : 'var(--nav)',
            }}
          >
            Arkiv
          </button>
        </div>
      </div>
      {bookings === undefined ? (
        <div className='flex flex-col gap-2'>
          {[1, 2].map((i) => <Skeleton key={i} className='h-[52px]' />)}
        </div>
      ) : bookingItems.length === 0 ? (
        <p className='font-sans text-[13px] text-mast-left'>
          {archived ? 'Ingen arkiverte bookinger.' : 'Ingen bookinger ennå.'}
        </p>
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
                    {archived ? (
                      <>
                        <button
                          type='button'
                          onClick={() => onRestoreBooking(booking)}
                          className='font-sans text-[8.5px] tracking-[0.12em] uppercase min-h-[40px] px-3 border border-rule text-nav cursor-pointer transition-colors duration-[200ms] hover:text-paper hover:border-[rgba(237,233,230,0.22)]'
                          style={{ background: 'transparent' }}
                        >
                          Gjenopprett
                        </button>
                        <button
                          type='button'
                          onClick={() => onPermanentDeleteBooking(booking)}
                          className='font-sans text-[8.5px] tracking-[0.12em] uppercase min-h-[40px] px-3 border cursor-pointer transition-colors duration-[200ms]'
                          style={{ background: 'transparent', borderColor: 'rgba(175,140,135,0.3)', color: '#af8c87' }}
                        >
                          {pendingDeleteBookingId === booking._id ? 'Bekreft slett' : 'Slett permanent'}
                        </button>
                        {pendingDeleteBookingId === booking._id && (
                          <button
                            type='button'
                            onClick={onCancelPermanentDeleteBooking}
                            className='font-sans text-[8.5px] tracking-[0.12em] uppercase min-h-[40px] px-3 border border-rule text-nav cursor-pointer transition-colors duration-[200ms] hover:text-paper hover:border-[rgba(237,233,230,0.22)]'
                            style={{ background: 'transparent' }}
                          >
                            Avbryt
                          </button>
                        )}
                      </>
                    ) : (
                      <>
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
                        {booking.status !== 'completed' && booking.status !== 'cancelled' && (
                          <button
                            type='button'
                            onClick={() => onCompleteBooking(booking)}
                            className='font-sans text-[8.5px] tracking-[0.12em] uppercase min-h-[40px] px-3 border border-rule text-nav cursor-pointer transition-colors duration-[200ms] hover:text-paper hover:border-[rgba(237,233,230,0.22)]'
                            style={{ background: 'transparent' }}
                          >
                            Fullfør
                          </button>
                        )}
                        {(booking.status === 'completed' || booking.status === 'cancelled') && (
                          <button
                            type='button'
                            onClick={() => onArchiveBooking(booking)}
                            className='font-sans text-[8.5px] tracking-[0.12em] uppercase min-h-[40px] px-3 border border-rule text-nav cursor-pointer transition-colors duration-[200ms] hover:text-paper hover:border-[rgba(237,233,230,0.22)]'
                            style={{ background: 'transparent' }}
                          >
                            Arkiver
                          </button>
                        )}
                      </>
                    )}
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
