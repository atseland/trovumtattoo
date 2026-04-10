'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useQuery, useConvexAuth } from 'convex/react'
import { api } from '@convex/_generated/api'
import { Skeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { Btn } from '@/components/ui/Btn'
import { CalendarDays } from 'lucide-react'

function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString('nb-NO', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })
}

function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString('nb-NO', { hour: '2-digit', minute: '2-digit' })
}

function dateKey(ts: number) {
  const d = new Date(ts)
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
}

export default function CalendarPage() {
  const { isAuthenticated } = useConvexAuth()
  const router = useRouter()

  const bookings = useQuery(api.bookings.listUpcomingWithDetails, isAuthenticated ? {} : 'skip')

  type Booking = NonNullable<typeof bookings>[number]
  const grouped = new Map<string, Booking[]>()
  if (bookings) {
    for (const b of bookings) {
      const key = dateKey(b.startAt)
      if (!grouped.has(key)) grouped.set(key, [])
      grouped.get(key)!.push(b)
    }
  }

  return (
    <div className='max-w-2xl'>
      <div className='flex items-center justify-between flex-wrap gap-3 mb-6'>
        <h1 className='font-sans font-medium text-[18px] text-paper'>Kalender</h1>
        <Btn href='/admin/search' variant='sm'>Finn prosjekt</Btn>
      </div>

      {bookings === undefined ? (
        <div className='flex flex-col gap-6'>
          {[1, 2].map(i => (
            <div key={i} className='flex flex-col gap-2'>
              <Skeleton className='h-[20px] w-[200px]' />
              <Skeleton className='h-[64px]' />
              <Skeleton className='h-[64px]' />
            </div>
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <EmptyState
          icon={<CalendarDays size={48} strokeWidth={1.5} />}
          title='Ingen kommende bookinger'
          text='Bookinger opprettes fra prosjektsiden. Finn riktig kunde eller prosjekt via admin-soket.'
          action={{ label: 'Finn prosjekt', onClick: () => router.push('/admin/search') }}
        />
      ) : (
        <div className='flex flex-col gap-7'>
          {[...grouped.entries()].map(([, dayBookings]) => (
            <div key={dayBookings[0].startAt}>
              <p className='font-mono text-[8px] tracking-[0.24em] uppercase text-index-num mb-3'>
                {formatDate(dayBookings[0].startAt)}
              </p>
              <div className='flex flex-col gap-2'>
                {dayBookings.map((booking) => (
                  <Link
                    key={booking._id}
                    href={`/admin/projects/${booking.projectId}`}
                    className='flex items-center gap-4 px-4 py-[14px] bg-panel border border-rule min-h-[64px] hover:bg-[rgba(237,233,230,0.02)] transition-colors duration-[200ms] no-underline flex-wrap'
                  >
                    <div className='shrink-0'>
                      <p className='font-sans text-[13px] text-accent font-medium'>
                        {formatTime(booking.startAt)} – {formatTime(booking.endAt)}
                      </p>
                    </div>
                    <div className='flex-1 min-w-0'>
                      <p className='font-sans font-medium text-[14px] text-paper'>
                        {booking.client?.name ?? 'Ukjent kunde'}
                      </p>
                      {booking.notes && (
                        <p className='font-sans text-[12px] text-mast-left mt-[2px] truncate'>
                          {booking.notes}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
