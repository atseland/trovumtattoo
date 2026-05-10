import type { Id } from '../../_generated/dataModel'
import type { MutationCtx } from '../../_generated/server'
import {
  assertEmailFormat,
  assertOptionalStringLength,
  assertStringLength,
} from '../validate'

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000
const RATE_LIMIT_MAX = 3

export interface CreateInquiryArgs {
  name: string
  email: string
  phone: string
  instagramHandle?: string
  description: string
  bodyPlacement: string
  size: string
  style: string
  budget?: string
  desiredTiming?: string
  firstTattoo: boolean
  coverUp: boolean
  touchUp: boolean
  extraNotes?: string
}

export interface PublicReferenceImageInput {
  storageId: Id<'_storage'>
  altText?: string
}

const REFERENCE_UPLOAD_TOKEN_TTL_MS = 30 * 60 * 1000
export const MAX_REFERENCE_IMAGES = 10
export const MAX_REFERENCE_IMAGE_BYTES = 8 * 1024 * 1024
export const ALLOWED_REFERENCE_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])

export function createReferenceUploadToken() {
  return crypto.randomUUID()
}

export function assertCreateInquiryArgs(args: CreateInquiryArgs) {
  assertStringLength(args.name, 'name', 1, 200)
  assertEmailFormat(args.email, 'email')
  assertStringLength(args.phone, 'phone', 3, 30)
  assertStringLength(args.description, 'description', 1, 10_000)
  assertStringLength(args.bodyPlacement, 'bodyPlacement', 1, 200)
  assertStringLength(args.size, 'size', 1, 100)
  assertStringLength(args.style, 'style', 1, 200)
  assertOptionalStringLength(args.budget, 'budget', 200)
  assertOptionalStringLength(args.desiredTiming, 'desiredTiming', 200)
  assertOptionalStringLength(args.extraNotes, 'extraNotes', 5_000)
  assertOptionalStringLength(args.instagramHandle, 'instagramHandle', 100)
}

export function assertPublicReferenceImages(images: PublicReferenceImageInput[]) {
  if (images.length > MAX_REFERENCE_IMAGES) throw new Error('Du kan maks laste opp 10 referansebilder')

  for (const image of images) {
    assertOptionalStringLength(image.altText, 'referenceImageAltText', 200)
  }
}

export function assertReferenceUploadToken(
  inquiry: {
    referenceUploadToken?: string
    referenceUploadTokenExpiresAt?: number
  },
  uploadToken: string,
  now = Date.now(),
) {
  if (!inquiry.referenceUploadToken || inquiry.referenceUploadToken !== uploadToken) {
    throw new Error('Invalid upload token')
  }
  if (!inquiry.referenceUploadTokenExpiresAt || inquiry.referenceUploadTokenExpiresAt < now) {
    throw new Error('Upload token expired')
  }
}

export function assertReferenceImageAttachLimit(
  existingStorageIds: Array<Id<'_storage'>>,
  images: PublicReferenceImageInput[],
) {
  const existing = new Set(existingStorageIds)
  const incoming = new Set<Id<'_storage'>>()

  if (existing.size + images.length > MAX_REFERENCE_IMAGES) {
    throw new Error('Du kan maks laste opp 10 referansebilder')
  }

  for (const image of images) {
    if (existing.has(image.storageId) || incoming.has(image.storageId)) {
      throw new Error('Referansebildet er allerede lagt til')
    }
    incoming.add(image.storageId)
  }
}

export function assertPublicReferenceImageMetadata(metadata: { size: number; contentType: string | null }) {
  if (!metadata.contentType || !ALLOWED_REFERENCE_IMAGE_TYPES.has(metadata.contentType)) {
    throw new Error('Kun JPG, PNG eller WebP bilder er tillatt')
  }
  if (metadata.size > MAX_REFERENCE_IMAGE_BYTES) {
    throw new Error('Referansebilder kan maks være 8 MB')
  }
}

export async function enforceInquiryRateLimit(ctx: MutationCtx, email: string) {
  const cutoff = Date.now() - RATE_LIMIT_WINDOW_MS
  const recent = await ctx.db
    .query('inquiries')
    .withIndex('by_createdAt', (query) => query.gte('createdAt', cutoff))
    .collect()

  const sameEmail = recent.filter((row) => row.email === email)
  if (sameEmail.length >= RATE_LIMIT_MAX) {
    throw new Error('For mange forespørsler. Vennligst vent litt.')
  }
}

async function logInquiryCreated(ctx: MutationCtx, inquiryId: Id<'inquiries'>, name: string, createdAt: number) {
  await ctx.db.insert('activityLog', {
    entityType: 'inquiry',
    entityId: inquiryId,
    action: 'created',
    createdAt,
  })

  await ctx.db.insert('notifications', {
    type: 'new-inquiry',
    title: 'Ny forespørsel',
    body: `${name} sendte inn en forespørsel`,
    relatedEntityType: 'inquiry',
    relatedEntityId: inquiryId,
    priority: 'high',
    isRead: false,
    createdAt,
  })
}

export async function createInquiryWithSideEffects(ctx: MutationCtx, args: CreateInquiryArgs) {
  assertCreateInquiryArgs(args)
  await enforceInquiryRateLimit(ctx, args.email)

  const createdAt = Date.now()
  const referenceUploadToken = createReferenceUploadToken()
  const inquiryId = await ctx.db.insert('inquiries', {
    ...args,
    status: 'Ny',
    referenceUploadToken,
    referenceUploadTokenExpiresAt: createdAt + REFERENCE_UPLOAD_TOKEN_TTL_MS,
    referenceUploadUrlIssuedCount: 0,
    createdAt,
  })

  await logInquiryCreated(ctx, inquiryId, args.name, createdAt)
  return { inquiryId, uploadToken: referenceUploadToken }
}

async function deleteReferenceUploads(ctx: MutationCtx, images: PublicReferenceImageInput[]) {
  await Promise.allSettled(images.map((image) => ctx.storage.delete(image.storageId)))
}

export async function addReferenceImagesToInquiry(
  ctx: MutationCtx,
  inquiryId: Id<'inquiries'>,
  uploadToken: string,
  images: PublicReferenceImageInput[],
) {
  assertPublicReferenceImages(images)

  const inquiry = await ctx.db.get(inquiryId)
  if (!inquiry) throw new Error('Inquiry not found')
  assertReferenceUploadToken(inquiry, uploadToken)

  const existingReferences = await ctx.db
    .query('referenceImages')
    .withIndex('by_inquiry', (query) => query.eq('inquiryId', inquiryId))
    .collect()
  const existingStorageIds = existingReferences.map((reference) => reference.storageId)

  try {
    assertReferenceImageAttachLimit(
      existingStorageIds,
      images,
    )
  } catch (error) {
    const existingStorageIdSet = new Set(existingStorageIds)
    await deleteReferenceUploads(ctx, images.filter((image) => !existingStorageIdSet.has(image.storageId)))
    throw error
  }

  const uploadedAt = Date.now()
  const validatedImages: Array<PublicReferenceImageInput & { url: string }> = []

  try {
    for (const image of images) {
      const metadata = await ctx.storage.getMetadata(image.storageId)
      if (!metadata) throw new Error('Reference image not found')

      assertPublicReferenceImageMetadata(metadata)

      const url = await ctx.storage.getUrl(image.storageId)
      if (!url) throw new Error('Reference image URL not found')
      validatedImages.push({ ...image, url })
    }
  } catch (error) {
    await deleteReferenceUploads(ctx, images)
    throw error
  }

  await Promise.all(
    validatedImages.map((image) =>
      ctx.db.insert('referenceImages', {
        inquiryId,
        storageId: image.storageId,
        url: image.url,
        altText: image.altText,
        uploadedAt,
      }),
    ),
  )

  await ctx.db.patch(inquiryId, {
    referenceUploadToken: undefined,
    referenceUploadTokenExpiresAt: undefined,
  })
}
