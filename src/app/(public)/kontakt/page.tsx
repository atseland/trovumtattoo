import type { Metadata } from 'next'
import { ContactActions } from '@/components/public/ContactActions'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { Rule } from '@/components/ui/Rule'
import {
  absoluteUrl,
  businessAddress,
  businessEmail,
  businessPhoneDisplay,
  facebookProfileUrl,
  getPublicRoute,
  instagramMessageUrl,
} from '@/lib/seo'

const route = getPublicRoute('/kontakt')!

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

export default function ContactPage() {
  return (
    <div className='mx-auto max-w-xl px-6 py-12 lg:px-12'>
      <Eyebrow withLine className='mb-4'>Kontakt</Eyebrow>
      <h1 className='mb-2 font-serif text-[clamp(32px,5vw,48px)] italic leading-[1.1] tracking-[-0.02em] text-paper'>
        Send melding
      </h1>
      <div className='mb-8 mt-8 border border-rule bg-panel px-5 py-5'>
        <p className='font-sans text-[10px] uppercase tracking-[0.14em] text-nav'>E-post og studio</p>
        <p className='mt-2 font-sans text-[15px] text-paper'>{businessEmail}</p>
        <p className='mt-2 font-sans text-[15px] text-paper'>{businessPhoneDisplay}</p>
        <p className='mt-2 font-sans text-[13px] leading-[1.6] text-body'>
          Tigr Tattoo, {businessAddress.streetAddress}, {businessAddress.postalCode} {businessAddress.addressLocality}.
          Instagram DM: {instagramMessageUrl}
        </p>
        <p className='mt-2 font-sans text-[13px] leading-[1.6] text-body'>
          Facebook: {facebookProfileUrl}
        </p>
      </div>
      <Rule className='mb-8' />
      <ContactActions />
    </div>
  )
}
