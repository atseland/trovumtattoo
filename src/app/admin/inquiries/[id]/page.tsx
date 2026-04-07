'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import { useQuery, useConvexAuth } from 'convex/react'
import { api } from '../../../../../convex/_generated/api'
import { Id } from '../../../../../convex/_generated/dataModel'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { ActivityLogTimeline } from '@/components/admin/ActivityLogTimeline'
import { StatusChangeSheet } from '@/components/admin/StatusChangeSheet'
import { CreateClientSheet } from '@/components/admin/CreateClientSheet'
import { Skeleton } from '@/components/ui/Skeleton'
import { Rule } from '@/components/ui/Rule'
import { Btn } from '@/components/ui/Btn'

function Field({ label, value }: { label: string; value?: string | boolean | null }) {
  if (value === undefined || value === null || value === '') return null
  return (
    <div className='mb-4'>
      <p className='font-sans text-[10px] tracking-[0.14em] uppercase text-nav mb-[3px]'>{label}</p>
      <p className='font-sans text-[14px] text-paper leading-[1.6]'>
        {typeof value === 'boolean' ? (value ? 'Ja' : 'Nei') : value}
      </p>
    </div>
  )
}

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
      {/* Back + actions */}
      <div className='flex items-center justify-between flex-wrap gap-3 mb-6'>
        <Link
          href='/admin/inquiries'
          className='font-sans text-[13px] text-nav hover:text-paper transition-colors duration-[200ms] no-underline'
        >
          ← Tilbake
        </Link>
        <div className='flex gap-2'>
          <Btn variant='action-primary' onClick={() => setSheetOpen(true)}>
            Endre status
          </Btn>
          <Btn variant='sm' onClick={() => setClientSheetOpen(true)}>
            Opprett klient
          </Btn>
        </div>
      </div>

      {/* Header */}
      <div className='flex items-center gap-3 flex-wrap mb-6'>
        <h1 className='font-serif italic text-[clamp(22px,3vw,30px)] text-paper leading-[1.1] tracking-[-0.02em]'>
          {inquiry.name}
        </h1>
        <StatusBadge status={inquiry.status} />
      </div>

      <Rule className='mb-6' />

      {/* Contact fields */}
      <div className='bg-panel border border-rule px-5 py-5 mb-4'>
        <div className='grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-x-6'>
          <Field label='E-post' value={inquiry.email} />
          <Field label='Telefon' value={inquiry.phone} />
          <Field label='Instagram' value={inquiry.instagramHandle} />
          <Field label='Størrelse' value={inquiry.size} />
          <Field label='Stil' value={inquiry.style} />
          <Field label='Budsjett' value={inquiry.budget} />
          <Field label='Ønsket tidsrom' value={inquiry.desiredTiming} />
          <Field label='Første tatovering' value={inquiry.firstTattoo} />
          <Field label='Cover-up' value={inquiry.coverUp} />
          <Field label='Touch-up' value={inquiry.touchUp} />
        </div>
      </div>

      {/* Description / placement — highlighted info cell */}
      {(inquiry.bodyPlacement || inquiry.description || inquiry.extraNotes) && (
        <div
          className='px-5 py-5 mb-6'
          style={{
            background: 'linear-gradient(180deg, rgba(237,233,230,0.045), rgba(237,233,230,0.02))',
            borderTop: '1px solid rgba(237,233,230,0.1)',
            borderBottom: '1px solid rgba(237,233,230,0.1)',
          }}
        >
          <Field label='Plassering' value={inquiry.bodyPlacement} />
          <Field label='Beskrivelse' value={inquiry.description} />
          <Field label='Ekstra notater' value={inquiry.extraNotes} />
        </div>
      )}

      {/* Reference images */}
      {referenceImages && referenceImages.length > 0 && (
        <>
          <h2 className='font-sans text-[10px] tracking-[0.14em] uppercase text-nav mb-3'>Referansebilder</h2>
          <div className='grid grid-cols-[repeat(auto-fill,minmax(110px,1fr))] gap-2 mb-6'>
            {(referenceImages as string[]).map((url, i) => (
              <a key={i} href={url} target='_blank' rel='noopener noreferrer'>
                <img
                  src={url}
                  alt={`Referansebilde ${i + 1}`}
                  className='w-full border border-rule'
                  style={{ aspectRatio: '1', objectFit: 'cover', filter: 'grayscale(20%) contrast(1.05)' }}
                />
              </a>
            ))}
          </div>
          <Rule className='mb-6' />
        </>
      )}

      {/* Activity log */}
      <div>
        <h2 className='font-sans text-[10px] tracking-[0.14em] uppercase text-nav mb-4'>Aktivitetslogg</h2>
        {activityLog === undefined ? (
          <div className='flex flex-col gap-2'>
            {[1, 2, 3].map(i => <Skeleton key={i} className='h-[40px]' />)}
          </div>
        ) : (
          <ActivityLogTimeline entries={activityLog ?? []} />
        )}
      </div>

      {/* Status change sheet */}
      <StatusChangeSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        inquiryId={id as Id<"inquiries">}
        currentStatus={inquiry.status}
      />

      {/* Create client sheet */}
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
