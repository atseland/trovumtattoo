'use client'

import { useState } from 'react'
import { useMutation } from 'convex/react'
import { toast } from 'sonner'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { api } from '@convex/_generated/api'
import { Id } from '@convex/_generated/dataModel'
import { Btn } from '@/components/ui/Btn'
import { SelectField, TextareaField } from '@/components/ui/FormField'

const ALL_STATUSES = [
  'Ny', 'Trenger mer info', 'Klar for konsultasjon', 'Tilbud sendt',
  'Venter på depositum', 'Booket', 'Fullført', 'Avslått',
]

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
          <SelectField
            label='Ny status'
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            {ALL_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
          </SelectField>
          <TextareaField
            label='Notat (valgfritt)'
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className='min-h-[100px]'
            placeholder='Kommentar til statusendringen…'
          />
          <Btn variant='action-primary' onClick={handleSave} disabled={saving}>{saving ? 'Lagrer…' : 'Lagre'}</Btn>
        </div>
      </SheetContent>
    </Sheet>
  )
}
