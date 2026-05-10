import { describe, expect, it } from 'vitest'
import { getConfirmationEmailAttemptStatus } from '@convex/inquiries'
import { MANUAL_MAIL_SYNC_THROTTLE_MS, shouldThrottleManualMailSync } from '@convex/mail/sync'

describe('mail policy', () => {
  it('throttles manual mail sync after a recent sync', () => {
    const now = 1_000_000

    expect(shouldThrottleManualMailSync(undefined, now)).toBe(false)
    expect(shouldThrottleManualMailSync(now - MANUAL_MAIL_SYNC_THROTTLE_MS + 1, now)).toBe(true)
    expect(shouldThrottleManualMailSync(now - MANUAL_MAIL_SYNC_THROTTLE_MS, now)).toBe(false)
  })

  it('makes inquiry confirmation attempts idempotent with cooldown', () => {
    const now = 1_000_000

    expect(getConfirmationEmailAttemptStatus({ confirmationEmailSentAt: now - 1 }, now)).toBe('already_sent')
    expect(getConfirmationEmailAttemptStatus({ confirmationEmailLastAttemptAt: now - 1 }, now)).toBe('rate_limited')
    expect(getConfirmationEmailAttemptStatus({ confirmationEmailLastAttemptAt: now - 11 * 60 * 1000 }, now)).toBe('allowed')
    expect(getConfirmationEmailAttemptStatus({}, now)).toBe('allowed')
  })
})
