import { mutation, query } from './_generated/server'
import { v } from 'convex/values'
import { requireAdmin } from './lib/adminAuth'
import { MAX_REFERENCE_IMAGES } from './lib/inquiries/publicCreate'

export const generateUploadUrl = mutation({
  args: {
    inquiryId: v.id('inquiries'),
    uploadToken: v.string(),
  },
  handler: async (ctx, { inquiryId, uploadToken }) => {
    const inquiry = await ctx.db.get(inquiryId)
    if (!inquiry) throw new Error('Inquiry not found')
    if (!inquiry.referenceUploadToken || inquiry.referenceUploadToken !== uploadToken) {
      throw new Error('Invalid upload token')
    }
    if (!inquiry.referenceUploadTokenExpiresAt || inquiry.referenceUploadTokenExpiresAt < Date.now()) {
      throw new Error('Upload token expired')
    }

    const issuedCount = inquiry.referenceUploadUrlIssuedCount ?? 0
    if (issuedCount >= MAX_REFERENCE_IMAGES) {
      throw new Error('Du kan maks laste opp 10 referansebilder')
    }

    await ctx.db.patch(inquiryId, { referenceUploadUrlIssuedCount: issuedCount + 1 })
    return await ctx.storage.generateUploadUrl()
  },
})

export const getImageUrls = query({
  args: { storageIds: v.array(v.id('_storage')) },
  handler: async (ctx, { storageIds }) => {
    await requireAdmin(ctx)

    const urls = await Promise.all(
      storageIds.map((id) => ctx.storage.getUrl(id))
    )
    return urls.filter((url): url is string => url !== null)
  },
})
