interface BookingArchiveState {
  status: string
  archivedAt?: number | null
}

const ARCHIVABLE_BOOKING_STATUSES = new Set(['completed', 'cancelled'])

export function isBookingArchived(booking: { archivedAt?: number | null }) {
  return booking.archivedAt !== undefined && booking.archivedAt !== null
}

export function canArchiveBooking(booking: BookingArchiveState) {
  return ARCHIVABLE_BOOKING_STATUSES.has(booking.status) && !isBookingArchived(booking)
}

export function assertBookingCanBeArchived(booking: BookingArchiveState) {
  if (isBookingArchived(booking)) {
    throw new Error('Booking is already archived')
  }

  if (!ARCHIVABLE_BOOKING_STATUSES.has(booking.status)) {
    throw new Error('Booking must be completed or cancelled before it can be archived')
  }
}
