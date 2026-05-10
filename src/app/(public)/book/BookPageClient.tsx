'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import type { ChangeEvent } from 'react'
import { BookingContactSection } from '@/components/public/booking/BookingContactSection'
import { BookingFlagsSection } from '@/components/public/booking/BookingFlagsSection'
import { BookingNotesSection } from '@/components/public/booking/BookingNotesSection'
import { BookingReferenceImagesSection } from '@/components/public/booking/BookingReferenceImagesSection'
import { inquirySchema, type InquiryFormValues } from '@/lib/validators/inquiry'
import { BookingSuccessState } from '@/components/public/booking/BookingSuccessState'
import { BookingTattooDetailsSection } from '@/components/public/booking/BookingTattooDetailsSection'
import { useInquirySubmission } from '@/components/public/booking/useInquirySubmission'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { Btn } from '@/components/ui/Btn'

export default function BookPageClient() {
  const [fileNames, setFileNames] = useState<string[]>([])

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<InquiryFormValues>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      firstTattoo: false,
      coverUp: false,
      touchUp: false,
    },
  })

  const { submitInquiry, uploadProgress, submitted, resetSubmitted } = useInquirySubmission({
    onCompleted: () => {
      reset()
      setFileNames([])
    },
  })
  const referenceImagesField = register('referenceImages', {
    onChange: (event: ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files ?? [])
      setFileNames(files.map((file) => file.name))
    },
  })

  if (submitted) {
    return <BookingSuccessState onReset={resetSubmitted} />
  }

  return (
    <div className='mx-auto max-w-xl px-6 lg:px-12 py-12'>
      <Eyebrow withLine className='mb-4'>Booking</Eyebrow>
      <h1 className='font-serif italic text-[clamp(32px,5vw,48px)] text-paper leading-[1.1] tracking-[-0.02em] mb-2'>
        Send bookingforespørsel
      </h1>
      <p className='font-sans text-[14px] text-body mb-10 leading-[1.8]'>
        Fyll ut skjemaet, så tar jeg kontakt så fort jeg kan (innen 3 virkedager).
      </p>

      <form onSubmit={handleSubmit(submitInquiry)} noValidate className='flex flex-col gap-5'>
        <BookingContactSection register={register} errors={errors} />
        <BookingTattooDetailsSection register={register} errors={errors} />
        <BookingFlagsSection setValue={setValue} />
        <BookingNotesSection register={register} errors={errors} />
        <BookingReferenceImagesSection
          error={errors.referenceImages?.message}
          fileNames={fileNames}
          inputProps={referenceImagesField}
        />

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
