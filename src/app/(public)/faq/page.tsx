import type { Metadata } from 'next'
import { LinkI } from '@/components/ui/LinkI'
import { Eyebrow } from '@/components/ui/Eyebrow'
import FaqAccordion from './FaqAccordion'

export const metadata: Metadata = {
  title: 'Vanlige spørsmål | Trovum Tattoo',
  description:
    'Svar på vanlige spørsmål om booking, priser, depositum, etterbehandling og prosessen hos Trovum Tattoo.',
  alternates: { canonical: 'https://trovumtattoo.no/faq' },
  openGraph: {
    title: 'Vanlige spørsmål | Trovum Tattoo',
    description: 'Alt du lurer på om prosessen, priser og praktisk informasjon.',
    url: 'https://trovumtattoo.no/faq',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['https://trovumtattoo.no/og-image.jpg'],
  },
}

export default function FaqPage() {
  return (
    <div className='mx-auto max-w-2xl px-pad py-12'>
      <div className='mb-6'>
        <LinkI href='/'>← Tilbake</LinkI>
      </div>

      <Eyebrow withLine className='mb-4'>FAQ</Eyebrow>
      <h1 className='font-serif italic text-[clamp(32px,5vw,48px)] text-paper leading-[1.1] tracking-[-0.02em] mb-2'>
        Vanlige spørsmål
      </h1>
      <p className='font-sans text-[14px] text-body mb-10 leading-[1.8]'>
        Alt du lurer på om prosessen, priser og praktisk informasjon.
      </p>

      <FaqAccordion />
    </div>
  )
}
