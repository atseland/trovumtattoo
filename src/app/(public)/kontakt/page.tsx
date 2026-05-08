import type { Metadata } from 'next'
import { ContactActions } from '@/components/public/ContactActions'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { Rule } from '@/components/ui/Rule'

export const metadata: Metadata = {
  title: 'Send melding | Trovum Tattoo',
  description: 'Kontakt Trovum Tattoo på e-post eller Instagram.',
  alternates: { canonical: 'https://trovumtattoo.no/kontakt' },
  openGraph: {
    title: 'Send melding | Trovum Tattoo',
    description: 'Kontakt Trovum Tattoo på e-post eller Instagram.',
    url: 'https://trovumtattoo.no/kontakt',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
}

export default function ContactPage() {
  return (
    <div className='mx-auto max-w-xl px-6 py-12 lg:px-12'>
      <Eyebrow withLine className='mb-4'>Kontakt</Eyebrow>
      <h1 className='mb-2 font-serif text-[clamp(32px,5vw,48px)] italic leading-[1.1] tracking-[-0.02em] text-paper'>
        Send melding
      </h1>
      <p className='mb-8 font-sans text-[14px] leading-[1.8] text-body'>
        Velg kanalen som passer best. For nye tatoveringsprosjekter bør du sende en bookingforespørsel.
      </p>
      <div className='mb-8 border border-rule bg-panel px-5 py-5'>
        <p className='font-sans text-[10px] uppercase tracking-[0.14em] text-nav'>E-post</p>
        <p className='mt-2 font-sans text-[15px] text-paper'>kontakt@trovumtattoo.no</p>
      </div>
      <Rule className='mb-8' />
      <ContactActions />
    </div>
  )
}
