'use client'

import { useState } from 'react'
import { useQuery, useAction, useConvexAuth } from 'convex/react'
import { toast } from 'sonner'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { api } from '@convex/_generated/api'
import { Id } from '@convex/_generated/dataModel'
import { Btn } from '@/components/ui/Btn'
import { InputField, SelectField, TextareaField } from '@/components/ui/FormField'

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
  const aftercareTemplates = templates?.filter((t) => t.type === 'aftercare') ?? []
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
            <SelectField
              label='Velg mal'
              value={selectedTemplateId}
              onChange={(e) => {
                setSelectedTemplateId(e.target.value)
                const template = aftercareTemplates.find((item) => item._id === e.target.value)
                if (template) setBody(template.content)
              }}
            >
              <option value=''>Velg mal…</option>
              {aftercareTemplates.map((template) => (
                <option key={template._id} value={template._id}>{template.title}</option>
              ))}
            </SelectField>
          )}
          <InputField label='Mottaker' value={to} onChange={(e) => setTo(e.target.value)} type='email' />
          <TextareaField
            label='Melding'
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className='min-h-[120px]'
            placeholder='Aftercare-instruksjoner…'
          />
          <Btn variant='action-primary' onClick={handleSend} disabled={sending || !!aftercareSentAt}>
            {aftercareSentAt ? 'Aftercare sendt' : sending ? 'Sender…' : 'Send aftercare'}
          </Btn>
        </div>
      </SheetContent>
    </Sheet>
  )
}
