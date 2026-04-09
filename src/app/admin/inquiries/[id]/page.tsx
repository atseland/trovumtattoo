'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import { useQuery, useConvexAuth } from 'convex/react'
import { api } from '@convex/_generated/api'
import { Id } from '@convex/_generated/dataModel'
import { StatusChangeSheet } from '@/components/admin/StatusChangeSheet'
import { CreateClientSheet } from '@/components/admin/CreateClientSheet'
import {
  InquiryActivitySection,
  InquiryContactSection,
  InquiryDescriptionSection,
  InquiryHeader,
  InquiryReferenceImagesSection,
} from '@/components/admin/inquiry-detail/InquiryDetailSections'
import { Skeleton } from '@/components/ui/Skeleton'

export default function InquiryDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { isAuthenticated } = useConvexAuth()
  const [sheetOpen, setSheetOpen] = useState(false)
  const [clientSheetOpen, setClientSheetOpen] = useState(false)

  const inquiry = useQuery(
    api.inquiries.get,
    isAuthenticated ? { id: id as Id<"inquiries"> } : 'skip'
  )

  const referenceImages = useQuery(
    api.inquiries.getReferenceImages,
    isAuthenticated && inquiry ? { inquiryId: id as Id<"inquiries"> } : 'skip'
  )

  const activityLog = useQuery(
    api.activityLog.listByEntity,
    isAuthenticated ? { entityType: 'inquiry', entityId: id as Id<"inquiries"> } : 'skip'
  )

  if (!isAuthenticated || inquiry === undefined) {
    return (
      <div className='max-w-2xl flex flex-col gap-3'>
        <Skeleton className='h-[44px] w-[200px]' />
        <Skeleton className='h-[48px]' />
        <Skeleton className='h-[180px]' />
        <Skeleton className='h-[120px]' />
      </div>
    )
  }

  if (!inquiry) {
    return (
      <div className='max-w-2xl'>
        <p className='font-sans text-[13px] text-[#af8c87] mb-4'>Forespørselen ble ikke funnet.</p>
        <Link href='/admin/inquiries' className='font-sans text-[13px] text-nav hover:text-paper transition-colors duration-[200ms]'>
          ← Tilbake
        </Link>
      </div>
    )
  }

  return (
    <div className='max-w-2xl'>
      <InquiryHeader
        name={inquiry.name}
        status={inquiry.status}
        onChangeStatus={() => setSheetOpen(true)}
        onCreateClient={() => setClientSheetOpen(true)}
      />
      <InquiryContactSection inquiry={inquiry} />
      <InquiryDescriptionSection
        bodyPlacement={inquiry.bodyPlacement}
        description={inquiry.description}
        extraNotes={inquiry.extraNotes}
      />
      <InquiryReferenceImagesSection referenceImages={referenceImages as string[] | undefined} />
      <InquiryActivitySection entries={activityLog} />

      <StatusChangeSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        inquiryId={id as Id<"inquiries">}
        currentStatus={inquiry.status}
      />

      <CreateClientSheet
        open={clientSheetOpen}
        onOpenChange={setClientSheetOpen}
        inquiryId={id as Id<"inquiries">}
        defaultName={inquiry.name}
        defaultEmail={inquiry.email}
        defaultPhone={inquiry.phone}
        defaultInstagram={inquiry.instagramHandle}
      />
    </div>
  )
}
