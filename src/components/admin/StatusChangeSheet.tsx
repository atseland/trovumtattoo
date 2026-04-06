'use client'

import { useState } from 'react'
import { useMutation } from 'convex/react'
import { toast } from 'sonner'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { api } from '../../../convex/_generated/api'
import { Id } from '../../../convex/_generated/dataModel'

const ALL_STATUSES = [
  'Ny',
  'Trenger mer info',
  'Klar for konsultasjon',
  'Tilbud sendt',
  'Venter på depositum',
  'Booket',
  'Fullført',
  'Avslått',
]

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
  inquiryId: string | Id<"inquiries">
  currentStatus: string
}

export function StatusChangeSheet({ open, onOpenChange, inquiryId, currentStatus }: Props) {
  const [selectedStatus, setSelectedStatus] = useState(currentStatus)
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)

    const updateStatus = useMutation(api.inquiries.updateStatus)

  async function handleSave() {
    if (selectedStatus === currentStatus && !note) {
      onOpenChange(false)
      return
    }
    setSaving(true)
    try {
      await updateStatus({ id: inquiryId as Id<"inquiries">, status: selectedStatus, note: note || undefined })
      toast.success('Status oppdatert')
      setNote('')
      onOpenChange(false)
    } catch (e) {
      toast.error('Kunne ikke oppdatere status')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        style={{ background: '#141210', border: '1px solid #2a2724', color: '#c9b99a' }}
        className='w-full sm:max-w-md'
      >
        <SheetHeader>
          <SheetTitle style={{ color: '#c9b99a' }}>Endre status</SheetTitle>
        </SheetHeader>

        <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: '#7a6e62', marginBottom: '6px' }}>
              Ny status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              style={inputStyle}
            >
              {ALL_STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: '#7a6e62', marginBottom: '6px' }}>
              Notat (valgfritt)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }}
              placeholder='Legg til en kommentar til statusendringen…'
            />
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              background: saving ? '#5a4a2a' : '#c9933a',
              color: '#0d0c0b',
              border: 'none',
              borderRadius: '4px',
              padding: '12px',
              fontSize: '0.9rem',
              fontWeight: '500',
              cursor: saving ? 'not-allowed' : 'pointer',
              minHeight: '48px',
            }}
          >
            {saving ? 'Lagrer…' : 'Lagre'}
          </button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
