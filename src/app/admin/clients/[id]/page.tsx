'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import { useQuery, useMutation, useConvexAuth } from 'convex/react'
import { toast } from 'sonner'
import { api } from '../../../../../convex/_generated/api'
import { Id } from '../../../../../convex/_generated/dataModel'
import { StatusBadge } from '@/components/admin/StatusBadge'

function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString('nb-NO', { day: '2-digit', month: 'short', year: 'numeric' })
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: '#1c1916',
  border: '1px solid #2a2724',
  borderRadius: '4px',
  color: '#c9b99a',
  padding: '10px 14px',
  fontSize: '0.9rem',
  outline: 'none',
}

export default function ClientDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { isAuthenticated } = useConvexAuth()
  const [notes, setNotes] = useState<string | null>(null)
  const [savingNotes, setSavingNotes] = useState(false)

  const client = useQuery(api.clients.get, isAuthenticated ? { id: id as Id<"clients"> } : 'skip')
  const projects = useQuery(api.projects.listByClient, isAuthenticated && client ? { clientId: id as Id<"clients"> } : 'skip')
  const mailThreads = useQuery(api.mail.queries.listByClient, isAuthenticated ? { clientId: id as Id<"clients"> } : 'skip')
  const updateClient = useMutation(api.clients.update)

  if (!isAuthenticated || client === undefined) {
    return <p style={{ color: '#7a6e62', padding: '20px' }}>Laster…</p>
  }
  if (!client) {
    return (
      <div style={{ padding: '20px' }}>
        <p style={{ color: '#c96b6b' }}>Kunden ble ikke funnet.</p>
        <Link href='/admin/clients' style={{ color: '#c9933a', fontSize: '0.875rem' }}>← Tilbake</Link>
      </div>
    )
  }

  const currentNotes = notes ?? (client.notes || '')

  async function saveNotes() {
    setSavingNotes(true)
    try {
      await updateClient({ id: id as Id<"clients">, notes: currentNotes || undefined })
      toast.success('Notater lagret')
    } catch {
      toast.error('Kunne ikke lagre notater')
    } finally {
      setSavingNotes(false)
    }
  }

  return (
    <div className='mx-auto max-w-2xl'>
      <Link href='/admin/clients' style={{ color: '#7a6e62', fontSize: '0.875rem', textDecoration: 'none', display: 'block', marginBottom: '20px' }}>
        ← Tilbake
      </Link>

      <h1 style={{ color: '#c9b99a', fontSize: '1.3rem', fontWeight: '600', marginBottom: '20px' }}>{client.name}</h1>

      {/* Client info */}
      <div style={{ background: '#141210', border: '1px solid #2a2724', borderRadius: '8px', padding: '20px', marginBottom: '24px' }}>
        <div style={{ display: 'grid', gap: '12px' }}>
          <p style={{ color: '#7a6e62', fontSize: '0.8rem' }}>E-post: <span style={{ color: '#c9b99a' }}>{client.email}</span></p>
          {client.phone && <p style={{ color: '#7a6e62', fontSize: '0.8rem' }}>Telefon: <span style={{ color: '#c9b99a' }}>{client.phone}</span></p>}
          {client.instagramHandle && <p style={{ color: '#7a6e62', fontSize: '0.8rem' }}>Instagram: <span style={{ color: '#c9b99a' }}>{client.instagramHandle}</span></p>}
        </div>

        {/* Notes — inline editable */}
        <div style={{ marginTop: '20px', borderTop: '1px solid #2a2724', paddingTop: '16px' }}>
          <label style={{ display: 'block', fontSize: '0.8rem', color: '#7a6e62', marginBottom: '8px' }}>Notater</label>
          <textarea
            value={currentNotes}
            onChange={(e) => setNotes(e.target.value)}
            style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
            placeholder='Legg til notater om kunden…'
          />
          <button
            onClick={saveNotes}
            disabled={savingNotes}
            style={{
              marginTop: '8px',
              padding: '8px 16px',
              background: '#c9933a',
              color: '#0d0c0b',
              border: 'none',
              borderRadius: '4px',
              cursor: savingNotes ? 'not-allowed' : 'pointer',
              fontSize: '0.85rem',
              minHeight: '40px',
            }}
          >
            {savingNotes ? 'Lagrer…' : 'Lagre notater'}
          </button>
        </div>
      </div>

      {/* Mail threads */}
      {mailThreads && (mailThreads as any[]).length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ color: '#c9b99a', fontSize: '1rem', marginBottom: '12px' }}>Koblede e-posttråder</h2>
          <div className='flex flex-col gap-2'>
            {(mailThreads as any[]).map((t) => (
              <Link key={t._id} href={`/admin/mail/${t._id}`} style={{ padding: '12px 14px', background: '#1c1916', border: '1px solid #2a2724', borderRadius: '6px', textDecoration: 'none', display: 'block' }}>
                <p style={{ color: '#c9b99a', fontSize: '0.875rem' }}>{t.subject}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      <div>
        <h2 style={{ color: '#c9b99a', fontSize: '1rem', marginBottom: '12px' }}>Prosjekter</h2>
        {projects === undefined ? (
          <p style={{ color: '#7a6e62' }}>Laster…</p>
        ) : projects.length === 0 ? (
          <p style={{ color: '#7a6e62', fontSize: '0.875rem' }}>Ingen prosjekter ennå.</p>
        ) : (
          <div className='flex flex-col gap-2'>
            {(projects as any[]).map((p) => (
              <Link
                key={p._id}
                href={`/admin/projects/${p._id}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  background: '#1c1916',
                  border: '1px solid #2a2724',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  gap: '12px',
                }}
              >
                <StatusBadge status={p.status} />
                <span style={{ color: '#7a6e62', fontSize: '0.75rem' }}>{formatDate(p.createdAt)}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
