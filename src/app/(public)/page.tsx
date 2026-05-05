import type { Metadata } from 'next'
import { Layout11Home } from '@/components/public/home/Layout11Home'

export const metadata: Metadata = {
  title: 'Trovum Tattoo — Dark art og blackwork i Sandvika',
  description: 'Dark art, blackwork og black and grey tatoveringer hos Tigr Tattoo i Sandvika.',
  alternates: { canonical: 'https://trovumtattoo.no' },
  openGraph: {
    title: 'Trovum Tattoo',
    description: 'Dark art, blackwork og black and grey tatoveringer hos Tigr Tattoo i Sandvika.',
    url: 'https://trovumtattoo.no',
    type: 'website',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['https://trovumtattoo.no/og-image.jpg'],
  },
}

export default function PublicHomePage() {
  return <Layout11Home />
}
