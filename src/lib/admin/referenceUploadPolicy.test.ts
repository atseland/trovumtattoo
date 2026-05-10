import { describe, expect, it } from 'vitest'
import {
  assertReferenceImageAttachLimit,
  assertReferenceUploadToken,
  assertPublicReferenceImageMetadata,
  assertPublicReferenceImages,
  MAX_REFERENCE_IMAGE_BYTES,
} from '@convex/lib/inquiries/publicCreate'

describe('reference upload policy', () => {
  it('limits image count and metadata', () => {
    expect(() => assertPublicReferenceImages(Array.from({ length: 11 }, (_, index) => ({
      storageId: `storage-${index}` as never,
    })))).toThrow('maks laste opp 10')

    expect(() => assertPublicReferenceImageMetadata({
      contentType: 'image/jpeg',
      size: MAX_REFERENCE_IMAGE_BYTES,
    })).not.toThrow()
  })

  it('rejects unsupported or oversized uploads', () => {
    expect(() => assertPublicReferenceImageMetadata({
      contentType: 'application/pdf',
      size: 100,
    })).toThrow('JPG, PNG eller WebP')

    expect(() => assertPublicReferenceImageMetadata({
      contentType: 'image/png',
      size: MAX_REFERENCE_IMAGE_BYTES + 1,
    })).toThrow('maks være 8 MB')
  })

  it('requires a matching non-expired upload token', () => {
    const inquiry = {
      referenceUploadToken: 'token-1',
      referenceUploadTokenExpiresAt: 20,
    }

    expect(() => assertReferenceUploadToken(inquiry, 'token-1', 10)).not.toThrow()
    expect(() => assertReferenceUploadToken(inquiry, 'wrong-token', 10)).toThrow('Invalid upload token')
    expect(() => assertReferenceUploadToken(inquiry, 'token-1', 30)).toThrow('Upload token expired')
  })

  it('blocks replayed or over-limit reference attachments', () => {
    const existing = ['storage-1', 'storage-2'] as never[]

    expect(() => assertReferenceImageAttachLimit(existing, [
      { storageId: 'storage-3' as never },
    ])).not.toThrow()

    expect(() => assertReferenceImageAttachLimit(existing, [
      { storageId: 'storage-2' as never },
    ])).toThrow('allerede lagt til')

    expect(() => assertReferenceImageAttachLimit([], [
      { storageId: 'storage-3' as never },
      { storageId: 'storage-3' as never },
    ])).toThrow('allerede lagt til')

    expect(() => assertReferenceImageAttachLimit(existing, Array.from({ length: 9 }, (_, index) => ({
      storageId: `storage-new-${index}` as never,
    })))).toThrow('maks laste opp 10')
  })
})
