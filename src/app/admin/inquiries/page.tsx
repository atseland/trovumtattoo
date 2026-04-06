'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useQuery, useConvexAuth } from 'convex/react'
// TODO: fjern cast etter npx convex dev
import { api } from '../../../../convex/_generated/api'
import { StatusBadge } from '@/components/admin/StatusBadge'

const FILTERS: { label: string; value: string | undefined }[] = [
  { label: 'Alle', value: undefined },
  { label: 'Ny', value: 'Ny' },
  { label: 'Venter på depositum', value: 'Venter på depositum' },
  { label: 'Booket', value: 'Booket' },
]

function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString('nb-NO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export default function InquiriesPage() {
  const { isAuthenticated } = useConvexAuth()
  const [activeFilter, setActiveFilter] = useState<string | undefined>(undefined)

  // TODO: fjern cast etter npx convex dev
  const inquiries = useQuery(
    (api as any).inquiries.list,
    isAuthenticated ? { status: activeFilter } : 'skip'
  )

  if (!isAuthenticated) {
    return <p style={{ color: '#7a6e62', padding: '20px' }}>Laster inn…</p>
  }

  return (
    <div>
      <h1 className='mb-6 text-xl font-medium' style={{ color: '#c9b99a' }}>Forespørsler</h1>

      {/* Filter tabs */}
      <div className='mb-6 flex flex-wrap gap-2'>
        {FILTERS.map((f) => (
          <button
            key={f.label}
            onClick={() => setActiveFilter(f.value)}
            style={{
              padding: '8px 16px',
              borderRadius: '4px',
              border: '1px solid',
              borderColor: activeFilter === f.value ? '#c9933a' : '#2a2724',
              background: activeFilter === f.value ? '#2a1e0d' : 'transparent',
              color: activeFilter === f.value ? '#c9933a' : '#7a6e62',
              fontSize: '0.875rem',
              cursor: 'pointer',
              minHeight: '40px',
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* List */}
      {inquiries === undefined ? (
        <p style={{ color: '#7a6e62' }}>Laster…</p>
      ) : inquiries.length === 0 ? (
        <div style={{ padding: '40px 0', textAlign: 'center' }}>
          <p style={{ color: '#7a6e62' }}>Ingen forespørsler funnet.</p>
          {activeFilter && (
            <button
              onClick={() => setActiveFilter(undefined)}
              style={{ marginTop: '12px', color: '#c9933a', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.875rem' }}
            >
              Vis alle
            </button>
          )}
        </div>
      ) : (
        <div className='flex flex-col gap-2'>
          {(inquiries as any[]).map((inq) => (
            <Link
              key={inq._id}
              href={`/admin/inquiries/${inq._id}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 16px',
                background: '#1c1916',
                border: '1px solid #2a2724',
                borderRadius: '6px',
                textDecoration: 'none',
                gap: '12px',
                flexWrap: 'wrap',
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ color: '#c9b99a', fontWeight: '500', fontSize: '0.95rem', marginBottom: '2px' }}>
                  {inq.name}
                </p>
                <p style={{ color: '#7a6e62', fontSize: '0.8rem' }}>{inq.email}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
                <StatusBadge status={inq.status} />
                <span style={{ color: '#7a6e62', fontSize: '0.75rem' }}>{formatDate(inq.createdAt)}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
