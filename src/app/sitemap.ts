import type { MetadataRoute } from 'next'
import { absoluteUrl, publicRoutes } from '@/lib/seo'

const lastModified = new Date('2026-05-10')

export default function sitemap(): MetadataRoute.Sitemap {
  return publicRoutes.map((route) => ({
    url: absoluteUrl(route.path),
    lastModified,
    changeFrequency: route.path === '/' ? 'weekly' : 'monthly',
    priority: route.priority,
  }))
}
