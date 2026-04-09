import type { Id } from '../../_generated/dataModel'
import type { MutationCtx, QueryCtx } from '../../_generated/server'

interface InquiryListFilters {
  status?: string
  coverUp?: boolean
  touchUp?: boolean
}

export interface ReferenceImageInput {
  storageId: Id<'_storage'>
  url: string
  altText?: string
}

async function requireIdentity(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity()
  if (!identity) throw new Error('Unauthorized')
}

export async function updateInquiryStatus(
  ctx: MutationCtx,
  id: Id<'inquiries'>,
  status: string,
  note?: string,
) {
  await requireIdentity(ctx)

  const inquiry = await ctx.db.get(id)
  if (!inquiry) throw new Error('Inquiry not found')

  await ctx.db.patch(id, { status })
  await ctx.db.insert('activityLog', {
    entityType: 'inquiry',
    entityId: id,
    action: 'status_changed',
    payload: { from: inquiry.status, to: status, ...(note ? { note } : {}) },
    createdAt: Date.now(),
  })
}

export async function listInquiries(ctx: QueryCtx, { status, coverUp, touchUp }: InquiryListFilters) {
  await requireIdentity(ctx)

  let rows
  if (status) {
    rows = await ctx.db
      .query('inquiries')
      .withIndex('by_status', (query) => query.eq('status', status))
      .order('desc')
      .collect()
  } else {
    rows = await ctx.db
      .query('inquiries')
      .withIndex('by_createdAt')
      .order('desc')
      .collect()
  }

  if (coverUp !== undefined) rows = rows.filter((row) => row.coverUp === coverUp)
  if (touchUp !== undefined) rows = rows.filter((row) => row.touchUp === touchUp)

  return rows
}

export async function getInquiry(ctx: QueryCtx, id: Id<'inquiries'>) {
  await requireIdentity(ctx)
  return await ctx.db.get(id)
}

export async function getInquiryReferenceImages(ctx: QueryCtx, inquiryId: Id<'inquiries'>) {
  await requireIdentity(ctx)

  const refs = await ctx.db
    .query('referenceImages')
    .withIndex('by_inquiry', (query) => query.eq('inquiryId', inquiryId))
    .collect()

  const urls = await Promise.all(refs.map((reference) => ctx.storage.getUrl(reference.storageId)))
  return urls.filter((url): url is string => url !== null)
}

export async function addInquiryReferenceImages(
  ctx: MutationCtx,
  inquiryId: Id<'inquiries'>,
  images: ReferenceImageInput[],
) {
  await requireIdentity(ctx)

  const uploadedAt = Date.now()
  await Promise.all(
    images.map((image) =>
      ctx.db.insert('referenceImages', {
        inquiryId,
        storageId: image.storageId,
        url: image.url,
        altText: image.altText,
        uploadedAt,
      }),
    ),
  )
}
