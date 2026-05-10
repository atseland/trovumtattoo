import { describe, expect, it } from 'vitest'
import { assertBookingCanBeArchived, isBookingArchived } from '@convex/lib/bookings/archivePolicy'

describe('booking archive policy', () => {
  it('allows archive only for completed or cancelled active bookings', () => {
    expect(() => assertBookingCanBeArchived({ status: 'completed' })).not.toThrow()
    expect(() => assertBookingCanBeArchived({ status: 'cancelled' })).not.toThrow()

    expect(() => assertBookingCanBeArchived({ status: 'scheduled' })).toThrow('completed or cancelled')
    expect(() => assertBookingCanBeArchived({ status: 'rescheduled' })).toThrow('completed or cancelled')
  })

  it('does not allow archiving a booking that is already archived', () => {
    expect(isBookingArchived({ archivedAt: 1710000000000 })).toBe(true)
    expect(() => assertBookingCanBeArchived({ status: 'completed', archivedAt: 1710000000000 })).toThrow(
      'already archived',
    )
  })
})
