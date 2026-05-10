'use client'

import { useState } from 'react'
import { useAction } from 'convex/react'
import { toast } from 'sonner'
import { api } from '@convex/_generated/api'
import type { Id } from '@convex/_generated/dataModel'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Btn } from '@/components/ui/Btn'
import { InputField, TextareaField } from '@/components/ui/FormField'

interface CustomerMailSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  clientId: string | Id<'clients'>
  clientName: string
  clientEmail: string
}

export function CustomerMailSheet({
  open,
  onOpenChange,
  clientId,
  clientName,
  clientEmail,
}: CustomerMailSheetProps) {
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [sending, setSending] = useState(false)
  const sendCustomerMessage = useAction(api.mail.sendCustomerMessage.sendCustomerMessage)

  async function handleSend() {
    setSending(true)
    try {
      await sendCustomerMessage({
        clientId: clientId as Id<'clients'>,
        subject,
        body,
      })
      toast.success('E-post sendt')
      setSubject('')
      setBody('')
      onOpenChange(false)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Kunne ikke sende e-post'
      toast.error(message)
    } finally {
      setSending(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent style={{ background: 'var(--panel)' }} className='border-l border-rule-heavy w-full sm:max-w-md'>
        <SheetHeader>
          <SheetTitle className='font-serif italic text-paper'>Ny e-post</SheetTitle>
        </SheetHeader>

        <div className='mt-6 flex flex-col gap-4 px-4'>
          <div className='border border-rule bg-[rgba(237,233,230,0.02)] px-4 py-3'>
            <p className='mb-[3px] font-sans text-[10px] uppercase tracking-[0.14em] text-nav'>Mottaker</p>
            <p className='font-sans text-[14px] text-paper'>{clientName}</p>
            <p className='font-sans text-[13px] text-mast-left'>{clientEmail}</p>
          </div>

          <InputField
            label='Emne'
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            placeholder='Kort emne'
          />
          <TextareaField
            label='Melding'
            value={body}
            onChange={(event) => setBody(event.target.value)}
            placeholder='Skriv melding til kunden…'
            rows={6}
            className='min-h-[150px]'
          />

          <Btn
            variant='action-primary'
            onClick={handleSend}
            disabled={sending || !subject.trim() || !body.trim()}
          >
            {sending ? 'Sender…' : 'Send e-post'}
          </Btn>
        </div>
      </SheetContent>
    </Sheet>
  )
}
