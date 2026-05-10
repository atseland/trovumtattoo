import { describe, expect, it } from 'vitest'
import { isAllowedAdminEmail, parseAdminEmails } from '../adminAccess'

const allowed = parseAdminEmails(' aleksander.seland@gmail.com, elkritrovum@gmail.com, ')

describe('admin access allowlist', () => {
  it('normalizes configured admin emails', () => {
    expect(allowed).toEqual(new Set(['aleksander.seland@gmail.com', 'elkritrovum@gmail.com']))
  })

  it('allows only approved admin emails', () => {
    expect(isAllowedAdminEmail('ALEKSANDER.SELAND@gmail.com', allowed)).toBe(true)
    expect(isAllowedAdminEmail(' elkritrovum@gmail.com ', allowed)).toBe(true)
    expect(isAllowedAdminEmail('ikke-admin@example.com', allowed)).toBe(false)
    expect(isAllowedAdminEmail(undefined, allowed)).toBe(false)
  })
})
