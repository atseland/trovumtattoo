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
  url: string
  altText?: string
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
  if (images.length > 10) throw new Error('Du kan maks laste opp 10 referansebilder')

  for (const image of images) {
    assertStringLength(image.url, 'referenceImageUrl', 1, 2_000)
    assertOptionalStringLength(image.altText, 'referenceImageAltText', 200)
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
  const inquiryId = await ctx.db.insert('inquiries', {
    ...args,
    status: 'Ny',
    createdAt,
  })

  await logInquiryCreated(ctx, inquiryId, args.name, createdAt)
  return inquiryId
}

export async function addReferenceImagesToInquiry(
  ctx: MutationCtx,
  inquiryId: Id<'inquiries'>,
  images: PublicReferenceImageInput[],
) {
  assertPublicReferenceImages(images)

  const inquiry = await ctx.db.get(inquiryId)
  if (!inquiry) throw new Error('Inquiry not found')

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
