import type { Metadata } from 'next'
import Script from 'next/script'
import { HomeAbout } from '@/components/public/home/HomeAbout'
import { HomeCta } from '@/components/public/home/HomeCta'
import { HomeHero } from '@/components/public/home/HomeHero'
import { HomePortfolio } from '@/components/public/home/HomePortfolio'
import { HomeProcess } from '@/components/public/home/HomeProcess'
import { HomeStyles } from '@/components/public/home/HomeStyles'
import { homeArtworks, homeJsonLd, homeSteps, homeStyles } from '@/components/public/home/homeContent'
import { Rule } from '@/components/ui/Rule'

export const metadata: Metadata = {
  title: 'Trovum Tattoo — Tatovør i Sandvika',
  description: 'Custom tatovering i Sandvika. Dark art, blackwork, realism og semi-realism. Send bookingforespørsel i dag.',
  alternates: { canonical: 'https://trovumtattoo.no' },
  openGraph: {
    title: 'Trovum Tattoo — Tatovør i Sandvika',
    description: 'Custom tatovering: dark art, blackwork, realism.',
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
  return (
    <div>
      <Script
        id='json-ld-tattoo-parlor'
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd) }}
      />
      <HomeHero />
      <Rule />
      <HomeAbout />
      <Rule />
      <HomePortfolio artworks={homeArtworks} />
      <Rule />
      <HomeStyles styles={homeStyles} />
      <Rule />
      <HomeProcess steps={homeSteps} />
      <Rule />
      <HomeCta />
    </div>
  )
}
