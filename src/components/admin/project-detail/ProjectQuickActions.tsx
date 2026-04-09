'use client'

import { Btn } from '@/components/ui/Btn'

interface ProjectQuickActionsProps {
  reviewRequestedAt?: number | null
  onCreateBooking: () => void
  onSendAftercare: () => void
  onSendReviewRequest: () => void
}

export function ProjectQuickActions({
  reviewRequestedAt,
  onCreateBooking,
  onSendAftercare,
  onSendReviewRequest,
}: ProjectQuickActionsProps) {
  return (
    <div className='flex flex-wrap gap-2 mb-6'>
      <Btn variant='sm' onClick={onCreateBooking}>Opprett booking</Btn>
      <Btn variant='sm' onClick={onSendAftercare}>Send aftercare</Btn>
      <Btn variant='sm' onClick={onSendReviewRequest} disabled={!!reviewRequestedAt}>
        {reviewRequestedAt ? 'Anmeldelse forespurt' : 'Be om anmeldelse'}
      </Btn>
    </div>
  )
}
