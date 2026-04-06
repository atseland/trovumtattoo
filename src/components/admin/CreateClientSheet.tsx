'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation } from 'convex/react'
import { toast } from 'sonner'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { api } from '../../../convex/_generated/api'
import { Id } from '../../../convex/_generated/dataModel'

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
    if (!name || !email) {
      toast.error('Navn og e-post er påkrevd')
      return
    }
    setSaving(true)
    try {
      const clientId = await createClient({
        name,
        email,
        phone: phone || undefined,
        instagramHandle: instagram || undefined,
      })
      const projectId = await createProject({
        clientId,
        inquiryId: inquiryId as Id<"inquiries">,
      })
      toast.success('Klient og prosjekt opprettet')
      onOpenChange(false)
      router.push(`/admin/clients/${clientId}`)
    } catch {
      toast.error('Kunne ikke opprette klient')
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
          <SheetTitle style={{ color: '#c9b99a' }}>Opprett klient</SheetTitle>
        </SheetHeader>

        <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[
            { label: 'Navn *', value: name, set: setName, placeholder: 'Fullt navn' },
            { label: 'E-post *', value: email, set: setEmail, placeholder: 'e-post@example.com' },
            { label: 'Telefon', value: phone, set: setPhone, placeholder: '+47 000 00 000' },
            { label: 'Instagram', value: instagram, set: setInstagram, placeholder: '@bruker' },
          ].map(({ label, value, set, placeholder }) => (
            <div key={label}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#7a6e62', marginBottom: '6px' }}>{label}</label>
              <input
                value={value}
                onChange={(e) => set(e.target.value)}
                placeholder={placeholder}
                style={inputStyle}
              />
            </div>
          ))}

          <button
            onClick={handleCreate}
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
              marginTop: '8px',
            }}
          >
            {saving ? 'Oppretter…' : 'Opprett klient og prosjekt'}
          </button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
