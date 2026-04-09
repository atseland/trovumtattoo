import { internalMutation, internalQuery, mutation, query } from '../_generated/server'
import { v } from 'convex/values'
import { getMailConfig, getMailConfigSummary, hasMailConfig, type MailConfig } from './config'

export const save = mutation({
  args: {
    emailAddress: v.string(),
    password: v.optional(v.string()),
    fromName: v.string(),
    hostImap: v.optional(v.string()),
    portImap: v.optional(v.number()),
    hostSmtp: v.optional(v.string()),
    portSmtp: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('Unauthorized')
    void args
    throw new Error('Mail-kontoen er låst til serverkonfigurasjon og kan ikke redigeres i admin.')
  },
})

/** Public query — returns account info WITHOUT password. */
export const getCurrent = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) return null

    if (!hasMailConfig()) return null

    const summary = getMailConfigSummary()
    const account = await ctx.db
      .query('mailAccounts')
      .withIndex('by_emailAddress', (q) => q.eq('emailAddress', summary.emailAddress))
      .first()

    return {
      _id: account?._id ?? null,
      emailAddress: summary.emailAddress,
      fromName: summary.fromName,
      hostImap: summary.hostImap,
      portImap: summary.portImap,
      hostSmtp: summary.hostSmtp,
      portSmtp: summary.portSmtp,
      lastSyncAt: account?.lastSyncAt ?? null,
      managedByEnv: true,
    }
  },
})

/** Internal query — full config including password. For server actions only. */
export const getConfig = internalQuery({
  args: {},
  handler: async (ctx): Promise<MailConfig | null> => {
    void ctx
    if (!hasMailConfig()) return null
    return getMailConfig()
  },
})

/** Internal mutation — updates lastSyncAt on the active account. */
export const updateLastSync = internalMutation({
  args: {},
  handler: async (ctx) => {
    if (!hasMailConfig()) return

    const summary = getMailConfigSummary()
    const account = await ctx.db
      .query('mailAccounts')
      .withIndex('by_emailAddress', (q) => q.eq('emailAddress', summary.emailAddress))
      .first()

    const lastSyncAt = Date.now()

    if (account) {
      await ctx.db.patch(account._id, {
        fromName: summary.fromName,
        hostImap: summary.hostImap,
        portImap: summary.portImap,
        hostSmtp: summary.hostSmtp,
        portSmtp: summary.portSmtp,
        isActive: true,
        lastSyncAt,
      })
      return
    }

    await ctx.db.insert('mailAccounts', {
      emailAddress: summary.emailAddress,
      provider: 'imap-smtp',
      username: summary.emailAddress,
      password: '__managed_by_env__',
      fromName: summary.fromName,
      hostImap: summary.hostImap,
      portImap: summary.portImap,
      hostSmtp: summary.hostSmtp,
      portSmtp: summary.portSmtp,
      isActive: true,
      lastSyncAt,
    })
  },
})
