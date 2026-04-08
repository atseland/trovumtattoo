'use client'

import { useState } from 'react'
import { useMutation } from 'convex/react'
import { toast } from 'sonner'
import { api } from '@convex/_generated/api'
import { Id } from '@convex/_generated/dataModel'
import type { InquiryFormValues } from '@/lib/validators/inquiry'

interface UseInquirySubmissionOptions {
  onCompleted: () => void
}

export function useInquirySubmission({ onCompleted }: UseInquirySubmissionOptions) {
  const [uploadProgress, setUploadProgress] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const createInquiry = useMutation(api.inquiries.create)
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl)
  const addReferenceImages = useMutation(api.inquiries.addReferenceImages)

  async function submitInquiry(data: InquiryFormValues) {
    const files = data.referenceImages ? Array.from(data.referenceImages) : []

    try {
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

      if (files.length > 0) {
        const uploaded: Array<{ storageId: string; url: string }> = []

        for (let i = 0; i < files.length; i += 1) {
          setUploadProgress(`Laster opp bilde ${i + 1} av ${files.length}…`)
          try {
            const uploadUrl = await generateUploadUrl()
            const response = await fetch(uploadUrl, {
              method: 'POST',
              headers: { 'Content-Type': files[i].type },
              body: files[i],
            })

            if (!response.ok) throw new Error(`HTTP ${response.status}`)

            const { storageId } = await response.json()
            uploaded.push({ storageId, url: uploadUrl.split('?')[0] })
          } catch {
            toast.error(`Feil ved opplasting av ${files[i].name} — fortsetter uten dette bildet`)
          }
        }

        if (uploaded.length > 0) {
          try {
            await addReferenceImages({
              inquiryId,
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
