'use client'

import { useQuery, useConvexAuth } from 'convex/react'
import { api } from '@convex/_generated/api'

function ConfigRow({ label, value }: { label: string; value: string }) {
  return (
    <div className='flex items-start justify-between gap-3 flex-wrap'>
      <span className='font-sans text-[11px] tracking-[0.1em] uppercase text-nav'>{label}</span>
      <span className='font-sans text-[13px] text-paper text-right'>{value}</span>
    </div>
  )
}

export function MailAccountForm() {
  const { isAuthenticated } = useConvexAuth()
  const current = useQuery(api.mail.account.getCurrent, isAuthenticated ? {} : 'skip')

  if (current === undefined) {
    return <p className='font-sans text-[13px] text-mast-left'>Laster mailoppsett…</p>
  }

  if (!current) {
    return (
      <div className='flex flex-col gap-3'>
        <p className='font-sans text-[14px] text-paper'>
          Mail er ikke konfigurert i servermiljoet.
        </p>
        <p className='font-sans text-[12px] text-mast-left leading-[1.7]'>
          Sett `MAIL_USERNAME`, `MAIL_PASSWORD`, `MAIL_FROM`, `MAIL_HOST_IMAP`, `MAIL_PORT_IMAP`,
          `MAIL_HOST_SMTP` og `MAIL_PORT_SMTP` i Convex for aa aktivere innboks og utsending.
        </p>
      </div>
    )
  }

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex items-center gap-3'>
        <span
          className='inline-block w-[8px] h-[8px] shrink-0'
          style={{ borderRadius: '50%', background: 'var(--status-booked)' }}
        />
        <span className='font-sans text-[14px] text-paper'>
          {current.fromName} — {current.emailAddress}
        </span>
      </div>

      <p className='font-sans text-[12px] text-mast-left leading-[1.7]'>
        Mailkontoen er laast til serverkonfigurasjon og styres ikke fra admin-UI.
      </p>

      <div className='flex flex-col gap-3 border border-rule px-4 py-4 bg-[rgba(237,233,230,0.02)]'>
        <ConfigRow label='IMAP' value={`${current.hostImap}:${current.portImap}`} />
        <ConfigRow label='SMTP' value={`${current.hostSmtp}:${current.portSmtp}`} />
        <ConfigRow label='POP3' value='pop.one.com:995 (ikke brukt av appen)' />
      </div>

      {current.lastSyncAt && (
        <p className='font-sans text-[12px] text-mast-left'>
          Sist synkronisert:{' '}
          {new Date(current.lastSyncAt).toLocaleString('nb-NO', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      )}
    </div>
  )
}
