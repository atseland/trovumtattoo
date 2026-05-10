import { describe, expect, it } from 'vitest'
import { isAllowedAdminEmail, parseAdminEmails, requireAdmin } from '@convex/lib/adminAuth'

const allowed = parseAdminEmails('aleksander.seland@gmail.com,elkritrovum@gmail.com')

function fakeCtx(email: string | null) {
  return {
    auth: {
      getUserIdentity: async () =>
        email
          ? {
            tokenIdentifier: `issuer|${email}`,
            subject: email,
            issuer: 'issuer',
            email,
          }
          : null,
    },
  } as never
}

describe('convex admin auth policy', () => {
  it('allows both approved admin emails', () => {
    expect(isAllowedAdminEmail('aleksander.seland@gmail.com', allowed)).toBe(true)
    expect(isAllowedAdminEmail('elkritrovum@gmail.com', allowed)).toBe(true)
  })

  it('rejects missing or unapproved emails', () => {
    expect(isAllowedAdminEmail(null, allowed)).toBe(false)
    expect(isAllowedAdminEmail('not-admin@example.com', allowed)).toBe(false)
  })

  it('requires an allowed admin identity', async () => {
    process.env.TROVUM_ADMIN_EMAILS = 'aleksander.seland@gmail.com,elkritrovum@gmail.com'

    await expect(requireAdmin(fakeCtx('aleksander.seland@gmail.com'))).resolves.toMatchObject({
      email: 'aleksander.seland@gmail.com',
    })
    await expect(requireAdmin(fakeCtx('elkritrovum@gmail.com'))).resolves.toMatchObject({
      email: 'elkritrovum@gmail.com',
    })
    await expect(requireAdmin(fakeCtx('ikke-admin@example.com'))).rejects.toThrow('Forbidden')
    await expect(requireAdmin(fakeCtx(null))).rejects.toThrow('Unauthorized')
  })
})
