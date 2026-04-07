'use client'

import { useState } from 'react'
import { useQuery, useMutation, useConvexAuth } from 'convex/react'
import { toast } from 'sonner'
import { api } from '../../../../convex/_generated/api'
import { Id } from '../../../../convex/_generated/dataModel'
import { Skeleton } from '@/components/ui/Skeleton'
import { Btn } from '@/components/ui/Btn'

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

const ghostInput: React.CSSProperties = {
  background: 'rgba(237,233,230,0.03)',
  border: '1px solid rgba(237,233,230,0.14)',
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

  const templates = useQuery(api.templates.list, isAuthenticated ? {} : 'skip')
  const createTemplate = useMutation(api.templates.create)
  const updateTemplate = useMutation(api.templates.update)
  const removeTemplate = useMutation(api.templates.remove)

  async function handleSave() {
    if (!form.title || !form.content) { toast.error('Tittel og innhold er påkrevd'); return }
    setSaving(true)
    try {
      if (form.id) {
        await updateTemplate({ id: form.id as Id<"messageTemplates">, title: form.title, content: form.content })
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
      await removeTemplate({ id: id as Id<"messageTemplates"> })
      toast.success('Mal slettet')
    } catch { toast.error('Kunne ikke slette mal') }
    finally { setDeleting(null) }
  }

  return (
    <div className='max-w-2xl'>
      <div className='flex items-center justify-between mb-6'>
        <h1 className='font-sans font-medium text-[18px] text-paper'>Meldingsmaler</h1>
        <Btn variant='sm' onClick={() => { setForm(emptyForm); setShowForm(true) }}>Ny mal</Btn>
      </div>

      {/* Form */}
      {showForm && (
        <div className='bg-panel border border-rule px-5 py-5 mb-6'>
          <h2 className='font-sans text-[10px] tracking-[0.14em] uppercase text-nav mb-4'>
            {form.id ? 'Rediger mal' : 'Ny mal'}
          </h2>
          <div className='flex flex-col gap-4'>
            {!form.id && (
              <div>
                <label className='block font-sans text-[10px] tracking-[0.14em] uppercase text-nav mb-2'>Type</label>
                <div className='relative'>
                  <select
                    value={form.type}
                    onChange={(e) => setForm(f => ({ ...f, type: e.target.value }))}
                    className='w-full font-sans text-[14px] text-paper px-4 min-h-[44px] outline-none appearance-none transition-colors duration-[200ms] cursor-pointer'
                    style={ghostInput}
                  >
                    {TEMPLATE_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                  <svg className='absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none' width='12' height='8' viewBox='0 0 12 8' fill='none'>
                    <path d='M1 1l5 5 5-5' stroke='var(--nav)' strokeWidth='1.5' strokeLinecap='square'/>
                  </svg>
                </div>
              </div>
            )}
            <div>
              <label className='block font-sans text-[10px] tracking-[0.14em] uppercase text-nav mb-2'>Tittel</label>
              <input
                value={form.title}
                onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder='Mal-tittel'
                className='w-full font-sans text-[14px] text-paper placeholder:text-mast-left px-4 min-h-[44px] outline-none transition-colors duration-[200ms]'
                style={ghostInput}
                onFocus={e => {
                  e.currentTarget.style.border = '1px solid rgba(237,233,230,0.35)'
                  e.currentTarget.style.background = 'rgba(237,233,230,0.05)'
                }}
                onBlur={e => {
                  e.currentTarget.style.border = '1px solid rgba(237,233,230,0.14)'
                  e.currentTarget.style.background = 'rgba(237,233,230,0.03)'
                }}
              />
            </div>
            <div>
              <label className='block font-sans text-[10px] tracking-[0.14em] uppercase text-nav mb-2'>Innhold</label>
              <textarea
                value={form.content}
                onChange={(e) => setForm(f => ({ ...f, content: e.target.value }))}
                placeholder='Meldingsinnhold…'
                rows={5}
                className='w-full font-sans text-[14px] text-paper placeholder:text-mast-left px-4 py-3 outline-none resize-vertical transition-colors duration-[200ms]'
                style={ghostInput}
                onFocus={e => {
                  e.currentTarget.style.border = '1px solid rgba(237,233,230,0.35)'
                  e.currentTarget.style.background = 'rgba(237,233,230,0.05)'
                }}
                onBlur={e => {
                  e.currentTarget.style.border = '1px solid rgba(237,233,230,0.14)'
                  e.currentTarget.style.background = 'rgba(237,233,230,0.03)'
                }}
              />
            </div>
            <div className='flex gap-2'>
              <Btn variant='sm' onClick={handleSave} disabled={saving}>{saving ? 'Lagrer…' : 'Lagre'}</Btn>
              <Btn variant='sm' onClick={() => setShowForm(false)}>Avbryt</Btn>
            </div>
          </div>
        </div>
      )}

      {/* Template list */}
      {templates === undefined ? (
        <div className='flex flex-col gap-3'>
          {[1, 2, 3].map(i => <Skeleton key={i} className='h-[80px]' />)}
        </div>
      ) : templates.length === 0 ? (
        <p className='font-sans text-[13px] text-mast-left'>Ingen maler ennå. Klikk «Ny mal» for å opprette.</p>
      ) : (
        <div className='flex flex-col gap-3'>
          {templates.map((tpl) => (
            <div key={tpl._id} className='bg-panel border border-rule px-5 py-4'>
              <div className='flex items-start justify-between gap-3'>
                <div className='flex-1 min-w-0'>
                  <span
                    className='font-sans text-[9px] tracking-[0.1em] uppercase px-[8px] py-[3px] mb-2 inline-block'
                    style={{ background: 'rgba(160,148,136,0.12)', color: 'var(--accent)', borderRadius: '2px' }}
                  >
                    {typeLabel(tpl.type)}
                  </span>
                  <p className='font-sans font-medium text-[14px] text-paper mt-1'>{tpl.title}</p>
                  <p className='font-sans text-[12px] text-mast-left mt-1 whitespace-pre-wrap line-clamp-2'>{tpl.content}</p>
                </div>
                <div className='flex gap-2 shrink-0'>
                  <Btn variant='sm' onClick={() => { setForm({ id: tpl._id, type: tpl.type, title: tpl.title, content: tpl.content }); setShowForm(true) }}>
                    Rediger
                  </Btn>
                  <button
                    onClick={() => handleDelete(tpl._id)}
                    disabled={deleting === tpl._id}
                    className='font-sans text-[8.5px] tracking-[0.12em] uppercase min-h-[44px] px-3 transition-colors duration-[200ms] border cursor-pointer disabled:cursor-not-allowed disabled:opacity-50'
                    style={{ borderColor: 'rgba(175,140,135,0.3)', color: '#af8c87', background: 'transparent' }}
                  >
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
