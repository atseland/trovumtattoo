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
  },
}

export default function BookLayout({ children }: { children: React.ReactNode }) {
  return children
}
