'use client'

import { ActivityLogTimeline } from '@/components/admin/ActivityLogTimeline'
import type { ProjectActivityEntries } from '@/components/admin/project-detail/projectDetailTypes'
import { Skeleton } from '@/components/ui/Skeleton'

interface ProjectActivitySectionProps {
  entries: ProjectActivityEntries | null | undefined
}

export function ProjectActivitySection({ entries }: ProjectActivitySectionProps) {
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
