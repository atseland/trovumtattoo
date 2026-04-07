'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { toast } from 'sonner'
import { useMutation } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import { Id } from '../../../../convex/_generated/dataModel'
import { inquirySchema, type InquiryFormValues } from '@/lib/validators/inquiry'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { Btn } from '@/components/ui/Btn'
import { InputField, TextareaField, SelectField } from '@/components/ui/FormField'

export default function BookPageClient() {
  const [fileNames, setFileNames] = useState<string[]>([])
  const [uploadProgress, setUploadProgress] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const createInquiry = useMutation(api.inquiries.create)
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl)
  const addReferenceImages = useMutation(api.inquiries.addReferenceImages)

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

  async function onSubmit(data: InquiryFormValues) {
    const files = data.referenceImages ? Array.from(data.referenceImages) : []

    // 1. Create the inquiry
    const inquiryId = await createInquiry({
      name: data.name,
      email: data.email,
      phone: data.phone,
      instagramHandle: data.instagramHandle || undefined,
      description: data.description,
      bodyPlacement: data.bodyPlacement,
      size: data.size,
      style: data.style,
      budget: data.budget || undefined,
      desiredTiming: data.desiredTiming || undefined,
      firstTattoo: data.firstTattoo,
      coverUp: data.coverUp,
      touchUp: data.touchUp,
      extraNotes: data.extraNotes || undefined,
    })

    // 2. Upload reference images
    if (files.length > 0) {
      const uploaded: Array<{ storageId: string; url: string }> = []

      for (let i = 0; i < files.length; i++) {
        setUploadProgress(`Laster opp bilde ${i + 1} av ${files.length}…`)
        try {
          const uploadUrl = await generateUploadUrl()
          const res = await fetch(uploadUrl, {
            method: 'PUT',
            headers: { 'Content-Type': files[i].type },
            body: files[i],
          })
          if (!res.ok) throw new Error(`HTTP ${res.status}`)
          const { storageId } = await res.json()
          uploaded.push({ storageId, url: uploadUrl.split('?')[0] })
        } catch {
          toast.error(`Feil ved opplasting av ${files[i].name} — fortsetter uten dette bildet`)
        }
      }

      if (uploaded.length > 0) {
        try {
          await addReferenceImages({ inquiryId, images: uploaded.map(img => ({ ...img, storageId: img.storageId as Id<'_storage'> })) })
        } catch {
          toast.error('Kunne ikke lagre referansebilder — forespørselen er likevel sendt')
        }
      }
    }

    setUploadProgress(null)
    reset()
    setFileNames([])
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className='mx-auto max-w-xl px-pad py-20 text-center'>
        <h2 className='font-serif italic text-[clamp(28px,5vw,40px)] text-paper leading-[1.1]'>
          Takk for forespørselen!
        </h2>
        <p className='font-sans text-[14px] text-body mt-3 leading-[1.8]'>
          Vi tar kontakt innen 2 virkedager med estimat og mulige tidspunkter.
        </p>
        <div className='mt-8 flex justify-center'>
          <Btn variant='sm' onClick={() => setSubmitted(false)}>
            Send ny forespørsel
          </Btn>
        </div>
      </div>
    )
  }

  return (
    <div className='mx-auto max-w-xl px-pad py-12'>
      <Eyebrow withLine className='mb-4'>Booking</Eyebrow>
      <h1 className='font-serif italic text-[clamp(32px,5vw,48px)] text-paper leading-[1.1] tracking-[-0.02em] mb-2'>
        Send bookingforespørsel
      </h1>
      <p className='font-sans text-[14px] text-body mb-10 leading-[1.8]'>
        Fyll ut skjemaet så tar vi kontakt innen 2 virkedager.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className='flex flex-col gap-5'>
        <InputField
          label='Fullt navn *'
          error={errors.name?.message}
          placeholder='Ola Nordmann'
          {...register('name')}
        />

        <InputField
          label='E-post *'
          type='email'
          error={errors.email?.message}
          placeholder='ola@example.com'
          {...register('email')}
        />

        <InputField
          label='Telefonnummer *'
          type='tel'
          error={errors.phone?.message}
          placeholder='+47 000 00 000'
          {...register('phone')}
        />

        <InputField
          label='Instagram-handle'
          optional
          error={errors.instagramHandle?.message}
          placeholder='@bruker'
          {...register('instagramHandle')}
        />

        <TextareaField
          label='Beskriv tattoo-ideen din *'
          error={errors.description?.message}
          placeholder='Fortell om motivet, stemningen, detaljer…'
          {...register('description')}
        />

        <InputField
          label='Plassering på kroppen *'
          error={errors.bodyPlacement?.message}
          placeholder='F.eks. underarm, skulder, legg'
          {...register('bodyPlacement')}
        />

        <SelectField
          label='Størrelse *'
          error={errors.size?.message}
          {...register('size')}
        >
          <option value=''>Velg størrelse</option>
          <option>Liten</option>
          <option>Middels</option>
          <option>Stor</option>
          <option>Veldig stor</option>
        </SelectField>

        <InputField
          label='Ønsket stil *'
          error={errors.style?.message}
          placeholder='F.eks. fine-line, blackwork, realistisk'
          {...register('style')}
        />

        <InputField
          label='Budsjett'
          optional
          error={errors.budget?.message}
          placeholder='F.eks. 2 000–5 000 kr'
          {...register('budget')}
        />

        <InputField
          label='Ønsket tidsrom'
          optional
          error={errors.desiredTiming?.message}
          placeholder='F.eks. sommer 2025, fleksibel'
          {...register('desiredTiming')}
        />

        {/* Checkboxes */}
        <div className='flex flex-col gap-3'>
          {(
            [
              { name: 'firstTattoo', label: 'Dette er min første tatovering' },
              { name: 'coverUp', label: 'Dette er en cover-up' },
              { name: 'touchUp', label: 'Dette er en touch-up' },
            ] as const
          ).map(({ name, label }) => (
            <label
              key={name}
              className='flex items-center gap-3 cursor-pointer font-sans text-[14px] text-body min-h-[44px]'
            >
              <input
                {...register(name)}
                type='checkbox'
                className='w-5 h-5 shrink-0 accent-accent'
              />
              {label}
            </label>
          ))}
        </div>

        <TextareaField
          label='Ekstra kommentarer'
          optional
          error={errors.extraNotes?.message}
          placeholder='Noe annet vi bør vite?'
          className='min-h-[80px]'
          {...register('extraNotes')}
        />

        {/* File upload */}
        <div>
          <label className='block font-sans text-[10px] tracking-[0.14em] uppercase text-nav mb-[6px]'>
            Referansebilder (maks 10)
            <span className='font-serif italic text-[12px] text-mast-left normal-case tracking-normal ml-[6px]'>valgfritt</span>
          </label>
          <div className='min-h-[80px] border border-dashed border-[rgba(237,233,230,0.18)] flex flex-col items-center justify-center p-5 transition-[border-color,background] duration-[200ms] hover:border-[rgba(237,233,230,0.30)] hover:bg-[rgba(237,233,230,0.03)]'>
            <label className='cursor-pointer font-sans text-[13px] text-mast-left hover:text-nav transition-colors duration-[200ms]'>
              Klikk for å velge filer
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
                className='sr-only'
              />
            </label>
            {fileNames.length > 0 && (
              <ul className='mt-2 font-sans text-[12px] text-mast-left text-center'>
                {fileNames.map((n) => <li key={n}>— {n}</li>)}
              </ul>
            )}
          </div>
          {errors.referenceImages?.message && (
            <p className='font-sans text-[12px] mt-1 text-[#af8c87]'>{errors.referenceImages.message}</p>
          )}
        </div>

        {uploadProgress && (
          <p className='font-sans text-[13px] text-body'>{uploadProgress}</p>
        )}

        <Btn
          type='submit'
          variant='action-cta'
          disabled={isSubmitting}
          className='mt-2'
        >
          {isSubmitting ? 'Sender…' : 'Send forespørsel'}
        </Btn>
      </form>
    </div>
  )
}
