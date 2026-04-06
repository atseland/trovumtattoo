'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useQuery, useConvexAuth } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import { StatusBadge } from '@/components/admin/StatusBadge'

const STATUS_FILTERS: { label: string; value: string | undefined }[] = [
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
  const router = useRouter()
  const searchParams = useSearchParams()

  const activeFilter = searchParams.get('status') ?? undefined
  const coverUpFilter = searchParams.get('coverUp') === '1' ? true : undefined
  const touchUpFilter = searchParams.get('touchUp') === '1' ? true : undefined

  function updateParams(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString())
    if (value === null) {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    router.replace(`/admin/inquiries?${params.toString()}`)
  }

  const inquiries = useQuery(
    api.inquiries.list,
    isAuthenticated ? { status: activeFilter, coverUp: coverUpFilter, touchUp: touchUpFilter } : 'skip'
  )

  if (!isAuthenticated) {
    return <p style={{ color: '#7a6e62', padding: '20px' }}>Laster inn…</p>
  }

  return (
    <div>
      <h1 className='mb-6 text-xl font-medium' style={{ color: '#c9b99a' }}>Forespørsler</h1>

      {/* Status filter tabs */}
      <div className='mb-4 flex flex-wrap gap-2'>
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.label}
            onClick={() => updateParams('status', f.value ?? null)}
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

      {/* Type filter chips */}
      <div className='mb-6 flex flex-wrap gap-2'>
        <button
          onClick={() => updateParams('coverUp', coverUpFilter ? null : '1')}
          style={{
            padding: '6px 14px',
            borderRadius: '999px',
            border: '1px solid',
            borderColor: coverUpFilter ? '#c9933a' : '#2a2724',
            background: coverUpFilter ? '#2a1e0d' : 'transparent',
            color: coverUpFilter ? '#c9933a' : '#7a6e62',
            fontSize: '0.8rem',
            cursor: 'pointer',
            minHeight: '36px',
          }}
        >
          Cover-up
        </button>
        <button
          onClick={() => updateParams('touchUp', touchUpFilter ? null : '1')}
          style={{
            padding: '6px 14px',
            borderRadius: '999px',
            border: '1px solid',
            borderColor: touchUpFilter ? '#c9933a' : '#2a2724',
            background: touchUpFilter ? '#2a1e0d' : 'transparent',
            color: touchUpFilter ? '#c9933a' : '#7a6e62',
            fontSize: '0.8rem',
            cursor: 'pointer',
            minHeight: '36px',
          }}
        >
          Touch-up
        </button>
      </div>

      {/* List */}
      {inquiries === undefined ? (
        <p style={{ color: '#7a6e62' }}>Laster…</p>
      ) : inquiries.length === 0 ? (
        <div style={{ padding: '40px 0', textAlign: 'center' }}>
          <p style={{ color: '#7a6e62' }}>Ingen forespørsler funnet.</p>
          {(activeFilter || coverUpFilter || touchUpFilter) && (
            <button
              onClick={() => router.replace('/admin/inquiries')}
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
