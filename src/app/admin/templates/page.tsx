'use client'

import { useState } from 'react'
import { useQuery, useMutation, useConvexAuth } from 'convex/react'
import { toast } from 'sonner'
// TODO: fjern cast etter npx convex dev
import { api } from '../../../../convex/_generated/api'

const TEMPLATE_TYPES: { value: string; label: string }[] = [
  { value: 'received', label: 'Mottatt forespørsel' },
  { value: 'needs-info', label: 'Trenger mer info' },
  { value: 'estimate', label: 'Prisestimat' },
  { value: 'timeslot', label: 'Forslag til tidspunkt' },
  { value: 'deposit', label: 'Betal depositum' },
  { value: 'confirmation', label: 'Bookingbekreftelse' },
  { value: 'reminder', label: 'Påminnelse' },
  { value: 'aftercare', label: 'Etterbehandling' },
  { value: 'thank-you', label: 'Takk etter ferdig prosjekt' },
  { value: 'review-request', label: 'Be om anmeldelse' },
]

const typeLabel = (type: string) => TEMPLATE_TYPES.find((t) => t.value === type)?.label ?? type

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

interface EditForm {
  id: string | null
  type: string
  title: string
  content: string
}

const emptyForm: EditForm = { id: null, type: 'received', title: '', content: '' }

export default function TemplatesPage() {
  const { isAuthenticated } = useConvexAuth()
  const [form, setForm] = useState<EditForm>(emptyForm)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  const templates = useQuery((api as any).templates.list, isAuthenticated ? {} : 'skip')
  const createTemplate = useMutation((api as any).templates.create)
  const updateTemplate = useMutation((api as any).templates.update)
  const removeTemplate = useMutation((api as any).templates.remove)

  async function handleSave() {
    if (!form.title || !form.content) { toast.error('Tittel og innhold er påkrevd'); return }
    setSaving(true)
    try {
      if (form.id) {
        await updateTemplate({ id: form.id, title: form.title, content: form.content })
      } else {
        await createTemplate({ type: form.type, title: form.title, content: form.content })
      }
      toast.success(form.id ? 'Mal oppdatert' : 'Mal opprettet')
      setForm(emptyForm)
      setShowForm(false)
    } catch { toast.error('Kunne ikke lagre mal') }
    finally { setSaving(false) }
  }

  async function handleDelete(id: string) {
    setDeleting(id)
    try {
      await removeTemplate({ id })
      toast.success('Mal slettet')
    } catch { toast.error('Kunne ikke slette mal') }
    finally { setDeleting(null) }
  }

  return (
    <div className='mx-auto max-w-2xl'>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h1 className='text-xl font-medium' style={{ color: '#c9b99a' }}>Meldingsmaler</h1>
        <button
          onClick={() => { setForm(emptyForm); setShowForm(true) }}
          style={{ padding: '8px 16px', background: '#c9933a', color: '#0d0c0b', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.875rem', minHeight: '40px' }}
        >
          Ny mal
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div style={{ background: '#141210', border: '1px solid #2a2724', borderRadius: '8px', padding: '20px', marginBottom: '24px' }}>
          <h2 style={{ color: '#c9b99a', fontSize: '1rem', marginBottom: '16px' }}>{form.id ? 'Rediger mal' : 'Ny mal'}</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {!form.id && (
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#7a6e62', marginBottom: '6px' }}>Type</label>
                <select value={form.type} onChange={(e) => setForm(f => ({ ...f, type: e.target.value }))} style={inputStyle}>
                  {TEMPLATE_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
            )}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#7a6e62', marginBottom: '6px' }}>Tittel</label>
              <input value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))} style={inputStyle} placeholder='Mal-tittel' />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#7a6e62', marginBottom: '6px' }}>Innhold</label>
              <textarea value={form.content} onChange={(e) => setForm(f => ({ ...f, content: e.target.value }))} style={{ ...inputStyle, minHeight: '120px', resize: 'vertical' }} placeholder='Meldingsinnhold…' />
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={handleSave} disabled={saving} style={{ padding: '10px 20px', background: saving ? '#5a4a2a' : '#c9933a', color: '#0d0c0b', border: 'none', borderRadius: '4px', cursor: saving ? 'not-allowed' : 'pointer', fontSize: '0.875rem', minHeight: '44px' }}>
                {saving ? 'Lagrer…' : 'Lagre'}
              </button>
              <button onClick={() => setShowForm(false)} style={{ padding: '10px 20px', background: 'transparent', color: '#7a6e62', border: '1px solid #2a2724', borderRadius: '4px', cursor: 'pointer', fontSize: '0.875rem', minHeight: '44px' }}>
                Avbryt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Template list */}
      {templates === undefined ? (
        <p style={{ color: '#7a6e62' }}>Laster…</p>
      ) : templates.length === 0 ? (
        <p style={{ color: '#7a6e62', fontSize: '0.875rem' }}>Ingen maler ennå. Klikk "Ny mal" for å opprette.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {(templates as any[]).map((tpl) => (
            <div key={tpl._id} style={{ background: '#141210', border: '1px solid #2a2724', borderRadius: '6px', padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ fontSize: '0.7rem', color: '#c9933a', background: '#2a1e0d', padding: '2px 8px', borderRadius: '999px' }}>{typeLabel(tpl.type)}</span>
                  <p style={{ color: '#c9b99a', fontWeight: '500', fontSize: '0.9rem', marginTop: '6px' }}>{tpl.title}</p>
                  <p style={{ color: '#7a6e62', fontSize: '0.8rem', marginTop: '4px', whiteSpace: 'pre-wrap', maxHeight: '60px', overflow: 'hidden' }}>{tpl.content}</p>
                </div>
                <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                  <button onClick={() => { setForm({ id: tpl._id, type: tpl.type, title: tpl.title, content: tpl.content }); setShowForm(true) }} style={{ padding: '6px 10px', background: 'transparent', color: '#c9b99a', border: '1px solid #2a2724', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', minHeight: '36px' }}>
                    Rediger
                  </button>
                  <button onClick={() => handleDelete(tpl._id)} disabled={deleting === tpl._id} style={{ padding: '6px 10px', background: 'transparent', color: '#c96b6b', border: '1px solid #3a2020', borderRadius: '4px', cursor: deleting === tpl._id ? 'not-allowed' : 'pointer', fontSize: '0.8rem', minHeight: '36px' }}>
                    Slett
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
