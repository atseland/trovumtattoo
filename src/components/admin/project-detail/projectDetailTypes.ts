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
}

export type ProjectActivityEntries = ComponentProps<typeof ActivityLogTimeline>['entries']
