'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useQuery, useConvexAuth } from 'convex/react'
// TODO: fjern cast etter npx convex dev
import { api } from '../../../../convex/_generated/api'
import { BookingSheet } from '@/components/admin/BookingSheet'

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
  const [bookingSheetOpen, setBookingSheetOpen] = useState(false)

  const bookings = useQuery((api as any).bookings.listUpcomingWithDetails, isAuthenticated ? {} : 'skip')

  // Group by date
  const grouped = new Map<string, any[]>()
  if (bookings) {
    for (const b of bookings as any[]) {
      const key = dateKey(b.startAt)
      if (!grouped.has(key)) grouped.set(key, [])
      grouped.get(key)!.push(b)
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <h1 className='text-xl font-medium' style={{ color: '#c9b99a' }}>Kalender</h1>
        <button
          onClick={() => setBookingSheetOpen(true)}
          style={{ padding: '8px 16px', background: '#c9933a', color: '#0d0c0b', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.875rem', minHeight: '40px' }}
        >
          Ny booking
        </button>
      </div>

      {bookings === undefined ? (
        <p style={{ color: '#7a6e62' }}>Laster…</p>
      ) : (bookings as any[]).length === 0 ? (
        <div style={{ padding: '40px 0', textAlign: 'center' }}>
          <p style={{ color: '#7a6e62', marginBottom: '12px' }}>Ingen kommende bookinger.</p>
          <Link href='/admin/clients' style={{ color: '#c9933a', fontSize: '0.875rem' }}>Gå til prosjekter →</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          {[...grouped.entries()].map(([, dayBookings]: [string, any[]]) => (
            <div key={(dayBookings[0] as any).startAt}>
              <h2 style={{ color: '#7a6e62', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>
                {formatDate((dayBookings[0] as any).startAt)}
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {(dayBookings as any[]).map((booking) => (
                  <Link
                    key={booking._id}
                    href={`/admin/projects/${booking.projectId}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      padding: '14px 16px',
                      background: '#141210',
                      border: '1px solid #2a2724',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      flexWrap: 'wrap',
                    }}
                  >
                    <div style={{ flexShrink: 0 }}>
                      <p style={{ color: '#c9933a', fontSize: '0.85rem', fontWeight: '500' }}>
                        {formatTime(booking.startAt)} – {formatTime(booking.endAt)}
                      </p>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ color: '#c9b99a', fontSize: '0.9rem', fontWeight: '500' }}>
                        {booking.client?.name ?? 'Ukjent kunde'}
                      </p>
                      {booking.notes && (
                        <p style={{ color: '#7a6e62', fontSize: '0.75rem', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
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

      {/* Booking sheet — projectId required, skipped from calendar view — use project pages for per-project booking */}
      {bookingSheetOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#141210', border: '1px solid #2a2724', borderRadius: '8px', padding: '24px', width: '100%', maxWidth: '420px' }}>
            <p style={{ color: '#7a6e62', fontSize: '0.875rem', marginBottom: '16px' }}>
              For å opprette en booking, gå til prosjektsiden og klikk "Opprett booking".
            </p>
            <button onClick={() => setBookingSheetOpen(false)} style={{ padding: '10px 20px', background: '#c9933a', color: '#0d0c0b', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
