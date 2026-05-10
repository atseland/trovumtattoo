import type { ComponentProps } from 'react'
import { ActivityLogTimeline } from '@/components/admin/ActivityLogTimeline'

export interface ProjectClientSummary {
  name: string
}

export interface ProjectBookingSummary {
  _id: string
  startAt: number
  endAt: number
  status: string
  notes?: string | null
  archivedAt?: number | null
}

export type ProjectActivityEntries = ComponentProps<typeof ActivityLogTimeline>['entries']
