import { describe, expect, it } from 'vitest'
import {
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
})
