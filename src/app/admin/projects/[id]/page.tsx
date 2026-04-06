'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import { useQuery, useMutation, useConvexAuth } from 'convex/react'
import { toast } from 'sonner'
// TODO: fjern cast etter npx convex dev
import { api } from '../../../../../convex/_generated/api'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { ActivityLogTimeline } from '@/components/admin/ActivityLogTimeline'

const inputStyle: React.CSSProperties = {
  background: '#1c1916',
  border: '1px solid #2a2724',
  borderRadius: '4px',
  color: '#c9b99a',
  padding: '10px 14px',
  fontSize: '0.9rem',
  minHeight: '44px',
  outline: 'none',
  width: '100%',
}

const depositStatusColor: Record<string, string> = {
  pending: '#c9933a',
  received: '#4ab97a',
  waived: '#7a6e62',
}

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { isAuthenticated } = useConvexAuth()

  const project = useQuery((api as any).projects.get, isAuthenticated ? { id } : 'skip')
  const client = useQuery(
    (api as any).clients.get,
    isAuthenticated && project ? { id: project.clientId } : 'skip'
  )
  const activityLog = useQuery(
    (api as any).activityLog.listByEntity,
    isAuthenticated ? { entityType: 'project', entityId: id } : 'skip'
  )
  const updateProject = useMutation((api as any).projects.update)

  // Estimate state
  const [estimate, setEstimate] = useState<string>('')
  const [savingEstimate, setSavingEstimate] = useState(false)

  // Deposit state
  const [depositAmount, setDepositAmount] = useState<string>('')
  const [depositStatus, setDepositStatus] = useState<string>('pending')
  const [paymentLink, setPaymentLink] = useState<string>('')
  const [paymentNote, setPaymentNote] = useState<string>('')
  const [savingDeposit, setSavingDeposit] = useState(false)

  // Sync state from project when it loads (only once)
  const [synced, setSynced] = useState(false)
  if (project && !synced) {
    setEstimate(project.estimatedPrice?.toString() ?? '')
    setDepositAmount(project.depositAmount?.toString() ?? '')
    setDepositStatus(project.depositStatus ?? 'pending')
    setPaymentLink(project.paymentLink ?? '')
    setPaymentNote(project.paymentNote ?? '')
    setSynced(true)
  }

  if (!isAuthenticated || project === undefined) {
    return <p style={{ color: '#7a6e62', padding: '20px' }}>Laster…</p>
  }
  if (!project) {
    return (
      <div style={{ padding: '20px' }}>
        <p style={{ color: '#c96b6b' }}>Prosjektet ble ikke funnet.</p>
        <Link href='/admin/clients' style={{ color: '#c9933a', fontSize: '0.875rem' }}>← Tilbake</Link>
      </div>
    )
  }

  async function saveEstimate() {
    setSavingEstimate(true)
    try {
      await updateProject({ id, estimatedPrice: estimate ? parseFloat(estimate) : undefined })
      toast.success('Estimat lagret')
    } catch {
      toast.error('Kunne ikke lagre estimat')
    } finally {
      setSavingEstimate(false)
    }
  }

  async function saveDeposit() {
    setSavingDeposit(true)
    try {
      await updateProject({
        id,
        depositAmount: depositAmount ? parseFloat(depositAmount) : undefined,
        depositStatus: depositStatus || undefined,
        paymentLink: paymentLink || undefined,
        paymentNote: paymentNote || undefined,
      })
      toast.success('Depositum lagret')
    } catch {
      toast.error('Kunne ikke lagre depositum')
    } finally {
      setSavingDeposit(false)
    }
  }

  return (
    <div className='mx-auto max-w-2xl'>
      <Link href={`/admin/clients/${project.clientId}`} style={{ color: '#7a6e62', fontSize: '0.875rem', textDecoration: 'none', display: 'block', marginBottom: '20px' }}>
        ← Tilbake til klient
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <h1 style={{ color: '#c9b99a', fontSize: '1.3rem', fontWeight: '600' }}>Prosjekt</h1>
        <StatusBadge status={project.status} />
      </div>

      {/* Quick actions */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <button style={{ padding: '8px 16px', background: '#c9933a', color: '#0d0c0b', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.875rem', minHeight: '40px' }}>
          Endre status
        </button>
        <button style={{ padding: '8px 16px', background: 'transparent', color: '#c9b99a', border: '1px solid #2a2724', borderRadius: '4px', cursor: 'pointer', fontSize: '0.875rem', minHeight: '40px' }}>
          Opprett booking
        </button>
      </div>

      {/* Client + inquiry links */}
      <div style={{ background: '#141210', border: '1px solid #2a2724', borderRadius: '8px', padding: '16px', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {client && (
          <p style={{ color: '#7a6e62', fontSize: '0.85rem' }}>
            Klient:{' '}
            <Link href={`/admin/clients/${project.clientId}`} style={{ color: '#c9b99a' }}>
              {(client as any).name}
            </Link>
          </p>
        )}
        {project.inquiryId && (
          <p style={{ color: '#7a6e62', fontSize: '0.85rem' }}>
            Forespørsel:{' '}
            <Link href={`/admin/inquiries/${project.inquiryId}`} style={{ color: '#c9933a' }}>
              Vis forespørsel →
            </Link>
          </p>
        )}
      </div>

      {/* Estimate section */}
      <div style={{ background: '#141210', border: '1px solid #2a2724', borderRadius: '8px', padding: '20px', marginBottom: '20px' }}>
        <h2 style={{ color: '#c9b99a', fontSize: '1rem', marginBottom: '16px' }}>Estimat</h2>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontSize: '0.8rem', color: '#7a6e62', marginBottom: '6px' }}>Beløp (NOK)</label>
            <input
              type='number'
              value={estimate}
              onChange={(e) => setEstimate(e.target.value)}
              placeholder='F.eks. 4500'
              style={inputStyle}
            />
          </div>
          <button
            onClick={saveEstimate}
            disabled={savingEstimate}
            style={{
              padding: '10px 16px',
              background: savingEstimate ? '#5a4a2a' : '#c9933a',
              color: '#0d0c0b',
              border: 'none',
              borderRadius: '4px',
              cursor: savingEstimate ? 'not-allowed' : 'pointer',
              fontSize: '0.875rem',
              minHeight: '44px',
              flexShrink: 0,
            }}
          >
            Lagre
          </button>
        </div>
      </div>

      {/* Deposit section */}
      <div style={{ background: '#141210', border: '1px solid #2a2724', borderRadius: '8px', padding: '20px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <h2 style={{ color: '#c9b99a', fontSize: '1rem' }}>Depositum</h2>
          {depositStatus && (
            <span style={{
              fontSize: '0.75rem',
              color: depositStatusColor[depositStatus] ?? '#7a6e62',
              fontWeight: '500',
            }}>
              {depositStatus === 'received' ? '✓ Mottatt' : depositStatus === 'pending' ? '⏳ Venter' : '— Frafalt'}
            </span>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#7a6e62', marginBottom: '6px' }}>Beløp (NOK)</label>
              <input type='number' value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} placeholder='F.eks. 1000' style={inputStyle} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#7a6e62', marginBottom: '6px' }}>Status</label>
              <select value={depositStatus} onChange={(e) => setDepositStatus(e.target.value)} style={inputStyle}>
                <option value='pending'>Venter</option>
                <option value='received'>Mottatt</option>
                <option value='waived'>Frafalt</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: '#7a6e62', marginBottom: '6px' }}>Betalingslenke (URL)</label>
            <input type='url' value={paymentLink} onChange={(e) => setPaymentLink(e.target.value)} placeholder='https://' style={inputStyle} />
            {project.paymentLink && (
              <a href={project.paymentLink} target='_blank' rel='noopener noreferrer' style={{ fontSize: '0.75rem', color: '#c9933a', display: 'block', marginTop: '4px' }}>
                Åpne betalingslenke →
              </a>
            )}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: '#7a6e62', marginBottom: '6px' }}>Betalingsnotat</label>
            <input value={paymentNote} onChange={(e) => setPaymentNote(e.target.value)} placeholder='F.eks. Vipps-referanse' style={inputStyle} />
          </div>

          <button
            onClick={saveDeposit}
            disabled={savingDeposit}
            style={{
              background: savingDeposit ? '#5a4a2a' : '#c9933a',
              color: '#0d0c0b',
              border: 'none',
              borderRadius: '4px',
              padding: '12px',
              fontSize: '0.9rem',
              fontWeight: '500',
              cursor: savingDeposit ? 'not-allowed' : 'pointer',
              minHeight: '48px',
            }}
          >
            {savingDeposit ? 'Lagrer…' : 'Lagre depositum'}
          </button>
        </div>
      </div>

      {/* Activity log */}
      <div>
        <h2 style={{ color: '#c9b99a', fontSize: '1rem', marginBottom: '16px' }}>Aktivitetslogg</h2>
        {activityLog === undefined ? (
          <p style={{ color: '#7a6e62', fontSize: '0.875rem' }}>Laster…</p>
        ) : (
          <ActivityLogTimeline entries={(activityLog ?? []) as any[]} />
        )}
      </div>
    </div>
  )
}
