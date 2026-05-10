import type { ReactNode } from 'react'
import Image from 'next/image'
import { Phone } from 'lucide-react'
import { FaFacebookF, FaInstagram } from 'react-icons/fa6'
import { Btn } from '@/components/ui/Btn'
import { PortfolioCarousel } from '@/components/public/home/PortfolioCarousel'
import {
  businessAddress,
  businessPhoneHref,
  coreServiceLabels,
  facebookProfileUrl,
  instagramProfileUrl,
} from '@/lib/seo'

function Ornament({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      <span className='block h-px w-8 bg-rule-heavy md:w-12' />
      <span className='block h-1 w-1 rotate-45 border border-rule-heavy' />
      <span className='block h-px w-8 bg-rule-heavy md:w-12' />
    </div>
  )
}

function SocialIconLink({
  href,
  label,
  children,
  external = false,
}: {
  href: string
  label: string
  children: ReactNode
  external?: boolean
}) {
  return (
    <a
      href={href}
      aria-label={label}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className='flex h-9 w-9 items-center justify-center border border-rule text-nav transition-colors duration-200 hover:border-[rgba(237,233,230,0.34)] hover:text-paper'
    >
      {children}
    </a>
  )
}

export function Layout11Home() {
  return (
    <div className='min-h-screen bg-bg text-paper'>
      <section className='relative flex min-h-[calc(100svh-56px)] flex-col items-center justify-center px-6 pb-24 pt-16 text-center md:min-h-[calc(100vh-64px)] md:px-12 md:py-20'>
        <span className='mb-8 font-mono text-[9px] uppercase tracking-[0.28em] text-index-num md:mb-12'>
          Tigr Tattoo &middot; Sandvika
        </span>

        <h1 className='mb-4 font-serif text-[clamp(52px,12vw,120px)] italic leading-[0.88] tracking-[-0.04em] text-paper'>
          Trovum
        </h1>
        <h1
          className='mb-6 font-serif text-[clamp(52px,12vw,120px)] italic leading-[0.88] tracking-[-0.04em] md:mb-10'
          style={{ color: 'rgba(237,233,230,0.3)' }}
        >
          Tattoo
        </h1>

        <Ornament className='mb-8 md:mb-10' />

        <div className='mb-8 md:mb-10'>
          <Image
            src='/profilbilde_v2.jpeg'
            alt='Portrett av Trovum Tattoo, tatovør hos Tigr Tattoo i Sandvika'
            width={144}
            height={144}
            className='rounded-full object-cover'
            style={{
              width: 144,
              height: 144,
              filter: 'grayscale(20%) contrast(1.05)',
              border: '1px solid rgba(237,233,230,0.10)',
            }}
            priority
          />
        </div>

        <div className='flex items-center justify-center gap-3'>
          <SocialIconLink href={instagramProfileUrl} label='Se Trovum Tattoo på Instagram' external>
            <FaInstagram size={16} aria-hidden='true' />
          </SocialIconLink>
          <SocialIconLink href={facebookProfileUrl} label='Send melding på Facebook' external>
            <FaFacebookF size={14} aria-hidden='true' />
          </SocialIconLink>
          <SocialIconLink href={businessPhoneHref} label='Ring Trovum Tattoo'>
            <Phone size={15} strokeWidth={1.7} aria-hidden='true' />
          </SocialIconLink>
        </div>

        <div className='mt-10 flex flex-wrap justify-center gap-3 md:mt-8'>
          <Btn href='/book' variant='default' className='min-w-[148px]'>
            Bookingforespørsel
          </Btn>
          <Btn href='/kontakt' variant='default' className='min-w-[112px]'>
            Kontakt
          </Btn>
        </div>

        <a
          href='#arbeider'
          className='absolute inset-x-6 bottom-6 mx-auto flex w-auto max-w-xs flex-col items-center gap-2 transition-opacity duration-200 hover:opacity-60'
        >
          <span className='flex w-full items-center gap-3'>
            <span className='block h-px flex-1 bg-rule-heavy' />
            <span className='font-mono text-[8px] uppercase tracking-[0.22em] text-index-num'>
              se arbeider
            </span>
            <span className='block h-px flex-1 bg-rule-heavy' />
          </span>
          <svg width='10' height='12' viewBox='0 0 10 12' fill='none' className='text-index-num' aria-hidden='true'>
            <path d='M5 0v7M1 4l4 4 4-4' stroke='currentColor' strokeWidth='1' strokeLinecap='round' strokeLinejoin='round' />
            <path
              d='M1 7.5l4 4 4-4'
              stroke='currentColor'
              strokeWidth='1'
              strokeLinecap='round'
              strokeLinejoin='round'
              opacity='0.4'
            />
          </svg>
        </a>
      </section>

      <section id='arbeider' className='py-14 md:py-24'>
        <div className='mx-auto max-w-xl px-6 text-center md:px-12'>
          <p className='mb-8 font-serif text-[22px] italic leading-[1.15] tracking-[-0.02em] text-paper md:mb-12 md:text-[28px]'>
            Utvalgte arbeider som viser stilen min
          </p>
        </div>

        <PortfolioCarousel />
      </section>

      <section className='border-t border-rule px-6 py-14 md:px-12 md:py-24'>
        <div className='mx-auto max-w-xl'>
          <h2 className='mb-8 text-center font-serif text-[28px] italic leading-[1.1] tracking-[-0.02em] text-paper md:mb-10 md:text-[34px]'>
            Om meg
          </h2>

          <div className='mb-8 aspect-[4/3] overflow-hidden md:mb-10'>
            <Image
              src='/Bilde2_less.png'
              alt='Tatovering i arbeid hos Trovum Tattoo'
              width={800}
              height={600}
              className='h-full w-full object-cover object-center'
              style={{ filter: 'grayscale(15%) contrast(1.08)' }}
            />
          </div>

          <div className='text-center'>
            <p className='mb-4 font-sans text-[14px] leading-[1.8] text-body md:text-[15px]'>
              Jeg tatoverer hos Tigr Tattoo i Sandvika og har holdt på siden starten av 2023.
              Jeg jobber hovedsakelig i black and grey, blackwork, dark art og semi realism.
            </p>
            <p className='mb-6 font-sans text-[14px] leading-[1.8] text-body md:text-[15px]'>
              Jeg liker motiver med tyngde og kontrast - skaller, katedraler, flaggermus, blomster
              og mørkere fantasy-, film- og bandreferanser. Mye av det jeg lager ligger et sted
              mellom det makabre og det pene.
            </p>
            <p className='mb-6 font-sans text-[14px] leading-[1.8] text-body md:text-[15px]'>
              Tjenestene er custom tatoveringer innen dark art, blackwork, black and grey og semi realism.
              Studioet ligger hos Tigr Tattoo i {businessAddress.addressLocality}, med kort reisevei fra
              Bærum, Oslo og Asker.
            </p>

            <Ornament className='mb-5' />
            <p className='font-mono text-[9px] uppercase tracking-[0.22em] text-index-num'>
              {coreServiceLabels.join(' · ')}
            </p>
          </div>
        </div>
      </section>

      <section className='bg-panel px-6 py-14 md:px-12 md:py-24'>
        <div className='mx-auto max-w-xl text-center'>
          <h2 className='mb-6 font-serif text-[26px] italic leading-[1.1] tracking-[-0.02em] text-paper md:text-[32px]'>
            Ta kontakt
          </h2>

          <p className='mb-10 font-sans text-[14px] leading-[1.8] text-body md:text-[15px]'>
            Send meg en melding. Et motiv, en stemning, eller bare et bilde du har lagret lenge - det er nok til å starte en samtale.
          </p>

          <p className='mb-10 font-mono text-[10px] uppercase tracking-[0.16em] text-accent'>
            Tigr Tattoo &middot; {businessAddress.streetAddress}, {businessAddress.postalCode} {businessAddress.addressLocality}
          </p>

          <div className='mx-auto max-w-xs space-y-3'>
            <Btn href='/book' variant='action-cta' className='w-full'>
              Bookingforespørsel
            </Btn>
            <Btn href='/kontakt' variant='action' className='w-full'>
              Send melding
            </Btn>
            <Btn
              href='https://instagram.com/trovumtattoo'
              variant='action'
              className='w-full'
              target='_blank'
              rel='noopener noreferrer'
            >
              Se mer på Instagram
            </Btn>
          </div>
        </div>
      </section>
    </div>
  )
}
