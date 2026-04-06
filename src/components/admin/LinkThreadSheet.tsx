'use client'

import { useState } from 'react'
import { useQuery, useMutation, useConvexAuth } from 'convex/react'
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
  threadId: string
}

export function LinkThreadSheet({ open, onOpenChange, threadId }: Props) {
  const { isAuthenticated } = useConvexAuth()
  const [search, setSearch] = useState('')
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null)
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const clients = useQuery((api as any).clients.list, isAuthenticated && search ? { searchQuery: search } : isAuthenticated ? { searchQuery: undefined } : 'skip')
  const projects = useQuery((api as any).projects.listByClient, isAuthenticated && selectedClientId ? { clientId: selectedClientId } : 'skip')
  const linkThread = useMutation((api as any).mail.mutations.linkThread)

  async function handleSave() {
    if (!selectedClientId) { toast.error('Velg en kunde'); return }
    setSaving(true)
    try {
      await linkThread({
        threadId,
        linkedClientId: selectedClientId,
        linkedProjectId: selectedProjectId ?? undefined,
      })
      toast.success('Tråd koblet')
      onOpenChange(false)
    } catch {
      toast.error('Kunne ikke koble tråd')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent style={{ background: '#141210', border: '1px solid #2a2724', color: '#c9b99a' }} className='w-full sm:max-w-md'>
        <SheetHeader>
          <SheetTitle style={{ color: '#c9b99a' }}>Koble til kunde/prosjekt</SheetTitle>
        </SheetHeader>

        <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: '#7a6e62', marginBottom: '6px' }}>Søk på kunde</label>
            <input value={search} onChange={(e) => { setSearch(e.target.value); setSelectedClientId(null); setSelectedProjectId(null) }} style={inputStyle} placeholder='Navn…' />
          </div>

          {clients && (clients as any[]).length > 0 && (
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#7a6e62', marginBottom: '6px' }}>Velg kunde</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '200px', overflowY: 'auto' }}>
                {(clients as any[]).map((c) => (
                  <button
                    key={c._id}
                    onClick={() => { setSelectedClientId(c._id); setSelectedProjectId(null) }}
                    style={{
                      padding: '10px 14px',
                      background: selectedClientId === c._id ? '#2a1e0d' : '#1c1916',
                      border: '1px solid',
                      borderColor: selectedClientId === c._id ? '#c9933a' : '#2a2724',
                      borderRadius: '4px',
                      color: '#c9b99a',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                    }}
                  >
                    {c.name} <span style={{ color: '#7a6e62' }}>— {c.email}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {selectedClientId && projects && (projects as any[]).length > 0 && (
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#7a6e62', marginBottom: '6px' }}>Velg prosjekt (valgfritt)</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {(projects as any[]).map((p) => (
                  <button
                    key={p._id}
                    onClick={() => setSelectedProjectId(p._id === selectedProjectId ? null : p._id)}
                    style={{
                      padding: '10px 14px',
                      background: selectedProjectId === p._id ? '#0d2a0d' : '#1c1916',
                      border: '1px solid',
                      borderColor: selectedProjectId === p._id ? '#4ab97a' : '#2a2724',
                      borderRadius: '4px',
                      color: '#c9b99a',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                    }}
                  >
                    {p.status} — {new Date(p.createdAt).toLocaleDateString('nb-NO')}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={handleSave}
            disabled={saving || !selectedClientId}
            style={{
              background: saving || !selectedClientId ? '#5a4a2a' : '#c9933a',
              color: '#0d0c0b',
              border: 'none',
              borderRadius: '4px',
              padding: '12px',
              fontSize: '0.9rem',
              fontWeight: '500',
              cursor: saving || !selectedClientId ? 'not-allowed' : 'pointer',
              minHeight: '48px',
            }}
          >
            {saving ? 'Lagrer…' : 'Koble tråd'}
          </button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
