'use client'

import { Btn } from '@/components/ui/Btn'
import { InputField, SelectField, TextareaField } from '@/components/ui/FormField'
import { Skeleton } from '@/components/ui/Skeleton'
import type { TemplateFormState } from '@/components/admin/templates/useTemplateEditor'

export const TEMPLATE_TYPES: Array<{ value: string; label: string }> = [
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

function typeLabel(type: string) {
  return TEMPLATE_TYPES.find((item) => item.value === type)?.label ?? type
}

interface TemplateEditorPanelProps {
  form: TemplateFormState
  saving: boolean
  onFormChange: (update: (current: TemplateFormState) => TemplateFormState) => void
  onSave: () => void
  onCancel: () => void
}

export function TemplateEditorPanel({
  form,
  saving,
  onFormChange,
  onSave,
  onCancel,
}: TemplateEditorPanelProps) {
  return (
    <div className='bg-panel border border-rule px-5 py-5 mb-6'>
      <h2 className='font-sans text-[10px] tracking-[0.14em] uppercase text-nav mb-4'>
        {form.id ? 'Rediger mal' : 'Ny mal'}
      </h2>
      <div className='flex flex-col gap-4'>
        {!form.id && (
          <SelectField
            label='Type'
            value={form.type}
            onChange={(e) => onFormChange((current) => ({ ...current, type: e.target.value }))}
          >
            {TEMPLATE_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </SelectField>
        )}

        <InputField
          label='Tittel'
          value={form.title}
          onChange={(e) => onFormChange((current) => ({ ...current, title: e.target.value }))}
          placeholder='Mal-tittel'
        />

        <TextareaField
          label='Innhold'
          value={form.content}
          onChange={(e) => onFormChange((current) => ({ ...current, content: e.target.value }))}
          placeholder='Meldingsinnhold…'
          rows={5}
          className='min-h-[140px]'
        />

        <div className='flex gap-2'>
          <Btn variant='sm' onClick={onSave} disabled={saving}>
            {saving ? 'Lagrer…' : 'Lagre'}
          </Btn>
          <Btn variant='sm' onClick={onCancel}>Avbryt</Btn>
        </div>
      </div>
    </div>
  )
}

interface TemplateListProps {
  templates:
    | Array<{ _id: string; type: string; title: string; content: string }>
    | undefined
  deleting: string | null
  onEdit: (template: { _id: string; type: string; title: string; content: string }) => void
  onDelete: (id: string) => void
}

export function TemplateList({
  templates,
  deleting,
  onEdit,
  onDelete,
}: TemplateListProps) {
  if (templates === undefined) {
    return (
      <div className='flex flex-col gap-3'>
        {[1, 2, 3].map((i) => <Skeleton key={i} className='h-[80px]' />)}
      </div>
    )
  }

  if (templates.length === 0) {
    return <p className='font-sans text-[13px] text-mast-left'>Ingen maler ennå. Klikk «Ny mal» for å opprette.</p>
  }

  return (
    <div className='flex flex-col gap-3'>
      {templates.map((template) => (
        <div key={template._id} className='bg-panel border border-rule px-5 py-4'>
          <div className='flex items-start justify-between gap-3'>
            <div className='flex-1 min-w-0'>
              <span
                className='font-sans text-[9px] tracking-[0.1em] uppercase px-[8px] py-[3px] mb-2 inline-block'
                style={{ background: 'rgba(160,148,136,0.12)', color: 'var(--accent)', borderRadius: '2px' }}
              >
                {typeLabel(template.type)}
              </span>
              <p className='font-sans font-medium text-[14px] text-paper mt-1'>{template.title}</p>
              <p className='font-sans text-[12px] text-mast-left mt-1 whitespace-pre-wrap line-clamp-2'>
                {template.content}
              </p>
            </div>
            <div className='flex gap-2 shrink-0'>
              <Btn variant='sm' onClick={() => onEdit(template)}>
                Rediger
              </Btn>
              <button
                onClick={() => onDelete(template._id)}
                disabled={deleting === template._id}
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
  )
}
