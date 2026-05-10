import { internalMutation, internalQuery, mutation, query } from './_generated/server'
import { v } from 'convex/values'
import {
  archiveInquiry,
  getInquiry,
  getInquiryReferenceImages,
  listInquiries,
  listArchivedInquiries,
  permanentlyDeleteInquiry,
  restoreInquiry,
  updateInquiryStatus,
} from './lib/inquiries/admin'
import { addReferenceImagesToInquiry, createInquiryWithSideEffects } from './lib/inquiries/publicCreate'
import { requireAdmin } from './lib/adminAuth'

export const create = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    instagramHandle: v.optional(v.string()),
    description: v.string(),
    bodyPlacement: v.string(),
    size: v.string(),
    style: v.string(),
    budget: v.optional(v.string()),
    desiredTiming: v.optional(v.string()),
    firstTattoo: v.boolean(),
    coverUp: v.boolean(),
    touchUp: v.boolean(),
    extraNotes: v.optional(v.string()),
  },
  handler: async (ctx, args) => await createInquiryWithSideEffects(ctx, args),
})

export const updateStatus = mutation({
  args: {
    id: v.id('inquiries'),
    status: v.string(),
    note: v.optional(v.string()),
  },
  handler: async (ctx, { id, status, note }) => await updateInquiryStatus(ctx, id, status, note),
})

export const list = query({
  args: {
    status: v.optional(v.string()),
    coverUp: v.optional(v.boolean()),
    touchUp: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => await listInquiries(ctx, args),
})

export const search = query({
  args: { searchQuery: v.string() },
  handler: async (ctx, { searchQuery }) => {
    await requireAdmin(ctx)
    const normalizedQuery = searchQuery.trim().toLowerCase()
    if (normalizedQuery.length < 2) return []

    const rows = await ctx.db
      .query('inquiries')
      .withIndex('by_archived_createdAt', (q) => q.eq('archivedAt', undefined))
      .order('desc')
      .take(250)

    return rows
      .filter((inquiry) =>
        [
          inquiry.name,
          inquiry.email,
          inquiry.phone,
          inquiry.instagramHandle,
          inquiry.description,
          inquiry.status,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
          .includes(normalizedQuery)
      )
      .slice(0, 20)
  },
})

export const listArchived = query({
  args: {},
  handler: async (ctx) => await listArchivedInquiries(ctx),
})

export const get = query({
  args: { id: v.id('inquiries') },
  handler: async (ctx, { id }) => await getInquiry(ctx, id),
})

export const getForConfirmation = internalQuery({
  args: { id: v.id('inquiries') },
  handler: async (ctx, { id }) => await ctx.db.get(id),
})

export const beginConfirmationEmailAttempt = internalMutation({
  args: { id: v.id('inquiries'), now: v.number() },
  handler: async (ctx, { id, now }) => {
    const inquiry = await ctx.db.get(id)
    if (!inquiry) throw new Error('Inquiry not found')
    if (inquiry.confirmationEmailSentAt) return { status: 'already_sent' as const }

    const cooldownMs = 10 * 60 * 1000
    if (
      inquiry.confirmationEmailLastAttemptAt &&
      now - inquiry.confirmationEmailLastAttemptAt < cooldownMs
    ) {
      return { status: 'rate_limited' as const }
    }

    await ctx.db.patch(id, { confirmationEmailLastAttemptAt: now })
    return { status: 'allowed' as const }
  },
})

export const markConfirmationEmailSent = internalMutation({
  args: { id: v.id('inquiries'), now: v.number() },
  handler: async (ctx, { id, now }) => {
    await ctx.db.patch(id, {
      confirmationEmailSentAt: now,
      confirmationEmailLastAttemptAt: now,
    })
  },
})

export const getReferenceImages = query({
  args: { inquiryId: v.id('inquiries') },
  handler: async (ctx, { inquiryId }) => await getInquiryReferenceImages(ctx, inquiryId),
})

export const addReferenceImages = mutation({
  args: {
    inquiryId: v.id('inquiries'),
    uploadToken: v.string(),
    images: v.array(
      v.object({
        storageId: v.id('_storage'),
        altText: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, { inquiryId, uploadToken, images }) =>
    await addReferenceImagesToInquiry(ctx, inquiryId, uploadToken, images),
})

export const archive = mutation({
  args: {
    id: v.id('inquiries'),
    reason: v.optional(v.string()),
  },
  handler: async (ctx, { id, reason }) => await archiveInquiry(ctx, id, reason),
})

export const restore = mutation({
  args: { id: v.id('inquiries') },
  handler: async (ctx, { id }) => await restoreInquiry(ctx, id),
})

export const permanentlyDelete = mutation({
  args: { id: v.id('inquiries') },
  handler: async (ctx, { id }) => await permanentlyDeleteInquiry(ctx, id),
})
