'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useQuery, useConvexAuth } from 'convex/react'
// TODO: fjern cast etter npx convex dev
import { api } from '../../../../../convex/_generated/api'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { ActivityLogTimeline } from '@/components/admin/ActivityLogTimeline'

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
          Legg til notat
        </button>
        <button style={{ padding: '8px 16px', background: 'transparent', color: '#c9b99a', border: '1px solid #2a2724', borderRadius: '4px', cursor: 'pointer', fontSize: '0.875rem', minHeight: '40px' }}>
          Opprett booking
        </button>
      </div>

      {/* Info */}
      <div style={{ background: '#141210', border: '1px solid #2a2724', borderRadius: '8px', padding: '20px', marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
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
            <Link href={`/admin/inquiries/${project.inquiryId}`} style={{ color: '#c9933a', fontSize: '0.85rem' }}>
              Vis forespørsel
            </Link>
          </p>
        )}
        {project.estimatedPrice && (
          <p style={{ color: '#7a6e62', fontSize: '0.85rem' }}>
            Estimert pris: <span style={{ color: '#c9b99a' }}>{project.estimatedPrice.toLocaleString('nb-NO')} kr</span>
          </p>
        )}
        {project.depositStatus && (
          <p style={{ color: '#7a6e62', fontSize: '0.85rem' }}>
            Depositum:{' '}
            <span style={{ color: project.depositStatus === 'received' ? '#4ab97a' : project.depositStatus === 'pending' ? '#c9933a' : '#7a6e62' }}>
              {project.depositStatus}
            </span>
          </p>
        )}
        {/* Placeholder — bookinger implementeres i TASK-040 */}
        <p style={{ color: '#7a6e62', fontSize: '0.85rem', fontStyle: 'italic' }}>Bookinger: implementeres i TASK-040</p>
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
