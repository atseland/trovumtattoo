import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('Unauthorized')

    return await ctx.storage.generateUploadUrl()
  },
})

export const getImageUrls = query({
  args: { storageIds: v.array(v.id('_storage')) },
  handler: async (ctx, { storageIds }) => {
    const urls = await Promise.all(
      storageIds.map((id) => ctx.storage.getUrl(id))
    )
    return urls.filter((url): url is string => url !== null)
  },
})
