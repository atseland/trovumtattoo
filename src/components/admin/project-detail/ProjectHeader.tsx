'use client'

import Link from 'next/link'
import { StatusBadge } from '@/components/admin/StatusBadge'

interface ProjectHeaderProps {
  clientId: string
  status: string
}

export function ProjectHeader({ clientId, status }: ProjectHeaderProps) {
  return (
    <>
      <Link
        href={`/admin/clients/${clientId}`}
        className='font-sans text-[13px] text-nav hover:text-paper transition-colors duration-[200ms] no-underline block mb-5'
      >
        ← Tilbake til klient
      </Link>

      <div className='flex items-center gap-3 flex-wrap mb-4'>
        <h1 className='font-serif italic text-[clamp(22px,3vw,30px)] text-paper leading-[1.1] tracking-[-0.02em]'>
          Prosjekt
        </h1>
        <StatusBadge status={status} />
      </div>
    </>
  )
}
