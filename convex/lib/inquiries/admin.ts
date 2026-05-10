import type { Id } from '../../_generated/dataModel'
import type { MutationCtx, QueryCtx } from '../../_generated/server'
import { requireAdmin } from '../adminAuth'

interface InquiryListFilters {
  status?: string
  coverUp?: boolean
  touchUp?: boolean
  archived?: boolean
}

export interface ReferenceImageInput {
  storageId: Id<'_storage'>
  url: string
  altText?: string
}

async function requireIdentity(ctx: QueryCtx | MutationCtx) {
  await requireAdmin(ctx)
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
      .withIndex('by_status_archived_createdAt', (query) =>
        query.eq('status', status).eq('archivedAt', undefined)
      )
      .order('desc')
      .collect()
  } else {
    rows = await ctx.db
      .query('inquiries')
      .withIndex('by_archived_createdAt', (query) => query.eq('archivedAt', undefined))
      .order('desc')
      .collect()
  }

  if (coverUp !== undefined) rows = rows.filter((row) => row.coverUp === coverUp)
  if (touchUp !== undefined) rows = rows.filter((row) => row.touchUp === touchUp)

  return rows
}

export async function listArchivedInquiries(ctx: QueryCtx) {
  await requireIdentity(ctx)

  const rows = await ctx.db
    .query('inquiries')
    .withIndex('by_archived_createdAt', (query) => query.gt('archivedAt', 0))
    .order('desc')
    .collect()

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

export async function archiveInquiry(ctx: MutationCtx, id: Id<'inquiries'>, reason?: string) {
  const identity = await requireAdmin(ctx)

  const inquiry = await ctx.db.get(id)
  if (!inquiry) throw new Error('Inquiry not found')

  await ctx.db.patch(id, {
    archivedAt: Date.now(),
    archivedBy: identity.subject,
    archiveReason: reason,
  })
  await ctx.db.insert('activityLog', {
    entityType: 'inquiry',
    entityId: id,
    action: 'archived',
    payload: reason ? { reason } : undefined,
    createdAt: Date.now(),
  })
}

export async function restoreInquiry(ctx: MutationCtx, id: Id<'inquiries'>) {
  await requireIdentity(ctx)

  const inquiry = await ctx.db.get(id)
  if (!inquiry) throw new Error('Inquiry not found')

  await ctx.db.patch(id, {
    archivedAt: undefined,
    archivedBy: undefined,
    archiveReason: undefined,
  })
  await ctx.db.insert('activityLog', {
    entityType: 'inquiry',
    entityId: id,
    action: 'restored',
    createdAt: Date.now(),
  })
}

export async function permanentlyDeleteInquiry(ctx: MutationCtx, id: Id<'inquiries'>) {
  await requireIdentity(ctx)

  const inquiry = await ctx.db.get(id)
  if (!inquiry) throw new Error('Inquiry not found')

  const linkedProjects = await ctx.db
    .query('projects')
    .withIndex('by_inquiry', (query) => query.eq('inquiryId', id))
    .first()
  if (linkedProjects) {
    throw new Error('Forespørselen er koblet til et prosjekt og kan ikke slettes permanent.')
  }

  const referenceImages = await ctx.db
    .query('referenceImages')
    .withIndex('by_inquiry', (query) => query.eq('inquiryId', id))
    .collect()
  for (const image of referenceImages) {
    await ctx.storage.delete(image.storageId)
    await ctx.db.delete(image._id)
  }

  const activityEntries = await ctx.db
    .query('activityLog')
    .withIndex('by_entity', (query) => query.eq('entityType', 'inquiry').eq('entityId', id))
    .collect()
  await Promise.all(activityEntries.map((entry) => ctx.db.delete(entry._id)))

  const notifications = await ctx.db
    .query('notifications')
    .withIndex('by_related_entity', (query) =>
      query.eq('relatedEntityType', 'inquiry').eq('relatedEntityId', id)
    )
    .collect()
  await Promise.all(
    notifications.map((notification) => ctx.db.delete(notification._id)),
  )

  await ctx.db.delete(id)
}
