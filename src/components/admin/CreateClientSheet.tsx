'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation } from 'convex/react'
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
  inquiryId: string | Id<"inquiries">
  defaultName?: string
  defaultEmail?: string
  defaultPhone?: string
  defaultInstagram?: string
}

export function CreateClientSheet({ open, onOpenChange, inquiryId, defaultName = '', defaultEmail = '', defaultPhone = '', defaultInstagram = '' }: Props) {
  const router = useRouter()
  const [name, setName] = useState(defaultName)
  const [email, setEmail] = useState(defaultEmail)
  const [phone, setPhone] = useState(defaultPhone)
  const [instagram, setInstagram] = useState(defaultInstagram)
  const [saving, setSaving] = useState(false)

  const createClient = useMutation(api.clients.create)
  const createProject = useMutation(api.projects.create)

  async function handleCreate() {
    if (!name || !email) { toast.error('Navn og e-post er påkrevd'); return }
    setSaving(true)
    try {
      const clientId = await createClient({ name, email, phone: phone || undefined, instagramHandle: instagram || undefined })
      await createProject({ clientId, inquiryId: inquiryId as Id<"inquiries"> })
      toast.success('Klient og prosjekt opprettet')
      onOpenChange(false)
      router.push(`/admin/clients/${clientId}`)
    } catch { toast.error('Kunne ikke opprette klient') }
    finally { setSaving(false) }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent style={{ background: 'var(--panel)' }} className='border-l border-rule-heavy w-full sm:max-w-md'>
        <SheetHeader>
          <SheetTitle className='font-serif italic text-paper'>Opprett klient</SheetTitle>
        </SheetHeader>
        <div className='mt-6 flex flex-col gap-4 px-4'>
          {[
            { label: 'Navn *', value: name, set: setName, placeholder: 'Fullt navn' },
            { label: 'E-post *', value: email, set: setEmail, placeholder: 'e-post@example.com' },
            { label: 'Telefon', value: phone, set: setPhone, placeholder: '+47 000 00 000' },
            { label: 'Instagram', value: instagram, set: setInstagram, placeholder: '@bruker' },
          ].map(({ label, value, set, placeholder }) => (
            <div key={label}>
              <label className='block font-sans text-[10px] tracking-[0.14em] uppercase text-nav mb-2'>{label}</label>
              <input value={value} onChange={(e) => set(e.target.value)} placeholder={placeholder} style={ghostInput} />
            </div>
          ))}
          <Btn variant='action-primary' onClick={handleCreate} disabled={saving} className='mt-2'>
            {saving ? 'Oppretter…' : 'Opprett klient og prosjekt'}
          </Btn>
        </div>
      </SheetContent>
    </Sheet>
  )
}
