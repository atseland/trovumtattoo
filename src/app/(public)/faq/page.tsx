import type { Metadata } from 'next'
import { LinkI } from '@/components/ui/LinkI'
import { Eyebrow } from '@/components/ui/Eyebrow'
import FaqAccordion from './FaqAccordion'
import { absoluteUrl, getPublicRoute } from '@/lib/seo'

const route = getPublicRoute('/faq')!

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

export default function FaqPage() {
  return (
    <div className='mx-auto max-w-2xl px-6 lg:px-12 py-12'>
      <div className='mb-6'>
        <LinkI href='/'>← Tilbake</LinkI>
      </div>

      <Eyebrow withLine className='mb-4'>FAQ</Eyebrow>
      <h1 className='font-serif italic text-[clamp(32px,5vw,48px)] text-paper leading-[1.1] tracking-[-0.02em] mb-2'>
        Spørsmål og svar
      </h1>

      <FaqAccordion />
    </div>
  )
}
