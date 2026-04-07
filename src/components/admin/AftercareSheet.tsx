'use client'

import { useState } from 'react'
import { useQuery, useAction, useConvexAuth } from 'convex/react'
import { toast } from 'sonner'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { api } from '../../../convex/_generated/api'
import { Id } from '../../../convex/_generated/dataModel'
import { Btn } from '@/components/ui/Btn'

const ghostInput: React.CSSProperties = {
  width: '100%', background: 'rgba(237,233,230,0.03)', border: '1px solid rgba(237,233,230,0.14)',
  color: 'var(--paper)', padding: '10px 14px', fontSize: '0.9rem', minHeight: '44px', outline: 'none',
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
      await sendAftercare({ projectId: projectId as Id<"projects">, threadId: threadId as Id<"mailThreads">, to, subject: 'Etterbehandling — Trovum Tattoo', body })
      toast.success('Aftercare-melding sendt')
      onOpenChange(false)
    } catch (e) { toast.error(`Feil: ${(e as Error).message}`) }
    finally { setSending(false) }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent style={{ background: 'var(--panel)' }} className='border-l border-rule-heavy w-full sm:max-w-md'>
        <SheetHeader>
          <SheetTitle className='font-serif italic text-paper'>Send aftercare</SheetTitle>
        </SheetHeader>
        <div className='mt-6 flex flex-col gap-4 px-4'>
          {aftercareTemplates.length > 0 && (
            <div>
              <label className='block font-sans text-[10px] tracking-[0.14em] uppercase text-nav mb-2'>Velg mal</label>
              <div className='relative'>
                <select value={selectedTemplateId} onChange={(e) => { setSelectedTemplateId(e.target.value); const tpl = aftercareTemplates.find((t) => t._id === e.target.value); if (tpl) setBody(tpl.content) }} style={ghostInput} className='appearance-none cursor-pointer'>
                  <option value=''>Velg mal…</option>
                  {aftercareTemplates.map((t) => <option key={t._id} value={t._id}>{t.title}</option>)}
                </select>
                <svg className='absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none' width='12' height='8' viewBox='0 0 12 8' fill='none'><path d='M1 1l5 5 5-5' stroke='var(--nav)' strokeWidth='1.5' strokeLinecap='square'/></svg>
              </div>
            </div>
          )}
          <div>
            <label className='block font-sans text-[10px] tracking-[0.14em] uppercase text-nav mb-2'>Mottaker</label>
            <input value={to} onChange={(e) => setTo(e.target.value)} style={ghostInput} type='email' />
          </div>
          <div>
            <label className='block font-sans text-[10px] tracking-[0.14em] uppercase text-nav mb-2'>Melding</label>
            <textarea value={body} onChange={(e) => setBody(e.target.value)} style={{ ...ghostInput, minHeight: '120px', resize: 'vertical' }} placeholder='Aftercare-instruksjoner…' />
          </div>
          <Btn variant='action-primary' onClick={handleSend} disabled={sending || !!aftercareSentAt}>
            {aftercareSentAt ? 'Aftercare sendt' : sending ? 'Sender…' : 'Send aftercare'}
          </Btn>
        </div>
      </SheetContent>
    </Sheet>
  )
}
