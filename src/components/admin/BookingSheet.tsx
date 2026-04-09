'use client'

import { useState } from 'react'
import { useMutation } from 'convex/react'
import { toast } from 'sonner'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { api } from '@convex/_generated/api'
import { Id } from '@convex/_generated/dataModel'
import { Btn } from '@/components/ui/Btn'
import { InputField, TextareaField } from '@/components/ui/FormField'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectId: string | Id<"projects">
  existingBookingId?: string
  existingStartAt?: number
  existingEndAt?: number
  existingNotes?: string
  mode?: 'create' | 'edit' | 'rebook'
  onSuccess?: () => void
}

function toDatetimeLocal(ts: number) {
  return new Date(ts).toISOString().slice(0, 16)
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

  const createBooking = useMutation(api.bookings.create)
  const updateBooking = useMutation(api.bookings.update)
  const cancelBooking = useMutation(api.bookings.cancel)

  async function handleSave() {
    if (!startAt || !endAt) { toast.error('Velg start- og sluttid'); return }
    const start = fromDatetimeLocal(startAt)
    const end = fromDatetimeLocal(endAt)
    if (start >= end) { toast.error('Starttid må være før sluttid'); return }
    setSaving(true)
    try {
      if (mode === 'create') {
        await createBooking({ projectId: projectId as Id<"projects">, startAt: start, endAt: end, notes: notes || undefined })
        toast.success('Booking opprettet')
      } else if (mode === 'edit' && existingBookingId) {
        await updateBooking({ id: existingBookingId as Id<"bookings">, startAt: start, endAt: end, notes: notes || undefined })
        toast.success('Booking oppdatert')
      } else if (mode === 'rebook' && existingBookingId) {
        await updateBooking({ id: existingBookingId as Id<"bookings">, status: 'rescheduled' })
        await createBooking({ projectId: projectId as Id<"projects">, startAt: start, endAt: end, notes: notes || undefined })
        toast.success('Booking ombooket')
      }
      onOpenChange(false)
      onSuccess?.()
    } catch (e) { toast.error(`Feil: ${(e as Error).message}`) }
    finally { setSaving(false) }
  }

  async function handleCancel() {
    if (!existingBookingId) return
    setSaving(true)
    try {
      await cancelBooking({ id: existingBookingId as Id<"bookings"> })
      toast.success('Booking avlyst')
      onOpenChange(false)
      onSuccess?.()
    } catch { toast.error('Kunne ikke avlyse') }
    finally { setSaving(false) }
  }

  const title = mode === 'create' ? 'Ny booking' : mode === 'edit' ? 'Rediger booking' : 'Ombooking'

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent style={{ background: 'var(--panel)' }} className='border-l border-rule-heavy w-full sm:max-w-md'>
        <SheetHeader>
          <SheetTitle className='font-serif italic text-paper'>{title}</SheetTitle>
        </SheetHeader>
        <div className='mt-6 flex flex-col gap-4 px-4'>
          <InputField
            label='Starttid'
            type='datetime-local'
            value={startAt}
            onChange={(e) => setStartAt(e.target.value)}
          />
          <InputField
            label='Sluttid'
            type='datetime-local'
            value={endAt}
            onChange={(e) => setEndAt(e.target.value)}
          />
          <TextareaField
            label='Notater'
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className='min-h-[80px]'
            placeholder='Valgfrie notater…'
          />
          <Btn variant='action-primary' onClick={handleSave} disabled={saving}>{saving ? 'Lagrer…' : title}</Btn>

          {existingBookingId && !confirmCancel && (
            <button onClick={() => setConfirmCancel(true)} className='font-sans text-[8.5px] tracking-[0.12em] uppercase min-h-[44px] px-4 border cursor-pointer transition-colors duration-[200ms]' style={{ background: 'transparent', borderColor: 'rgba(175,140,135,0.3)', color: '#af8c87' }}>
              Avlys booking
            </button>
          )}

          {confirmCancel && (
            <div className='px-4 py-4 border' style={{ background: 'rgba(175,140,135,0.06)', borderColor: 'rgba(175,140,135,0.2)' }}>
              <p className='font-sans text-[13px] mb-3' style={{ color: '#af8c87' }}>Er du sikker? Denne handlingen kan ikke angres.</p>
              <div className='flex gap-2'>
                <button onClick={handleCancel} disabled={saving} className='flex-1 font-sans text-[8.5px] tracking-[0.12em] uppercase min-h-[44px] cursor-pointer border transition-colors duration-[200ms]' style={{ background: 'transparent', borderColor: 'rgba(175,140,135,0.3)', color: '#af8c87' }}>Ja, avlys</button>
                <button onClick={() => setConfirmCancel(false)} className='flex-1 font-sans text-[8.5px] tracking-[0.12em] uppercase min-h-[44px] border border-rule text-nav cursor-pointer hover:text-paper transition-colors duration-[200ms]' style={{ background: 'transparent' }}>Nei, gå tilbake</button>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
