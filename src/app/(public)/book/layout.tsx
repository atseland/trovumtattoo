import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Book tatovering | Trovum Tattoo',
  description:
    'Send inn din bookingforespørsel til Trovum Tattoo. Beskriv ideen din, last opp referansebilder og velg størrelse og plassering.',
  alternates: { canonical: 'https://trovumtattoo.no/book' },
  openGraph: {
    title: 'Book tatovering | Trovum Tattoo',
    description: 'Send din forespørsel om tatovering til Trovum Tattoo i Oslo.',
    url: 'https://trovumtattoo.no/book',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['https://trovumtattoo.no/og-image.jpg'],
  },
}

export default function BookLayout({ children }: { children: React.ReactNode }) {
  return children
}
