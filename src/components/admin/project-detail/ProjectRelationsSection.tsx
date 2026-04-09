'use client'

import Link from 'next/link'
import type { ProjectClientSummary } from '@/components/admin/project-detail/projectDetailTypes'

interface ProjectRelationsSectionProps {
  client?: ProjectClientSummary | null
  clientId: string
  inquiryId?: string | null
}

export function ProjectRelationsSection({
  client,
  clientId,
  inquiryId,
}: ProjectRelationsSectionProps) {
  return (
    <div className='bg-panel border border-rule px-5 py-4 mb-4 flex flex-col gap-3'>
      {client && (
        <div>
          <p className='font-sans text-[10px] tracking-[0.14em] uppercase text-nav mb-[3px]'>Klient</p>
          <Link
            href={`/admin/clients/${clientId}`}
            className='font-sans text-[14px] text-paper hover:text-accent transition-colors duration-[200ms] no-underline'
          >
            {client.name}
          </Link>
        </div>
      )}
      {inquiryId && (
        <div>
          <p className='font-sans text-[10px] tracking-[0.14em] uppercase text-nav mb-[3px]'>Forespørsel</p>
          <Link
            href={`/admin/inquiries/${inquiryId}`}
            className='font-sans text-[14px] text-accent hover:text-paper transition-colors duration-[200ms] no-underline'
          >
            Vis forespørsel →
          </Link>
        </div>
      )}
    </div>
  )
}
