'use client'

import { useState } from 'react'
import { useQuery, useConvexAuth } from 'convex/react'
import { useAction } from 'convex/react'
import { toast } from 'sonner'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
// TODO: fjern cast etter npx convex dev
import { api } from '../../../convex/_generated/api'

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
  projectId: string
  clientEmail: string
  threadId?: string
  reviewRequestedAt?: number | null
}

export function ReviewRequestSheet({ open, onOpenChange, projectId, clientEmail, threadId, reviewRequestedAt }: Props) {
  const { isAuthenticated } = useConvexAuth()
  const [selectedTemplateId, setSelectedTemplateId] = useState('')
  const [body, setBody] = useState('')
  const [to, setTo] = useState(clientEmail)
  const [sending, setSending] = useState(false)

  const templates = useQuery((api as any).templates.list, isAuthenticated ? {} : 'skip')
  const reviewTemplates = (templates as any[] | undefined)?.filter((t) => t.type === 'review-request') ?? []

  const sendReviewRequest = useAction((api as any).mail.sendReviewRequest.sendReviewRequest)

  async function handleSend() {
    if (!body.trim()) { toast.error('Legg til meldingsinnhold'); return }
    if (!threadId) { toast.error('Ingen e-posttråd tilknyttet prosjektet'); return }
    setSending(true)
    try {
      await sendReviewRequest({
        projectId,
        threadId,
        to,
        subject: 'Vil du gi oss en anmeldelse? — Trovum Tattoo',
        body,
      })
      toast.success('Anmeldelseforespørsel sendt')
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
          <SheetTitle style={{ color: '#c9b99a' }}>Be om anmeldelse</SheetTitle>
        </SheetHeader>

        <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {reviewTemplates.length > 0 && (
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#7a6e62', marginBottom: '6px' }}>Velg mal</label>
              <select
                value={selectedTemplateId}
                onChange={(e) => {
                  setSelectedTemplateId(e.target.value)
                  const tpl = reviewTemplates.find((t) => t._id === e.target.value)
                  if (tpl) setBody(tpl.content)
                }}
                style={inputStyle}
              >
                <option value=''>Velg mal…</option>
                {reviewTemplates.map((t) => <option key={t._id} value={t._id}>{t.title}</option>)}
              </select>
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: '#7a6e62', marginBottom: '6px' }}>Mottaker</label>
            <input value={to} onChange={(e) => setTo(e.target.value)} style={inputStyle} type='email' />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: '#7a6e62', marginBottom: '6px' }}>Melding</label>
            <textarea value={body} onChange={(e) => setBody(e.target.value)} style={{ ...inputStyle, minHeight: '120px', resize: 'vertical' }} placeholder='Be om anmeldelse…' />
          </div>

          <button
            onClick={handleSend}
            disabled={sending || !!reviewRequestedAt}
            style={{
              background: reviewRequestedAt ? '#1a2a1a' : sending ? '#5a4a2a' : '#c9933a',
              color: reviewRequestedAt ? '#4ab97a' : '#0d0c0b',
              border: reviewRequestedAt ? '1px solid #1a2a1a' : 'none',
              borderRadius: '4px',
              padding: '12px',
              fontSize: '0.9rem',
              fontWeight: '500',
              cursor: reviewRequestedAt || sending ? 'not-allowed' : 'pointer',
              minHeight: '48px',
            }}
          >
            {reviewRequestedAt ? '✓ Anmeldelse forespurt' : sending ? 'Sender…' : 'Send forespørsel'}
          </button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
