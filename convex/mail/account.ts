import { internalMutation, internalQuery, mutation, query } from '../_generated/server'
import { v } from 'convex/values'
import { assertEmailFormat, assertStringLength, assertOptionalStringLength } from '../lib/validate'
import type { MailConfig } from './config'

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

    assertEmailFormat(args.emailAddress, 'emailAddress')
    assertStringLength(args.fromName, 'fromName', 1, 200)
    if (args.password !== undefined) assertStringLength(args.password, 'password', 1, 500)
    assertOptionalStringLength(args.hostImap, 'hostImap', 200)
    assertOptionalStringLength(args.hostSmtp, 'hostSmtp', 200)

    const existing = await ctx.db
      .query('mailAccounts')
      .withIndex('by_emailAddress', (q) => q.eq('emailAddress', args.emailAddress))
      .first()

    if (existing) {
      const patch: Record<string, unknown> = {
        emailAddress: args.emailAddress,
        username: args.emailAddress,
        fromName: args.fromName,
        hostImap: args.hostImap,
        portImap: args.portImap,
        hostSmtp: args.hostSmtp,
        portSmtp: args.portSmtp,
        isActive: true,
      }
      if (args.password) patch.password = args.password
      await ctx.db.patch(existing._id, patch)
      return existing._id
    }

    if (!args.password) throw new Error('Passord er påkrevd for ny konto')

    return await ctx.db.insert('mailAccounts', {
      emailAddress: args.emailAddress,
      provider: 'imap-smtp',
      username: args.emailAddress,
      password: args.password,
      fromName: args.fromName,
      hostImap: args.hostImap,
      portImap: args.portImap,
      hostSmtp: args.hostSmtp,
      portSmtp: args.portSmtp,
      isActive: true,
    })
  },
})

/** Public query — returns account info WITHOUT password. */
export const getCurrent = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) return null

    const account = await ctx.db
      .query('mailAccounts')
      .filter((q) => q.eq(q.field('isActive'), true))
      .first()

    if (!account) return null

    return {
      _id: account._id,
      emailAddress: account.emailAddress,
      fromName: account.fromName,
      hostImap: account.hostImap ?? null,
      portImap: account.portImap ?? null,
      hostSmtp: account.hostSmtp ?? null,
      portSmtp: account.portSmtp ?? null,
      lastSyncAt: account.lastSyncAt ?? null,
    }
  },
})

/** Internal query — full config including password. For server actions only. */
export const getConfig = internalQuery({
  args: {},
  handler: async (ctx): Promise<MailConfig | null> => {
    const account = await ctx.db
      .query('mailAccounts')
      .filter((q) => q.eq(q.field('isActive'), true))
      .first()

    if (!account) return null

    return {
      imap: {
        host: account.hostImap ?? 'imap.one.com',
        port: account.portImap ?? 993,
        secure: true,
        auth: { user: account.username, pass: account.password },
      },
      smtp: {
        host: account.hostSmtp ?? 'send.one.com',
        port: account.portSmtp ?? 465,
        secure: true,
        auth: { user: account.username, pass: account.password },
      },
      from: `${account.fromName} <${account.emailAddress}>`,
    }
  },
})

/** Internal mutation — updates lastSyncAt on the active account. */
export const updateLastSync = internalMutation({
  args: {},
  handler: async (ctx) => {
    const account = await ctx.db
      .query('mailAccounts')
      .filter((q) => q.eq(q.field('isActive'), true))
      .first()
    if (account) {
      await ctx.db.patch(account._id, { lastSyncAt: Date.now() })
    }
  },
})
