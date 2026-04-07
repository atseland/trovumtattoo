'use client'

import { useState } from 'react'
import { useQuery, useMutation, useConvexAuth } from 'convex/react'
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
  threadId: string | Id<"mailThreads">
}

export function LinkThreadSheet({ open, onOpenChange, threadId }: Props) {
  const { isAuthenticated } = useConvexAuth()
  const [search, setSearch] = useState('')
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null)
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const clients = useQuery(api.clients.list, isAuthenticated && search ? { searchQuery: search } : isAuthenticated ? { searchQuery: undefined } : 'skip')
  const projects = useQuery(api.projects.listByClient, isAuthenticated && selectedClientId ? { clientId: selectedClientId as Id<"clients"> } : 'skip')
  const linkThread = useMutation(api.mail.mutations.linkThread)

  async function handleSave() {
    if (!selectedClientId) { toast.error('Velg en kunde'); return }
    setSaving(true)
    try {
      await linkThread({ threadId: threadId as Id<"mailThreads">, linkedClientId: selectedClientId as Id<"clients">, linkedProjectId: selectedProjectId ? selectedProjectId as Id<"projects"> : undefined })
      toast.success('Tråd koblet')
      onOpenChange(false)
    } catch { toast.error('Kunne ikke koble tråd') }
    finally { setSaving(false) }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent style={{ background: 'var(--panel)' }} className='border-l border-rule-heavy w-full sm:max-w-md'>
        <SheetHeader>
          <SheetTitle className='font-serif italic text-paper'>Koble til kunde/prosjekt</SheetTitle>
        </SheetHeader>
        <div className='mt-6 flex flex-col gap-4 px-4'>
          <div>
            <label className='block font-sans text-[10px] tracking-[0.14em] uppercase text-nav mb-2'>Søk på kunde</label>
            <input value={search} onChange={(e) => { setSearch(e.target.value); setSelectedClientId(null); setSelectedProjectId(null) }} style={ghostInput} placeholder='Navn…' />
          </div>

          {clients && clients.length > 0 && (
            <div>
              <label className='block font-sans text-[10px] tracking-[0.14em] uppercase text-nav mb-2'>Velg kunde</label>
              <div className='flex flex-col gap-2 max-h-[200px] overflow-y-auto'>
                {clients.map((c) => (
                  <button key={c._id} onClick={() => { setSelectedClientId(c._id); setSelectedProjectId(null) }}
                    className='px-4 py-[10px] border text-left cursor-pointer font-sans text-[13px] transition-colors duration-[200ms]'
                    style={{
                      background: selectedClientId === c._id ? 'rgba(160,148,136,0.1)' : 'rgba(237,233,230,0.02)',
                      borderColor: selectedClientId === c._id ? 'var(--accent)' : 'var(--rule)',
                      color: 'var(--paper)',
                    }}
                  >
                    {c.name} <span className='text-mast-left'>— {c.email}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {selectedClientId && projects && projects.length > 0 && (
            <div>
              <label className='block font-sans text-[10px] tracking-[0.14em] uppercase text-nav mb-2'>Velg prosjekt (valgfritt)</label>
              <div className='flex flex-col gap-2'>
                {projects.map((p) => (
                  <button key={p._id} onClick={() => setSelectedProjectId(p._id === selectedProjectId ? null : p._id)}
                    className='px-4 py-[10px] border text-left cursor-pointer font-sans text-[13px] transition-colors duration-[200ms]'
                    style={{
                      background: selectedProjectId === p._id ? 'rgba(160,148,136,0.1)' : 'rgba(237,233,230,0.02)',
                      borderColor: selectedProjectId === p._id ? 'var(--accent)' : 'var(--rule)',
                      color: 'var(--paper)',
                    }}
                  >
                    {p.status} — {new Date(p.createdAt).toLocaleDateString('nb-NO')}
                  </button>
                ))}
              </div>
            </div>
          )}

          <Btn variant='action-primary' onClick={handleSave} disabled={saving || !selectedClientId}>
            {saving ? 'Lagrer…' : 'Koble tråd'}
          </Btn>
        </div>
      </SheetContent>
    </Sheet>
  )
}
