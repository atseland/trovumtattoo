'use client'

import { useState } from 'react'
import { useAction, useMutation } from 'convex/react'
import { toast } from 'sonner'
import { api } from '@convex/_generated/api'
import { Id } from '@convex/_generated/dataModel'
import { normalizeNorwegianPhoneNumber, type InquiryFormValues } from '@/lib/validators/inquiry'
import {
  isReferenceImageWithinFallbackLimit,
  optimizeReferenceImage,
} from '@/components/public/booking/referenceImageOptimizer'

interface UseInquirySubmissionOptions {
  onCompleted: () => void
}

export function useInquirySubmission({ onCompleted }: UseInquirySubmissionOptions) {
  const [uploadProgress, setUploadProgress] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const createInquiry = useMutation(api.inquiries.create)
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl)
  const addReferenceImages = useMutation(api.inquiries.addReferenceImages)
  const sendInquiryConfirmation = useAction(api.mail.sendInquiryConfirmation.sendInquiryConfirmation)

  async function submitInquiry(data: InquiryFormValues) {
    const files = data.referenceImages ? Array.from(data.referenceImages) : []

    try {
      const { inquiryId, uploadToken } = await createInquiry({
        name: data.name,
        email: data.email,
        phone: normalizeNorwegianPhoneNumber(data.phone),
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

      if (files.length > 0) {
        const uploaded: Array<{ storageId: string }> = []

        for (let i = 0; i < files.length; i += 1) {
          const originalFile = files[i]
          setUploadProgress(`Klargjør bilde ${i + 1} av ${files.length}…`)
          try {
            let file = originalFile
            try {
              file = await optimizeReferenceImage(originalFile)
            } catch {
              if (!isReferenceImageWithinFallbackLimit(originalFile)) {
                throw new Error('Image too large')
              }
            }

            setUploadProgress(`Laster opp bilde ${i + 1} av ${files.length}…`)
            const uploadUrl = await generateUploadUrl({ inquiryId, uploadToken })
            const response = await fetch(uploadUrl, {
              method: 'POST',
              headers: { 'Content-Type': file.type },
              body: file,
            })

            if (!response.ok) throw new Error(`HTTP ${response.status}`)

            const { storageId } = await response.json()
            uploaded.push({ storageId })
          } catch {
            toast.error(`Feil ved opplasting av ${originalFile.name} — fortsetter uten dette bildet`)
          }
        }

        if (uploaded.length > 0) {
          try {
            await addReferenceImages({
              inquiryId,
              uploadToken,
              images: uploaded.map((image) => ({
                ...image,
                storageId: image.storageId as Id<'_storage'>,
              })),
            })
          } catch {
            toast.error('Kunne ikke lagre referansebilder — forespørselen er likevel sendt')
          }
        }
      }

      try {
        await sendInquiryConfirmation({ inquiryId })
      } catch {
        toast.error('Forespørselen er mottatt, men bekreftelsesmail kunne ikke sendes.')
      }

      onCompleted()
      setSubmitted(true)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Ukjent feil'
      toast.error(`Kunne ikke sende forespørselen: ${message}`)
    } finally {
      setUploadProgress(null)
    }
  }

  return {
    submitInquiry,
    uploadProgress,
    submitted,
    resetSubmitted: () => setSubmitted(false),
  }
}
