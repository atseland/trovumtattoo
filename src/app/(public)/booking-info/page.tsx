import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { LinkI } from '@/components/ui/LinkI'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { Rule } from '@/components/ui/Rule'
import { Btn } from '@/components/ui/Btn'
import { absoluteUrl, businessAddress, getPublicRoute } from '@/lib/seo'

const route = getPublicRoute('/booking-info')!

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

const listClasses = 'flex flex-col gap-2 font-sans text-[14px] leading-[1.8] text-body max-w-[48ch]'
const listItemClasses = 'flex gap-3'
const markerClasses = 'mt-[0.75em] block h-px w-4 shrink-0 bg-index-num'

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className={listClasses}>
      {items.map((item) => (
        <li key={item} className={listItemClasses}>
          <span className={markerClasses} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

function NumberedList({ items }: { items: string[] }) {
  return (
    <ol className='flex flex-col gap-3 font-sans text-[14px] leading-[1.8] text-body max-w-[48ch]'>
      {items.map((item, index) => (
        <li key={item} className='flex gap-4'>
          <span className='w-5 shrink-0 font-mono text-[10px] tracking-[0.16em] text-nav'>
            {String(index + 1).padStart(2, '0')}
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ol>
  )
}

function BodyText({ children }: { children: ReactNode }) {
  return (
    <p className='font-sans text-[14px] text-body leading-[1.8] max-w-[48ch]'>
      {children}
    </p>
  )
}

const sections = [
  {
    title: 'Booking skjer via bookingforespørsel',
    content: (
      <div className='flex flex-col gap-4'>
        <BodyText>
          For nye prosjekter bruker jeg bookingforespørselen. Der sender du inn kontaktinfo,
          motividé, plassering, størrelse, ønsket tidsrom og eventuelle referansebilder.
        </BodyText>
        <BodyText>
          Når forespørselen er sendt inn, tar jeg kontakt så fort jeg kan, innen 3 virkedager.
        </BodyText>
        <div>
          <Btn href='/book' variant='action-primary' className='sm:max-w-xs'>
            Send bookingforespørsel
          </Btn>
        </div>
      </div>
    ),
  },
  {
    title: 'Slik estimeres prisen',
    content: (
      <div className='flex flex-col gap-4'>
        <BodyText>Prisen baseres på:</BodyText>
        <BulletList
          items={[
            'Størrelse og kompleksitet.',
            'Estimert tidsbruk i studio.',
            'Plasseringens tilgjengelighet.',
            'Type prosjekt: ny tatovering, cover-up eller touch-up.',
          ]}
        />
        <BodyText>
          Pris vurderes etter informasjonen du sender inn i bookingforespørselen. Jo tydeligere motiv,
          størrelse, plassering og referanser er beskrevet, desto bedre kan estimatet bli.
        </BodyText>
        <BodyText>Du får alltid et konkret prisestimat via e-post før vi bekrefter booking.</BodyText>
      </div>
    ),
  },
  {
    title: 'Depositum og betalingsvilkår',
    highlighted: true,
    content: (
      <div className='flex flex-col gap-4'>
        <BodyText>
          Etter at vi er blitt enige om prosjektet, pris og tidspunkt, betaler du et depositum.
          Innbetaling av depositum bekrefter booking og timebestilling.
        </BodyText>
        <BulletList
          items={[
            'Depositumet trekkes fra totalprisen og er ikke et tillegg.',
            'Depositum refunderes ikke ved avlysning.',
            'Hvis du må flytte timen, må du gi beskjed minst 48 timer før avtalt tid for å beholde depositumet.',
          ]}
        />
        <BodyText>Resten av beløpet betales i studio på dagen. Vi aksepterer Vipps og kortbetaling.</BodyText>
      </div>
    ),
  },
  {
    title: 'Hva skjer etter at du har sendt inn forespørsel?',
    content: (
      <NumberedList
        items={[
          'Du sender forespørselen via skjemaet.',
          'Jeg bekrefter mottak innen 1-3 virkedager.',
          'Jeg sender et estimat og forslag til datoer.',
          'Vi diskuterer designet.',
          'Vi blir enige og bookingen bekreftes ved innbetaling av depositum.',
          'Ferdig design presenteres på tattoo-dagen.',
          'Etter timen får du med et etterbehandlingsskjema som hjelper deg gjennom helningsprosessen.',
        ]}
      />
    ),
  },
]

export default function BookingInfoPage() {
  return (
    <div className='mx-auto max-w-2xl px-6 lg:px-12 py-12'>
      <div className='mb-6'>
        <LinkI href='/'>← Tilbake</LinkI>
      </div>

      <Eyebrow withLine className='mb-4'>Informasjon</Eyebrow>
      <h1 className='font-serif italic text-[clamp(32px,5vw,48px)] text-paper leading-[1.1] tracking-[-0.02em] mb-2'>
        Slik fungerer bookingen
      </h1>
      <p className='font-sans text-[14px] text-body mb-10 leading-[1.8]'>
        Alt du trenger å vite om prosessen hos Trovum Tattoo i {businessAddress.addressLocality}
        {' '}— fra idé til ferdig tatovering innen dark art, blackwork, black and grey og semi realism.
      </p>

      <div className='flex flex-col gap-10'>
        {sections.map((section, i) => (
          <section key={i}>
            <h2 className='font-serif italic text-[clamp(22px,3vw,30px)] text-paper leading-[1.1] tracking-[-0.02em] mb-4'>
              {section.title}
            </h2>
            {section.highlighted ? (
              /* Highlighted info-celle for key information */
              <div
                className='px-5 py-4'
                style={{
                  background: 'linear-gradient(180deg, rgba(237,233,230,0.045), rgba(237,233,230,0.02))',
                  borderTop: '1px solid rgba(237,233,230,0.1)',
                  borderBottom: '1px solid rgba(237,233,230,0.1)',
                }}
              >
                {section.content}
              </div>
            ) : (
              section.content
            )}
            {i < sections.length - 1 && <Rule className='mt-10' />}
          </section>
        ))}
      </div>

      <Rule className='my-10' />

      <div className='flex flex-col sm:flex-row gap-4'>
        <Btn href='/book' variant='action-primary' className='sm:max-w-xs'>
          Send forespørsel
        </Btn>
        <Btn href='/faq' variant='sm'>
          Vanlige spørsmål
        </Btn>
      </div>
    </div>
  )
}
