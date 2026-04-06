'use client'

import { useQuery, useAction, useConvexAuth } from 'convex/react'
import { toast } from 'sonner'
import { PushSubscriptionManager } from '@/components/admin/PushSubscriptionManager'
import { api } from '../../../../convex/_generated/api'

function formatDate(ts: number | undefined) {
  if (!ts) return 'Aldri'
  return new Intl.DateTimeFormat('nb-NO', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(ts))
}

export default function SettingsPage() {
  const { isAuthenticated } = useConvexAuth()

  const mailAccounts = useQuery(
    api.mail.queries.listThreads,
    isAuthenticated ? {} : 'skip',
  )

  const syncMail = useAction(api.mail.sync.syncMail)

  async function handleForcSync() {
    try {
      await syncMail({})
      toast.success('Synkronisering startet')
    } catch {
      toast.error('Synkronisering feilet')
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '600px' }}>
      <h1 className='text-xl font-medium' style={{ color: '#c9b99a' }}>
        Innstillinger
      </h1>

      {/* Push notifications */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h2 style={{ color: '#c9b99a', fontSize: '1rem', fontWeight: '600' }}>Push-varsler</h2>
        <div
          style={{
            background: '#141210',
            border: '1px solid #2a2724',
            borderRadius: '8px',
            padding: '20px',
          }}
        >
          <PushSubscriptionManager />
        </div>
      </section>

      {/* Mail account */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h2 style={{ color: '#c9b99a', fontSize: '1rem', fontWeight: '600' }}>Mail-konto</h2>
        <div
          style={{
            background: '#141210',
            border: '1px solid #2a2724',
            borderRadius: '8px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span
              style={{
                display: 'inline-block',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: 'var(--color-status-booket)',
                flexShrink: 0,
              }}
            />
            <span style={{ color: '#c9b99a', fontSize: '0.875rem' }}>IMAP/SMTP konfigurert</span>
          </div>

          <div style={{ fontSize: '0.8rem', color: '#7a6e62' }}>
            Sist synkronisert: —
          </div>

          <button
            onClick={handleForcSync}
            style={{
              padding: '10px 18px',
              background: 'transparent',
              color: '#c9b99a',
              border: '1px solid #2a2724',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.875rem',
              minHeight: '48px',
              alignSelf: 'flex-start',
            }}
          >
            Tving synkronisering
          </button>
        </div>
      </section>

      {/* Conta */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h2 style={{ color: '#c9b99a', fontSize: '1rem', fontWeight: '600' }}>Conta</h2>
        <div
          style={{
            background: '#141210',
            border: '1px solid #2a2724',
            borderRadius: '8px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <p style={{ color: '#7a6e62', fontSize: '0.875rem', lineHeight: '1.6' }}>
            Conta er regnskapssystemet som brukes for fakturering. Etter at et prosjekt er fullført
            og betalt, registrer fakturanummer fra Conta på prosjektsiden under «Conta-referanse».
            Merk prosjektet som «Fakturert i Conta» for å holde oversikt over hva som er
            bokført.
          </p>
          <p style={{ color: '#7a6e62', fontSize: '0.8rem' }}>
            Logg inn på{' '}
            <span style={{ color: '#c9933a' }}>conta.no</span> for å opprette og sende fakturaer.
          </p>
        </div>
      </section>
    </div>
  )
}
