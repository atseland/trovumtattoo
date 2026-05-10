'use client'

const TARGET_REFERENCE_IMAGE_BYTES = 1.5 * 1024 * 1024
const MAX_REFERENCE_IMAGE_BYTES = 3 * 1024 * 1024
const MAX_REFERENCE_IMAGE_EDGE = 2560
const OUTPUT_TYPE = 'image/jpeg'
const MIN_QUALITY = 0.78
const QUALITY_STEP = 0.04

type DecodedImage = CanvasImageSource & {
  width?: number
  height?: number
  naturalWidth?: number
  naturalHeight?: number
  close?: () => void
}

function getImageDimensions(image: DecodedImage) {
  const width = image.width ?? image.naturalWidth ?? 0
  const height = image.height ?? image.naturalHeight ?? 0
  if (width <= 0 || height <= 0) throw new Error('Could not read image dimensions')
  return { width, height }
}

function getScaledDimensions(width: number, height: number) {
  const longestEdge = Math.max(width, height)
  if (longestEdge <= MAX_REFERENCE_IMAGE_EDGE) return { width, height }

  const scale = MAX_REFERENCE_IMAGE_EDGE / longestEdge
  return {
    width: Math.round(width * scale),
    height: Math.round(height * scale),
  }
}

async function decodeImage(file: File): Promise<DecodedImage> {
  if ('createImageBitmap' in window) {
    return await createImageBitmap(file)
  }

  const objectUrl = URL.createObjectURL(file)
  try {
    const image = new Image()
    image.decoding = 'async'
    image.src = objectUrl
    await image.decode()
    return image
  } finally {
    URL.revokeObjectURL(objectUrl)
  }
}

function canvasToBlob(canvas: HTMLCanvasElement, quality: number) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Could not optimize image'))
          return
        }
        resolve(blob)
      },
      OUTPUT_TYPE,
      quality,
    )
  })
}

function getOptimizedFileName(fileName: string) {
  return fileName.replace(/\.[^/.]+$/, '') || 'reference-image'
}

export function isReferenceImageWithinFallbackLimit(file: File) {
  return file.size <= MAX_REFERENCE_IMAGE_BYTES
}

export async function optimizeReferenceImage(file: File) {
  if (file.size <= TARGET_REFERENCE_IMAGE_BYTES) return file

  const decodedImage = await decodeImage(file)

  try {
    const originalDimensions = getImageDimensions(decodedImage)
    const scaledDimensions = getScaledDimensions(originalDimensions.width, originalDimensions.height)
    const canvas = document.createElement('canvas')
    canvas.width = scaledDimensions.width
    canvas.height = scaledDimensions.height

    const context = canvas.getContext('2d')
    if (!context) throw new Error('Could not prepare image optimizer')

    context.fillStyle = '#ffffff'
    context.fillRect(0, 0, scaledDimensions.width, scaledDimensions.height)
    context.drawImage(decodedImage, 0, 0, scaledDimensions.width, scaledDimensions.height)

    let bestBlob: Blob | null = null
    for (let quality = 0.9; quality >= MIN_QUALITY; quality -= QUALITY_STEP) {
      const blob = await canvasToBlob(canvas, Number(quality.toFixed(2)))
      bestBlob = blob
      if (blob.size <= TARGET_REFERENCE_IMAGE_BYTES) break
    }

    if (!bestBlob) throw new Error('Could not optimize image')
    if (bestBlob.size > MAX_REFERENCE_IMAGE_BYTES) {
      throw new Error('Optimized image is still too large')
    }

    return new File([bestBlob], `${getOptimizedFileName(file.name)}.jpg`, {
      type: OUTPUT_TYPE,
      lastModified: Date.now(),
    })
  } finally {
    decodedImage.close?.()
  }
}
