import { mutation, query } from './_generated/server'
import { v } from 'convex/values'
import {
  getInquiry,
  getInquiryReferenceImages,
  listInquiries,
  updateInquiryStatus,
} from './lib/inquiries/admin'
import { addReferenceImagesToInquiry, createInquiryWithSideEffects } from './lib/inquiries/publicCreate'

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

export const get = query({
  args: { id: v.id('inquiries') },
  handler: async (ctx, { id }) => await getInquiry(ctx, id),
})

export const getReferenceImages = query({
  args: { inquiryId: v.id('inquiries') },
  handler: async (ctx, { inquiryId }) => await getInquiryReferenceImages(ctx, inquiryId),
})

export const addReferenceImages = mutation({
  args: {
    inquiryId: v.id('inquiries'),
    images: v.array(
      v.object({
        storageId: v.id('_storage'),
        url: v.string(),
        altText: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, { inquiryId, images }) => await addReferenceImagesToInquiry(ctx, inquiryId, images),
})
