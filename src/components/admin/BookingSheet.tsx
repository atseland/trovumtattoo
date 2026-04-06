'use client'

import { useState } from 'react'
import { useMutation } from 'convex/react'
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
  existingBookingId?: string
  existingStartAt?: number
  existingEndAt?: number
  existingNotes?: string
  mode?: 'create' | 'edit' | 'rebook'
  onSuccess?: () => void
}

function toDatetimeLocal(ts: number) {
  const d = new Date(ts)
  return d.toISOString().slice(0, 16)
}

function fromDatetimeLocal(s: string): number {
  return new Date(s).getTime()
}

export function BookingSheet({
  open, onOpenChange, projectId,
  existingBookingId, existingStartAt, existingEndAt, existingNotes,
  mode = 'create', onSuccess,
}: Props) {
  const [startAt, setStartAt] = useState(existingStartAt ? toDatetimeLocal(existingStartAt) : '')
  const [endAt, setEndAt] = useState(existingEndAt ? toDatetimeLocal(existingEndAt) : '')
  const [notes, setNotes] = useState(existingNotes ?? '')
  const [saving, setSaving] = useState(false)
  const [confirmCancel, setConfirmCancel] = useState(false)

  const createBooking = useMutation((api as any).bookings.create)
  const updateBooking = useMutation((api as any).bookings.update)
  const cancelBooking = useMutation((api as any).bookings.cancel)

  async function handleSave() {
    if (!startAt || !endAt) { toast.error('Velg start- og sluttid'); return }
    const start = fromDatetimeLocal(startAt)
    const end = fromDatetimeLocal(endAt)
    if (start >= end) { toast.error('Starttid må være før sluttid'); return }

    setSaving(true)
    try {
      if (mode === 'create') {
        await createBooking({ projectId, startAt: start, endAt: end, notes: notes || undefined })
        toast.success('Booking opprettet')
      } else if (mode === 'edit' && existingBookingId) {
        await updateBooking({ id: existingBookingId, startAt: start, endAt: end, notes: notes || undefined })
        toast.success('Booking oppdatert')
      } else if (mode === 'rebook' && existingBookingId) {
        await updateBooking({ id: existingBookingId, status: 'rescheduled' })
        await createBooking({ projectId, startAt: start, endAt: end, notes: notes || undefined })
        toast.success('Booking ombooket')
      }
      onOpenChange(false)
      onSuccess?.()
    } catch (e) {
      toast.error(`Feil: ${(e as Error).message}`)
    } finally {
      setSaving(false)
    }
  }

  async function handleCancel() {
    if (!existingBookingId) return
    setSaving(true)
    try {
      await cancelBooking({ id: existingBookingId })
      toast.success('Booking avlyst')
      onOpenChange(false)
      onSuccess?.()
    } catch {
      toast.error('Kunne ikke avlyse')
    } finally {
      setSaving(false)
    }
  }

  const title = mode === 'create' ? 'Ny booking' : mode === 'edit' ? 'Rediger booking' : 'Ombooking'

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent style={{ background: '#141210', border: '1px solid #2a2724', color: '#c9b99a' }} className='w-full sm:max-w-md'>
        <SheetHeader>
          <SheetTitle style={{ color: '#c9b99a' }}>{title}</SheetTitle>
        </SheetHeader>

        <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: '#7a6e62', marginBottom: '6px' }}>Starttid</label>
            <input type='datetime-local' value={startAt} onChange={(e) => setStartAt(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: '#7a6e62', marginBottom: '6px' }}>Sluttid</label>
            <input type='datetime-local' value={endAt} onChange={(e) => setEndAt(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: '#7a6e62', marginBottom: '6px' }}>Notater</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} placeholder='Valgfrie notater…' />
          </div>

          <button onClick={handleSave} disabled={saving} style={{ background: saving ? '#5a4a2a' : '#c9933a', color: '#0d0c0b', border: 'none', borderRadius: '4px', padding: '12px', fontSize: '0.9rem', fontWeight: '500', cursor: saving ? 'not-allowed' : 'pointer', minHeight: '48px' }}>
            {saving ? 'Lagrer…' : title}
          </button>

          {existingBookingId && !confirmCancel && (
            <button onClick={() => setConfirmCancel(true)} style={{ background: 'transparent', color: '#c96b6b', border: '1px solid #3a2020', borderRadius: '4px', padding: '10px', fontSize: '0.875rem', cursor: 'pointer', minHeight: '44px' }}>
              Avlys booking
            </button>
          )}

          {confirmCancel && (
            <div style={{ background: '#2a1010', border: '1px solid #3a2020', borderRadius: '6px', padding: '14px' }}>
              <p style={{ color: '#c96b6b', fontSize: '0.875rem', marginBottom: '12px' }}>Er du sikker? Denne handlingen kan ikke angres.</p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={handleCancel} disabled={saving} style={{ flex: 1, background: '#3a1010', color: '#c96b6b', border: '1px solid #3a2020', borderRadius: '4px', padding: '10px', cursor: 'pointer', fontSize: '0.875rem', minHeight: '44px' }}>
                  Ja, avlys
                </button>
                <button onClick={() => setConfirmCancel(false)} style={{ flex: 1, background: 'transparent', color: '#7a6e62', border: '1px solid #2a2724', borderRadius: '4px', padding: '10px', cursor: 'pointer', fontSize: '0.875rem', minHeight: '44px' }}>
                  Nei, gå tilbake
                </button>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
