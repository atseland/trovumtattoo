import type { Metadata } from 'next'
import { Layout11Home } from '@/components/public/home/Layout11Home'
import { absoluteUrl, getPublicRoute, siteName } from '@/lib/seo'

const route = getPublicRoute('/')!

export const metadata: Metadata = {
  title: route.title,
  description: route.description,
  alternates: { canonical: absoluteUrl(route.path) },
  openGraph: {
    title: route.title,
    description: route.description,
    url: absoluteUrl(route.path),
    siteName,
    type: 'website',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: route.title,
    description: route.description,
    images: [absoluteUrl('/og-image.jpg')],
  },
}

export default function PublicHomePage() {
  return <Layout11Home />
}
