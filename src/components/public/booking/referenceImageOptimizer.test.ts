import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  isReferenceImageWithinFallbackLimit,
  optimizeReferenceImage,
} from '@/components/public/booking/referenceImageOptimizer'

function createImageFile(size: number, type = 'image/jpeg', name = 'reference.jpg') {
  return new File([new Uint8Array(size)], name, { type })
}

describe('reference image optimizer', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it('keeps images that are already within the target size', async () => {
    const file = createImageFile(1.4 * 1024 * 1024)

    await expect(optimizeReferenceImage(file)).resolves.toBe(file)
  })

  it('converts larger images to compressed jpeg files before upload', async () => {
    const close = vi.fn()
    const drawImage = vi.fn()
    const fillRect = vi.fn()
    const toBlob = vi.fn((callback: BlobCallback, type: string) => {
      callback(new Blob([new Uint8Array(900 * 1024)], { type }))
    })

    vi.stubGlobal('createImageBitmap', vi.fn(async () => ({
      width: 4200,
      height: 2800,
      close,
    })))
    const originalCreateElement = document.createElement.bind(document)
    vi.spyOn(document, 'createElement').mockImplementation((tagName) => {
      if (tagName !== 'canvas') return originalCreateElement(tagName)

      return {
        width: 0,
        height: 0,
        getContext: () => ({
          fillStyle: '',
          fillRect,
          drawImage,
        }),
        toBlob,
      } as unknown as HTMLCanvasElement
    })

    const result = await optimizeReferenceImage(createImageFile(7 * 1024 * 1024, 'image/png', 'reference.png'))

    expect(result.name).toBe('reference.jpg')
    expect(result.type).toBe('image/jpeg')
    expect(result.size).toBe(900 * 1024)
    expect(fillRect).toHaveBeenCalledWith(0, 0, 2560, 1707)
    expect(drawImage).toHaveBeenCalled()
    expect(close).toHaveBeenCalled()
  })

  it('uses a fallback limit above the compression target', () => {
    expect(isReferenceImageWithinFallbackLimit(createImageFile(3 * 1024 * 1024))).toBe(true)
    expect(isReferenceImageWithinFallbackLimit(createImageFile((3 * 1024 * 1024) + 1))).toBe(false)
  })
})
