'use client'

import { useState } from 'react'
import { useMutation } from 'convex/react'
import { toast } from 'sonner'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { api } from '../../../convex/_generated/api'
import { Id } from '../../../convex/_generated/dataModel'
import { Btn } from '@/components/ui/Btn'

const ALL_STATUSES = [
  'Ny', 'Trenger mer info', 'Klar for konsultasjon', 'Tilbud sendt',
  'Venter på depositum', 'Booket', 'Fullført', 'Avslått',
]

const ghostInput: React.CSSProperties = {
  width: '100%', background: 'rgba(237,233,230,0.03)', border: '1px solid rgba(237,233,230,0.14)',
  color: 'var(--paper)', padding: '10px 14px', fontSize: '0.9rem', minHeight: '44px', outline: 'none',
}

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  inquiryId: string | Id<"inquiries">
  currentStatus: string
}

export function StatusChangeSheet({ open, onOpenChange, inquiryId, currentStatus }: Props) {
  const [selectedStatus, setSelectedStatus] = useState(currentStatus)
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)
  const updateStatus = useMutation(api.inquiries.updateStatus)

  async function handleSave() {
    if (selectedStatus === currentStatus && !note) { onOpenChange(false); return }
    setSaving(true)
    try {
      await updateStatus({ id: inquiryId as Id<"inquiries">, status: selectedStatus, note: note || undefined })
      toast.success('Status oppdatert')
      setNote('')
      onOpenChange(false)
    } catch { toast.error('Kunne ikke oppdatere status') }
    finally { setSaving(false) }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent style={{ background: 'var(--panel)' }} className='border-l border-rule-heavy w-full sm:max-w-md'>
        <SheetHeader>
          <SheetTitle className='font-serif italic text-paper'>Endre status</SheetTitle>
        </SheetHeader>
        <div className='mt-6 flex flex-col gap-5 px-4'>
          <div>
            <label className='block font-sans text-[10px] tracking-[0.14em] uppercase text-nav mb-2'>Ny status</label>
            <div className='relative'>
              <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} style={ghostInput} className='appearance-none cursor-pointer'>
                {ALL_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <svg className='absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none' width='12' height='8' viewBox='0 0 12 8' fill='none'>
                <path d='M1 1l5 5 5-5' stroke='var(--nav)' strokeWidth='1.5' strokeLinecap='square'/>
              </svg>
            </div>
          </div>
          <div>
            <label className='block font-sans text-[10px] tracking-[0.14em] uppercase text-nav mb-2'>Notat (valgfritt)</label>
            <textarea value={note} onChange={(e) => setNote(e.target.value)} style={{ ...ghostInput, minHeight: '100px', resize: 'vertical' }} placeholder='Kommentar til statusendringen…' />
          </div>
          <Btn variant='action-primary' onClick={handleSave} disabled={saving}>{saving ? 'Lagrer…' : 'Lagre'}</Btn>
        </div>
      </SheetContent>
    </Sheet>
  )
}
