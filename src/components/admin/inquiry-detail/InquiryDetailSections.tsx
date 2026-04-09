'use client'

import Link from 'next/link'
import type { ComponentProps } from 'react'
import { ActivityLogTimeline } from '@/components/admin/ActivityLogTimeline'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { Btn } from '@/components/ui/Btn'
import { Rule } from '@/components/ui/Rule'
import { Skeleton } from '@/components/ui/Skeleton'

function DetailField({ label, value }: { label: string; value?: string | boolean | null }) {
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

interface InquiryHeaderProps {
  name: string
  status: string
  onChangeStatus: () => void
  onCreateClient: () => void
}

export function InquiryHeader({ name, status, onChangeStatus, onCreateClient }: InquiryHeaderProps) {
  return (
    <>
      <div className='flex items-center justify-between flex-wrap gap-3 mb-6'>
        <Link
          href='/admin/inquiries'
          className='font-sans text-[13px] text-nav hover:text-paper transition-colors duration-[200ms] no-underline'
        >
          ← Tilbake
        </Link>
        <div className='flex gap-2'>
          <Btn variant='action-primary' onClick={onChangeStatus}>
            Endre status
          </Btn>
          <Btn variant='sm' onClick={onCreateClient}>
            Opprett klient
          </Btn>
        </div>
      </div>

      <div className='flex items-center gap-3 flex-wrap mb-6'>
        <h1 className='font-serif italic text-[clamp(22px,3vw,30px)] text-paper leading-[1.1] tracking-[-0.02em]'>
          {name}
        </h1>
        <StatusBadge status={status} />
      </div>

      <Rule className='mb-6' />
    </>
  )
}

interface InquiryContactSectionProps {
  inquiry: {
    email: string
    phone: string
    instagramHandle?: string | null
    size: string
    style: string
    budget?: string | null
    desiredTiming?: string | null
    firstTattoo: boolean
    coverUp: boolean
    touchUp: boolean
  }
}

export function InquiryContactSection({ inquiry }: InquiryContactSectionProps) {
  return (
    <div className='bg-panel border border-rule px-5 py-5 mb-4'>
      <div className='grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-x-6'>
        <DetailField label='E-post' value={inquiry.email} />
        <DetailField label='Telefon' value={inquiry.phone} />
        <DetailField label='Instagram' value={inquiry.instagramHandle} />
        <DetailField label='Størrelse' value={inquiry.size} />
        <DetailField label='Stil' value={inquiry.style} />
        <DetailField label='Budsjett' value={inquiry.budget} />
        <DetailField label='Ønsket tidsrom' value={inquiry.desiredTiming} />
        <DetailField label='Første tatovering' value={inquiry.firstTattoo} />
        <DetailField label='Cover-up' value={inquiry.coverUp} />
        <DetailField label='Touch-up' value={inquiry.touchUp} />
      </div>
    </div>
  )
}

interface InquiryDescriptionSectionProps {
  bodyPlacement?: string | null
  description?: string | null
  extraNotes?: string | null
}

export function InquiryDescriptionSection({
  bodyPlacement,
  description,
  extraNotes,
}: InquiryDescriptionSectionProps) {
  if (!bodyPlacement && !description && !extraNotes) return null

  return (
    <div
      className='px-5 py-5 mb-6'
      style={{
        background: 'linear-gradient(180deg, rgba(237,233,230,0.045), rgba(237,233,230,0.02))',
        borderTop: '1px solid rgba(237,233,230,0.1)',
        borderBottom: '1px solid rgba(237,233,230,0.1)',
      }}
    >
      <DetailField label='Plassering' value={bodyPlacement} />
      <DetailField label='Beskrivelse' value={description} />
      <DetailField label='Ekstra notater' value={extraNotes} />
    </div>
  )
}

interface InquiryReferenceImagesSectionProps {
  referenceImages: string[] | undefined
}

export function InquiryReferenceImagesSection({ referenceImages }: InquiryReferenceImagesSectionProps) {
  if (!referenceImages || referenceImages.length === 0) return null

  return (
    <>
      <h2 className='font-sans text-[10px] tracking-[0.14em] uppercase text-nav mb-3'>Referansebilder</h2>
      <div className='grid grid-cols-[repeat(auto-fill,minmax(110px,1fr))] gap-2 mb-6'>
        {referenceImages.map((url, index) => (
          <a key={url} href={url} target='_blank' rel='noopener noreferrer'>
            {/* eslint-disable-next-line @next/next/no-img-element -- remote storage URLs are rendered directly here */}
            <img
              src={url}
              alt={`Referansebilde ${index + 1}`}
              className='w-full border border-rule'
              style={{ aspectRatio: '1', objectFit: 'cover', filter: 'grayscale(20%) contrast(1.05)' }}
            />
          </a>
        ))}
      </div>
      <Rule className='mb-6' />
    </>
  )
}

type ActivityEntries = ComponentProps<typeof ActivityLogTimeline>['entries']

interface InquiryActivitySectionProps {
  entries: ActivityEntries | null | undefined
}

export function InquiryActivitySection({ entries }: InquiryActivitySectionProps) {
  return (
    <div>
      <h2 className='font-sans text-[10px] tracking-[0.14em] uppercase text-nav mb-4'>Aktivitetslogg</h2>
      {entries === undefined ? (
        <div className='flex flex-col gap-2'>
          {[1, 2, 3].map((i) => <Skeleton key={i} className='h-[40px]' />)}
        </div>
      ) : (
        <ActivityLogTimeline entries={entries ?? []} />
      )}
    </div>
  )
}
