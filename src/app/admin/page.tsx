'use client'

import Link from 'next/link'
import { useQuery, useConvexAuth } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { StatusBadge } from '@/components/admin/StatusBadge'

function relativeDate(ts: number) {
  const diff = Date.now() - ts
  const hours = Math.floor(diff / 3600000)
  if (hours < 1) return 'Nettopp'
  if (hours < 24) return `${hours}t siden`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d siden`
  return new Date(ts).toLocaleDateString('nb-NO', { day: '2-digit', month: 'short' })
}

interface SummaryCard {
  label: string
  value: number
  color: string
}

export default function AdminDashboardPage() {
  const { isAuthenticated } = useConvexAuth()
  const summary = useQuery(api.dashboard.getSummary, isAuthenticated ? {} : 'skip')

  const cards: SummaryCard[] = summary
    ? [
        { label: 'Nye forespørsler', value: summary.nyCount, color: 'var(--color-status-ny)' },
        { label: 'Trenger mer info', value: summary.trengermInfoCount, color: 'var(--color-status-info)' },
        { label: 'Venter på depositum', value: summary.venterDepositumCount, color: 'var(--color-status-depositum)' },
        { label: 'Bookinger denne uken', value: summary.upcomingBookingsCount, color: 'var(--color-status-booket)' },
      ]
    : []

  return (
    <div>
      <h1 className='mb-6 text-xl font-medium' style={{ color: '#c9b99a' }}>Dashboard</h1>

      {/* Summary cards */}
      {summary === undefined ? (
        <p style={{ color: '#7a6e62', marginBottom: '24px' }}>Laster…</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '28px' }}>
          {cards.map((card) => (
            <div
              key={card.label}
              style={{
                background: '#141210',
                border: '1px solid #2a2724',
                borderRadius: '8px',
                padding: '16px',
              }}
            >
              <p style={{ fontSize: '2rem', fontWeight: '700', color: card.color, lineHeight: 1 }}>
                {card.value}
              </p>
              <p style={{ fontSize: '0.75rem', color: '#7a6e62', marginTop: '6px' }}>{card.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Snarveier */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '28px', flexWrap: 'wrap' }}>
        <Link
          href='/admin/inquiries'
          style={{ padding: '8px 14px', background: 'transparent', color: '#c9b99a', border: '1px solid #2a2724', borderRadius: '4px', fontSize: '0.875rem', textDecoration: 'none', minHeight: '40px', display: 'flex', alignItems: 'center' }}
        >
          Alle forespørsler
        </Link>
        <Link
          href='/admin/clients'
          style={{ padding: '8px 14px', background: 'transparent', color: '#c9b99a', border: '1px solid #2a2724', borderRadius: '4px', fontSize: '0.875rem', textDecoration: 'none', minHeight: '40px', display: 'flex', alignItems: 'center' }}
        >
          Alle kunder
        </Link>
        <Link
          href='/book'
          style={{ padding: '8px 14px', background: 'transparent', color: '#7a6e62', border: '1px solid #2a2724', borderRadius: '4px', fontSize: '0.875rem', textDecoration: 'none', minHeight: '40px', display: 'flex', alignItems: 'center' }}
        >
          Testbooking →
        </Link>
      </div>

      {/* Recent inquiries */}
      <div>
        <h2 style={{ color: '#c9b99a', fontSize: '1rem', marginBottom: '14px' }}>Siste forespørsler</h2>
        {summary === undefined ? (
          <p style={{ color: '#7a6e62' }}>Laster…</p>
        ) : summary.recentInquiries.length === 0 ? (
          <p style={{ color: '#7a6e62', fontSize: '0.875rem' }}>Ingen forespørsler ennå.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {(summary.recentInquiries as any[]).map((inq) => (
              <Link
                key={inq._id}
                href={`/admin/inquiries/${inq._id}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  background: '#1c1916',
                  border: '1px solid #2a2724',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  gap: '10px',
                  flexWrap: 'wrap',
                }}
              >
                <p style={{ color: '#c9b99a', fontSize: '0.9rem', fontWeight: '500', flex: 1, minWidth: 0 }}>{inq.name}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                  <StatusBadge status={inq.status} />
                  <span style={{ color: '#7a6e62', fontSize: '0.75rem' }}>{relativeDate(inq.createdAt)}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
