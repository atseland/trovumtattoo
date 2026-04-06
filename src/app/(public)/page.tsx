import type { Metadata } from 'next'
import Image from 'next/image'
import Script from 'next/script'
import { Logo } from '@/components/Logo'
import { Btn } from '@/components/ui/Btn'
import { Eyebrow } from '@/components/ui/Eyebrow'
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
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'TattooParlor',
  name: 'Trovum Tattoo',
  description: 'Custom tatovering i Sandvika. Dark art, blackwork, dark fantasy, black and grey, realisme og semi-realism.',
  url: 'https://trovumtattoo.no',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Elias Smithsvei 27',
    addressLocality: 'Sandvika',
    postalCode: '1337',
    addressCountry: 'NO',
  },
  sameAs: [
    'https://www.instagram.com/trovumtattoo/',
    'https://www.tiktok.com/@ellenkristinetrovum',
  ],
  priceRange: 'Fra 1000 NOK',
}

const artworks = [
  '/artworks/Art1.png',
  '/artworks/Art2.png',
  '/artworks/Art3.png',
  '/artworks/Art4.png',
  '/artworks/Art5.png',
  '/artworks/Art6.png',
  '/artworks/Art7.png',
]

const steps = [
  { num: '01', title: 'Send forespørsel', body: 'Fyll ut bookingskjemaet med ideen din, størrelse, plassering og referansebilder.' },
  { num: '02', title: 'Konsultasjon og estimat', body: 'Vi gjennomgår forespørselen din og sender et prisestimat og mulige tidspunkter.' },
  { num: '03', title: 'Book og betal depositum', body: 'Bekreft time og betal depositum for å sikre plassen din.' },
]

const styles = ['Dark art', 'Blackwork', 'Realism', 'Custom design', 'Dark fantasy', 'Black & grey']

export default function PublicHomePage() {
  return (
    <div>
      <Script
        id='json-ld-tattoo-parlor'
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className='relative flex min-h-[100svh] flex-col justify-center px-pad py-20 overflow-hidden'>
        {/* Logo watermark */}
        <div className='absolute inset-0 flex items-center justify-center pointer-events-none select-none'>
          <Logo context='hero-watermark' />
        </div>

        <div className='relative z-10 max-w-[600px]'>
          <Eyebrow withLine className='mb-6'>Tatovør i Sandvika</Eyebrow>
          <h1 className='font-serif italic text-[44px] md:text-[clamp(48px,7vw,72px)] text-paper leading-[0.92] tracking-[-0.025em] mb-6'>
            Dark art &amp; custom design
          </h1>
          <p className='font-serif italic text-[17px] leading-[1.4] max-w-[28ch] mb-10' style={{ color: 'rgba(237,233,230,0.60)' }}>
            Skreddersydde tatoveringer fra bunnen av — hvert motiv tegnet for deg.
          </p>
          <Btn href='/book' variant='action-cta' className='max-w-sm'>
            Send bookingforespørsel
          </Btn>
        </div>
      </section>

      <Rule />

      {/* Artist intro */}
      <section className='px-pad py-16'>
        <div className='mx-auto max-w-2xl'>
          <Eyebrow withLine className='mb-4'>Om tatovøren</Eyebrow>
          <div className='flex flex-col md:flex-row gap-8 items-start'>
            <div className='shrink-0'>
              <Image
                src='/profilbilde.jpeg'
                alt='Trovum Tattoo'
                width={88}
                height={88}
                className='object-cover'
                style={{
                  filter: 'grayscale(20%) contrast(1.05)',
                  border: '1px solid var(--rule-heavy)',
                }}
              />
            </div>
            <div>
              <h2 className='font-serif italic text-[clamp(22px,3vw,30px)] text-paper leading-[1.1] tracking-[-0.02em] mb-4'>
                Trovum Tattoo
              </h2>
              <p className='font-sans text-[13px] md:text-[14px] text-body leading-[1.8] max-w-[48ch]'>
                Spesialiserer seg på dark art, blackwork, realism og custom design. Hvert arbeid er tegnet fra bunnen av —
                skreddersydd til deg og kroppen din. Basert i Sandvika.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Rule />

      {/* Portfolio grid */}
      <section className='px-pad py-16'>
        <div className='mx-auto max-w-4xl'>
          <Eyebrow withLine className='mb-6'>Portfolio</Eyebrow>
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2'>
            {artworks.map((src, i) => (
              <div key={src} className='aspect-square overflow-hidden'>
                <Image
                  src={src}
                  alt={`Portfolio-bilde ${i + 1}`}
                  width={400}
                  height={400}
                  className='w-full h-full object-cover'
                  style={{ filter: 'grayscale(20%) contrast(1.05)' }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <Rule />

      {/* Stilretninger */}
      <section className='px-pad py-16'>
        <div className='mx-auto max-w-2xl'>
          <Eyebrow withLine className='mb-4'>Spesialiseringer</Eyebrow>
          <h2 className='font-serif italic text-[clamp(22px,3vw,30px)] text-paper leading-[1.1] tracking-[-0.02em] mb-6'>
            Stilretninger
          </h2>
          <ul className='grid grid-cols-2 gap-3'>
            {styles.map((style) => (
              <li key={style} className='flex items-center gap-3'>
                <span className='block w-4 h-px bg-index-num shrink-0' />
                <span className='font-sans text-[13px] text-body'>{style}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Rule />

      {/* Process steps */}
      <section className='px-pad py-16'>
        <div className='mx-auto max-w-2xl'>
          <Eyebrow withLine className='mb-4'>Prosessen</Eyebrow>
          <h2 className='font-serif italic text-[clamp(22px,3vw,30px)] text-paper leading-[1.1] tracking-[-0.02em] mb-10'>
            Slik fungerer det
          </h2>
          <div className='flex flex-col gap-8'>
            {steps.map((step) => (
              <div key={step.num} className='flex gap-5'>
                <span className='shrink-0 font-mono text-[8px] tracking-[0.24em] uppercase text-index-num pt-1'>
                  {step.num}
                </span>
                <div>
                  <h3 className='font-sans font-medium text-[14px] text-paper mb-1'>{step.title}</h3>
                  <p className='font-sans text-[13px] text-body leading-[1.8] max-w-[48ch]'>{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Rule />

      {/* CTA */}
      <section className='px-pad py-20 text-center'>
        <Eyebrow withLine className='mb-4 justify-center'>Book</Eyebrow>
        <h2 className='font-serif italic text-[clamp(32px,5vw,48px)] text-paper leading-[1.1] tracking-[-0.02em] mb-3'>
          Klar til å booke?
        </h2>
        <p className='font-sans text-[14px] text-body mb-8'>Ta første steg — fyll ut bookingskjemaet.</p>
        <div className='flex justify-center'>
          <Btn href='/book' variant='action-cta' className='max-w-sm'>
            Book tatovering
          </Btn>
        </div>
      </section>
    </div>
  )
}
