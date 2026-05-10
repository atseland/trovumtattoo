import { describe, expect, it } from 'vitest'
import {
  ADMIN_SEARCH_RESULT_LIMIT,
  adminSearchHasQuery,
  limitAdminSearchResults,
  matchesAdminSearch,
  normalizeAdminSearchQuery,
} from '@convex/lib/adminSearch'

describe('admin search policy', () => {
  it('normalizes and requires at least two query characters', () => {
    expect(normalizeAdminSearchQuery('  ALEKS  ')).toBe('aleks')
    expect(adminSearchHasQuery('a')).toBe(false)
    expect(adminSearchHasQuery(' ab ')).toBe(true)
  })

  it('matches across provided fields before applying result limit', () => {
    expect(matchesAdminSearch('booking', ['Kunde', 'Stor booking'])).toBe(true)
    expect(matchesAdminSearch('kunde@example.com', ['Kunde', 'kunde@example.com'])).toBe(true)
    expect(matchesAdminSearch('missing', ['Kunde', 'Stor booking'])).toBe(false)
  })

  it('caps returned results explicitly', () => {
    const rows = Array.from({ length: ADMIN_SEARCH_RESULT_LIMIT + 5 }, (_, index) => index)

    expect(limitAdminSearchResults(rows)).toHaveLength(ADMIN_SEARCH_RESULT_LIMIT)
    expect(limitAdminSearchResults(rows).at(-1)).toBe(ADMIN_SEARCH_RESULT_LIMIT - 1)
  })
})
