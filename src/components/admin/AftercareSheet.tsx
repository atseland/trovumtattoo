'use client'

import { useState } from 'react'
import { useQuery, useAction, useConvexAuth } from 'convex/react'
import { toast } from 'sonner'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { api } from '../../../convex/_generated/api'
import { Id } from '../../../convex/_generated/dataModel'

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: '#1c1916',
  border: '1px solid #2a2724',
  borderRadius: '4px',
  color: '#c9b99a',
  padding: '10px 14px',
  fontSize: '0.9rem',
  minHeight: '44px',
  outline: 'none',
}

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectId: string | Id<"projects">
  clientEmail: string
  threadId?: string
  aftercareSentAt?: number | null
}

export function AftercareSheet({ open, onOpenChange, projectId, clientEmail, threadId, aftercareSentAt }: Props) {
  const { isAuthenticated } = useConvexAuth()
  const [selectedTemplateId, setSelectedTemplateId] = useState('')
  const [body, setBody] = useState('')
  const [to, setTo] = useState(clientEmail)
  const [sending, setSending] = useState(false)

  const templates = useQuery(api.templates.list, isAuthenticated ? {} : 'skip')
  const aftercareTemplates = (templates as any[] | undefined)?.filter((t) => t.type === 'aftercare') ?? []

  const sendAftercare = useAction(api.mail.sendAftercare.sendAftercare)

  async function handleSend() {
    if (!body.trim()) { toast.error('Legg til meldingsinnhold'); return }
    if (!threadId) { toast.error('Ingen e-posttråd tilknyttet prosjektet'); return }
    setSending(true)
    try {
      await sendAftercare({
        projectId: projectId as Id<"projects">,
        threadId: threadId as Id<"mailThreads">,
        to,
        subject: 'Etterbehandling — Trovum Tattoo',
        body,
      })
      toast.success('Aftercare-melding sendt')
      onOpenChange(false)
    } catch (e) {
      toast.error(`Feil: ${(e as Error).message}`)
    } finally {
      setSending(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent style={{ background: '#141210', border: '1px solid #2a2724', color: '#c9b99a' }} className='w-full sm:max-w-md'>
        <SheetHeader>
          <SheetTitle style={{ color: '#c9b99a' }}>Send aftercare</SheetTitle>
        </SheetHeader>

        <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {aftercareTemplates.length > 0 && (
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#7a6e62', marginBottom: '6px' }}>Velg aftercare-mal</label>
              <select
                value={selectedTemplateId}
                onChange={(e) => {
                  setSelectedTemplateId(e.target.value)
                  const tpl = aftercareTemplates.find((t) => t._id === e.target.value)
                  if (tpl) setBody(tpl.content)
                }}
                style={inputStyle}
              >
                <option value=''>Velg mal…</option>
                {aftercareTemplates.map((t) => <option key={t._id} value={t._id}>{t.title}</option>)}
              </select>
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: '#7a6e62', marginBottom: '6px' }}>Mottaker</label>
            <input value={to} onChange={(e) => setTo(e.target.value)} style={inputStyle} type='email' />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: '#7a6e62', marginBottom: '6px' }}>Melding</label>
            <textarea value={body} onChange={(e) => setBody(e.target.value)} style={{ ...inputStyle, minHeight: '120px', resize: 'vertical' }} placeholder='Aftercare-instruksjoner…' />
          </div>

          <button
            onClick={handleSend}
            disabled={sending || !!aftercareSentAt}
            style={{
              background: aftercareSentAt ? '#1a2a1a' : sending ? '#5a4a2a' : '#c9933a',
              color: aftercareSentAt ? '#4ab97a' : '#0d0c0b',
              border: aftercareSentAt ? '1px solid #1a2a1a' : 'none',
              borderRadius: '4px',
              padding: '12px',
              fontSize: '0.9rem',
              fontWeight: '500',
              cursor: aftercareSentAt || sending ? 'not-allowed' : 'pointer',
              minHeight: '48px',
            }}
          >
            {aftercareSentAt ? '✓ Aftercare sendt' : sending ? 'Sender…' : 'Send aftercare'}
          </button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
