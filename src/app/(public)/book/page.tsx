'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { inquirySchema, type InquiryFormValues } from '@/lib/validators/inquiry'

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: '#1c1916',
  border: '1px solid #2a2724',
  borderRadius: '4px',
  color: '#c9b99a',
  padding: '12px 14px',
  fontSize: '1rem',
  minHeight: '48px',
  outline: 'none',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  marginBottom: '6px',
  fontSize: '0.875rem',
  color: '#7a6e62',
}

const errorStyle: React.CSSProperties = {
  color: '#c9933a',
  fontSize: '0.75rem',
  marginTop: '4px',
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <label style={labelStyle}>{label}</label>
      {children}
      {error && <p style={errorStyle}>{error}</p>}
    </div>
  )
}

export default function BookPage() {
  const [fileNames, setFileNames] = useState<string[]>([])

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<InquiryFormValues>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      firstTattoo: false,
      coverUp: false,
      touchUp: false,
    },
  })

  async function onSubmit(_data: InquiryFormValues) {
    // Convex-kobling implementeres i TASK-013
    await new Promise((r) => setTimeout(r, 500))
    reset()
    setFileNames([])
  }

  return (
    <div className='mx-auto max-w-xl px-5 py-12'>
      <h1 className='font-serif italic text-3xl' style={{ color: '#c9b99a', marginBottom: '8px' }}>
        Send bookingforespørsel
      </h1>
      <p style={{ color: '#7a6e62', fontSize: '0.875rem', marginBottom: '40px' }}>
        Fyll ut skjemaet så tar vi kontakt innen 2 virkedager.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Field label='Fullt navn *' error={errors.name?.message}>
          <input {...register('name')} style={inputStyle} placeholder='Ola Nordmann' />
        </Field>

        <Field label='E-post *' error={errors.email?.message}>
          <input {...register('email')} type='email' style={inputStyle} placeholder='ola@example.com' />
        </Field>

        <Field label='Telefonnummer *' error={errors.phone?.message}>
          <input {...register('phone')} type='tel' style={inputStyle} placeholder='+47 000 00 000' />
        </Field>

        <Field label='Instagram-handle' error={errors.instagramHandle?.message}>
          <input {...register('instagramHandle')} style={inputStyle} placeholder='@bruker' />
        </Field>

        <Field label='Beskriv tattoo-ideen din *' error={errors.description?.message}>
          <textarea
            {...register('description')}
            style={{ ...inputStyle, minHeight: '120px', resize: 'vertical' }}
            placeholder='Fortell om motivet, stemningen, detaljer…'
          />
        </Field>

        <Field label='Plassering på kroppen *' error={errors.bodyPlacement?.message}>
          <input {...register('bodyPlacement')} style={inputStyle} placeholder='F.eks. underarm, skulder, legg' />
        </Field>

        <Field label='Størrelse *' error={errors.size?.message}>
          <select {...register('size')} style={inputStyle}>
            <option value=''>Velg størrelse</option>
            <option>Liten</option>
            <option>Middels</option>
            <option>Stor</option>
            <option>Veldig stor</option>
          </select>
        </Field>

        <Field label='Ønsket stil *' error={errors.style?.message}>
          <input {...register('style')} style={inputStyle} placeholder='F.eks. fine-line, blackwork, realistisk' />
        </Field>

        <Field label='Budsjett' error={errors.budget?.message}>
          <input {...register('budget')} style={inputStyle} placeholder='F.eks. 2 000–5 000 kr' />
        </Field>

        <Field label='Ønsket tidsrom' error={errors.desiredTiming?.message}>
          <input {...register('desiredTiming')} style={inputStyle} placeholder='F.eks. sommer 2025, fleksibel' />
        </Field>

        {/* Checkboxes */}
        <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {(
            [
              { name: 'firstTattoo', label: 'Dette er min første tatovering' },
              { name: 'coverUp', label: 'Dette er en cover-up' },
              { name: 'touchUp', label: 'Dette er en touch-up' },
            ] as const
          ).map(({ name, label }) => (
            <label key={name} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', minHeight: '48px', color: '#c9b99a', fontSize: '0.9rem' }}>
              <input
                {...register(name)}
                type='checkbox'
                style={{ width: '20px', height: '20px', accentColor: '#c9933a', flexShrink: 0 }}
              />
              {label}
            </label>
          ))}
        </div>

        <Field label='Ekstra kommentarer' error={errors.extraNotes?.message}>
          <textarea
            {...register('extraNotes')}
            style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
            placeholder='Noe annet vi bør vite?'
          />
        </Field>

        <Field label='Referansebilder (maks 10)' error={errors.referenceImages?.message}>
          <input
            {...register('referenceImages', {
              onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                const files = Array.from(e.target.files ?? [])
                setFileNames(files.map((f) => f.name))
              },
            })}
            type='file'
            accept='image/jpeg,image/png,image/webp'
            multiple
            style={{ ...inputStyle, cursor: 'pointer' }}
          />
          {fileNames.length > 0 && (
            <ul style={{ marginTop: '8px', fontSize: '0.75rem', color: '#7a6e62' }}>
              {fileNames.map((n) => <li key={n}>— {n}</li>)}
            </ul>
          )}
        </Field>

        <button
          type='submit'
          disabled={isSubmitting}
          style={{
            width: '100%',
            background: isSubmitting ? '#5a4a2a' : '#c9933a',
            color: '#0d0c0b',
            border: 'none',
            borderRadius: '4px',
            padding: '14px',
            fontSize: '1rem',
            fontWeight: '500',
            minHeight: '52px',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            transition: 'opacity 0.2s',
          }}
        >
          {isSubmitting ? 'Sender…' : 'Send forespørsel'}
        </button>
      </form>
    </div>
  )
}
