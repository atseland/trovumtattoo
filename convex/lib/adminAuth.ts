import type { ActionCtx, MutationCtx, QueryCtx } from '../_generated/server'

const ADMIN_EMAILS_ENV = 'TROVUM_ADMIN_EMAILS'

export function parseAdminEmails(value: string | undefined) {
  return new Set(
    (value ?? '')
      .split(',')
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean),
  )
}

export function isAllowedAdminEmail(email: string | null | undefined, allowedEmails = parseAdminEmails(process.env[ADMIN_EMAILS_ENV])) {
  return Boolean(email && allowedEmails.has(email.trim().toLowerCase()))
}

export async function requireAdmin(ctx: QueryCtx | MutationCtx | ActionCtx) {
  const identity = await ctx.auth.getUserIdentity()
  if (!identity) throw new Error('Unauthorized')
  if (!isAllowedAdminEmail(identity.email)) throw new Error('Forbidden')
  return identity
}
