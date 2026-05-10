import { describe, expect, it } from 'vitest'
import { fromDatetimeLocal, toDatetimeLocal } from './datetimeLocal'

describe('datetime-local helpers', () => {
  it('formats timestamps using local time fields', () => {
    const timestamp = new Date(2026, 0, 15, 10, 30).getTime()

    expect(toDatetimeLocal(timestamp)).toBe('2026-01-15T10:30')
  })

  it('roundtrips through datetime-local without UTC shifting', () => {
    const localValue = '2026-07-15T14:45'

    expect(toDatetimeLocal(fromDatetimeLocal(localValue))).toBe(localValue)
  })
})
