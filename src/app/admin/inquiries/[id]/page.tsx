'use client'

import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { useMutation, useQuery, useConvexAuth } from 'convex/react'
import { toast } from 'sonner'
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
import { Btn } from '@/components/ui/Btn'

export default function InquiryDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { isAuthenticated } = useConvexAuth()
  const [sheetOpen, setSheetOpen] = useState(false)
  const [clientSheetOpen, setClientSheetOpen] = useState(false)
  const [archiveConfirmOpen, setArchiveConfirmOpen] = useState(false)
  const [archiving, setArchiving] = useState(false)
  const archiveInquiry = useMutation(api.inquiries.archive)

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

  async function handleArchive() {
    setArchiving(true)
    try {
      await archiveInquiry({ id: id as Id<"inquiries"> })
      toast.success('Forespørsel arkivert')
      router.push('/admin/inquiries')
    } catch {
      toast.error('Kunne ikke arkivere forespørsel')
    } finally {
      setArchiving(false)
    }
  }

  return (
    <div className='max-w-2xl'>
      <InquiryHeader
        name={inquiry.name}
        status={inquiry.status}
        archivedAt={inquiry.archivedAt}
        onChangeStatus={() => setSheetOpen(true)}
        onCreateClient={() => setClientSheetOpen(true)}
        onArchive={() => setArchiveConfirmOpen(true)}
      />
      {inquiry.archivedAt && (
        <div className='mb-5 border border-rule bg-panel px-4 py-3 font-sans text-[13px] text-body'>
          Denne forespørselen er arkivert.
        </div>
      )}
      {archiveConfirmOpen && (
        <div className='mb-5 border px-4 py-4' style={{ background: 'rgba(175,140,135,0.06)', borderColor: 'rgba(175,140,135,0.2)' }}>
          <p className='mb-3 font-sans text-[13px] leading-[1.6]' style={{ color: '#af8c87' }}>
            Arkiver forespørselen? Den skjules fra vanlig liste, men kan gjenopprettes fra arkivet.
          </p>
          <div className='flex flex-wrap gap-2'>
            <Btn variant='sm' onClick={handleArchive} disabled={archiving}>
              {archiving ? 'Arkiverer…' : 'Arkiver'}
            </Btn>
            <Btn variant='sm' onClick={() => setArchiveConfirmOpen(false)}>
              Avbryt
            </Btn>
          </div>
        </div>
      )}
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
