'use client'

import { useState } from 'react'
import { useMutation, useQuery, useConvexAuth } from 'convex/react'
import { toast } from 'sonner'
import { api } from '../../../convex/_generated/api'
import { InputField } from '@/components/ui/FormField'
import { Btn } from '@/components/ui/Btn'

export function MailAccountForm() {
  const { isAuthenticated } = useConvexAuth()
  const current = useQuery(api.mail.account.getCurrent, isAuthenticated ? {} : 'skip')
  const save = useMutation(api.mail.account.save)

  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)

  const [emailAddress, setEmailAddress] = useState('')
  const [password, setPassword] = useState('')
  const [fromName, setFromName] = useState('')
  const [hostImap, setHostImap] = useState('')
  const [hostSmtp, setHostSmtp] = useState('')

  function startEdit() {
    setEmailAddress(current?.emailAddress ?? '')
    setFromName(current?.fromName ?? '')
    setPassword('')
    setHostImap(current?.hostImap ?? '')
    setHostSmtp(current?.hostSmtp ?? '')
    setShowAdvanced(false)
    setEditing(true)
  }

  async function handleSave() {
    if (!emailAddress || !fromName) {
      toast.error('E-post og avsendernavn er påkrevd')
      return
    }
    if (!current && !password) {
      toast.error('Passord er påkrevd for ny konto')
      return
    }
    setSaving(true)
    try {
      await save({
        emailAddress,
        password: password || undefined,
        fromName,
        hostImap: hostImap || undefined,
        hostSmtp: hostSmtp || undefined,
      })
      toast.success('Mail-konto lagret')
      setEditing(false)
    } catch {
      toast.error('Kunne ikke lagre mail-konto')
    } finally {
      setSaving(false)
    }
  }

  if (!editing) {
    return (
      <div className='flex flex-col gap-4'>
        <div className='flex items-center gap-3'>
          <span
            className='inline-block w-[8px] h-[8px] shrink-0'
            style={{
              borderRadius: '50%',
              background: current ? 'var(--status-booked)' : 'var(--mast-left)',
            }}
          />
          <span className='font-sans text-[14px] text-paper'>
            {current
              ? `${current.fromName} \u2014 ${current.emailAddress}`
              : 'Ingen konto konfigurert'}
          </span>
        </div>

        {current?.lastSyncAt && (
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

        <div>
          <Btn variant='sm' onClick={startEdit}>
            {current ? 'Rediger konto' : 'Konfigurer konto'}
          </Btn>
        </div>
      </div>
    )
  }

  return (
    <div className='flex flex-col gap-4'>
      <InputField
        label='E-postadresse'
        type='email'
        value={emailAddress}
        onChange={(e) => setEmailAddress(e.target.value)}
        placeholder='din@epost.no'
        autoComplete='email'
      />

      <InputField
        label='Passord'
        type='password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder={current ? '••••••••  (la stå for å beholde)' : 'IMAP/SMTP-passord'}
        autoComplete='new-password'
      />

      <InputField
        label='Avsendernavn'
        type='text'
        value={fromName}
        onChange={(e) => setFromName(e.target.value)}
        placeholder='Trovum Tattoo'
      />

      <button
        type='button'
        onClick={() => setShowAdvanced(!showAdvanced)}
        className='font-sans text-[10px] tracking-[0.12em] uppercase text-nav self-start hover:text-paper transition-colors duration-[200ms] cursor-pointer'
      >
        {showAdvanced ? '↑ Skjul avansert' : '↓ Avansert'}
      </button>

      {showAdvanced && (
        <div className='flex flex-col gap-3 pl-4 border-l border-rule'>
          <p className='font-sans text-[12px] text-mast-left'>
            Standard: IMAP imap.one.com:993 — SMTP send.one.com:465
          </p>
          <InputField
            label='IMAP-server'
            type='text'
            value={hostImap}
            onChange={(e) => setHostImap(e.target.value)}
            placeholder='imap.one.com'
            optional
          />
          <InputField
            label='SMTP-server'
            type='text'
            value={hostSmtp}
            onChange={(e) => setHostSmtp(e.target.value)}
            placeholder='send.one.com'
            optional
          />
        </div>
      )}

      <div className='flex gap-3 mt-2'>
        <Btn variant='action-primary' onClick={handleSave} disabled={saving} className='flex-1'>
          {saving ? 'Lagrer…' : 'Lagre konto'}
        </Btn>
        <Btn variant='sm' onClick={() => setEditing(false)} disabled={saving}>
          Avbryt
        </Btn>
      </div>
    </div>
  )
}
