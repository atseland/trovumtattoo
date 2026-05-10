import type { Metadata } from 'next'
import { Btn } from '@/components/ui/Btn'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { absoluteUrl, getPublicRoute } from '@/lib/seo'

const route = getPublicRoute('/aftercare')!

export const metadata: Metadata = {
  title: route.title,
  description: route.description,
  alternates: { canonical: absoluteUrl(route.path) },
  openGraph: {
    title: route.title,
    description: route.description,
    url: absoluteUrl(route.path),
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: route.title,
    description: route.description,
    images: [absoluteUrl('/og-image.jpg')],
  },
}

export default function AftercarePage() {
  return (
    <div className='mx-auto max-w-2xl px-6 lg:px-12 py-12'>
      <Eyebrow withLine className='mb-4'>Etterbehandling</Eyebrow>
      <h1 className='font-serif italic text-[clamp(32px,5vw,48px)] text-paper leading-[1.1] tracking-[-0.02em] mb-2'>
        Etterbehandling
      </h1>
      <p className='font-sans text-[14px] text-body mb-10 leading-[1.8] max-w-[48ch]'>
        Du får med et eget etterbehandlingsskjema etter timen. Siden oppdateres med endelig tekst når dokumentet er klart.
      </p>
      <div className='border border-rule bg-panel px-5 py-5'>
        <p className='font-sans text-[13px] text-body leading-[1.8]'>
          Har du spørsmål etter timen, send melding direkte.
        </p>
      </div>
      <div className='mt-8 flex max-w-xs flex-col gap-3'>
        <Btn href='/kontakt' variant='action-primary'>
          Send melding
        </Btn>
        <Btn href='/faq' variant='action'>
          Se vanlige spørsmål
        </Btn>
      </div>
    </div>
  )
}
