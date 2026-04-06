'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import { useQuery, useConvexAuth } from 'convex/react'
// TODO: fjern cast etter npx convex dev
import { api } from '../../../../../convex/_generated/api'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { ActivityLogTimeline } from '@/components/admin/ActivityLogTimeline'
import { StatusChangeSheet } from '@/components/admin/StatusChangeSheet'

function Field({ label, value }: { label: string; value?: string | boolean | null }) {
  if (value === undefined || value === null || value === '') return null
  return (
    <div style={{ marginBottom: '16px' }}>
      <p style={{ color: '#7a6e62', fontSize: '0.75rem', marginBottom: '4px' }}>{label}</p>
      <p style={{ color: '#c9b99a', fontSize: '0.95rem' }}>
        {typeof value === 'boolean' ? (value ? 'Ja' : 'Nei') : value}
      </p>
    </div>
  )
}

export default function InquiryDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { isAuthenticated } = useConvexAuth()
  const [sheetOpen, setSheetOpen] = useState(false)

  const inquiry = useQuery(
    (api as any).inquiries.get,
    isAuthenticated ? { id } : 'skip'
  )

  const referenceImages = useQuery(
    (api as any).inquiries.getReferenceImages,
    isAuthenticated && inquiry ? { inquiryId: id } : 'skip'
  )

  const activityLog = useQuery(
    (api as any).activityLog.listByEntity,
    isAuthenticated ? { entityType: 'inquiry', entityId: id } : 'skip'
  )

  if (!isAuthenticated || inquiry === undefined) {
    return <p style={{ color: '#7a6e62', padding: '20px' }}>Laster…</p>
  }

  if (!inquiry) {
    return (
      <div style={{ padding: '20px' }}>
        <p style={{ color: '#c96b6b' }}>Forespørselen ble ikke funnet.</p>
        <Link href='/admin/inquiries' style={{ color: '#c9933a', fontSize: '0.875rem' }}>← Tilbake</Link>
      </div>
    )
  }

  return (
    <div className='mx-auto max-w-2xl'>
      {/* Back + actions */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <Link href='/admin/inquiries' style={{ color: '#7a6e62', fontSize: '0.875rem', textDecoration: 'none' }}>
          ← Tilbake
        </Link>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setSheetOpen(true)}
            style={{
              padding: '8px 16px',
              background: '#c9933a',
              color: '#0d0c0b',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.875rem',
              minHeight: '40px',
            }}
          >
            Endre status
          </button>
          {/* Opprett klient — implementeres i TASK-020 */}
          <button
            style={{
              padding: '8px 16px',
              background: 'transparent',
              color: '#c9b99a',
              border: '1px solid #2a2724',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.875rem',
              minHeight: '40px',
            }}
          >
            Opprett klient
          </button>
        </div>
      </div>

      {/* Header */}
      <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <h1 style={{ color: '#c9b99a', fontSize: '1.3rem', fontWeight: '600' }}>{inquiry.name}</h1>
        <StatusBadge status={inquiry.status} />
      </div>

      {/* Fields */}
      <div style={{ background: '#141210', border: '1px solid #2a2724', borderRadius: '8px', padding: '20px', marginBottom: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0 24px' }}>
          <Field label='E-post' value={inquiry.email} />
          <Field label='Telefon' value={inquiry.phone} />
          <Field label='Instagram' value={inquiry.instagramHandle} />
          <Field label='Plassering' value={inquiry.bodyPlacement} />
          <Field label='Størrelse' value={inquiry.size} />
          <Field label='Stil' value={inquiry.style} />
          <Field label='Budsjett' value={inquiry.budget} />
          <Field label='Ønsket tidsrom' value={inquiry.desiredTiming} />
          <Field label='Første tatovering' value={inquiry.firstTattoo} />
          <Field label='Cover-up' value={inquiry.coverUp} />
          <Field label='Touch-up' value={inquiry.touchUp} />
        </div>
        <div style={{ borderTop: '1px solid #2a2724', paddingTop: '16px', marginTop: '8px' }}>
          <Field label='Beskrivelse' value={inquiry.description} />
          <Field label='Ekstra notater' value={inquiry.extraNotes} />
        </div>
      </div>

      {/* Reference images */}
      {referenceImages && referenceImages.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ color: '#c9b99a', fontSize: '1rem', marginBottom: '12px' }}>Referansebilder</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '8px', overflowX: 'auto' }}>
            {(referenceImages as string[]).map((url, i) => (
              <a key={i} href={url} target='_blank' rel='noopener noreferrer'>
                <img
                  src={url}
                  alt={`Referansebilde ${i + 1}`}
                  style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', borderRadius: '4px', border: '1px solid #2a2724' }}
                />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Activity log */}
      <div>
        <h2 style={{ color: '#c9b99a', fontSize: '1rem', marginBottom: '16px' }}>Aktivitetslogg</h2>
        {activityLog === undefined ? (
          <p style={{ color: '#7a6e62', fontSize: '0.875rem' }}>Laster…</p>
        ) : (
          <ActivityLogTimeline entries={(activityLog ?? []) as any[]} />
        )}
      </div>

      {/* Status change sheet */}
      <StatusChangeSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        inquiryId={id}
        currentStatus={inquiry.status}
      />
    </div>
  )
}
