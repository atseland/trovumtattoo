import type { Metadata } from 'next'
import { LinkI } from '@/components/ui/LinkI'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { Rule } from '@/components/ui/Rule'
import { Btn } from '@/components/ui/Btn'

export const metadata: Metadata = {
  title: 'Slik fungerer bookingen | Trovum Tattoo',
  description:
    'Alt du trenger å vite om bookingprosessen hos Trovum Tattoo — fra idé til ferdig tatovering, priser, depositum og hva du bør sende inn.',
  alternates: { canonical: 'https://trovumtattoo.no/booking-info' },
  openGraph: {
    title: 'Slik fungerer bookingen | Trovum Tattoo',
    description: 'Komplett guide til bookingprosessen hos Trovum Tattoo.',
    url: 'https://trovumtattoo.no/booking-info',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['https://trovumtattoo.no/og-image.jpg'],
  },
}

const sections = [
  {
    title: 'Hva slags prosjekter passer?',
    content: `Jeg jobber primært med dark art, blackwork, realism og custom design.
Prosjekter som passer godt: naturmotiver, botanikk, portretter, geometri og abstrakt ornamentikk.
Er du usikker, send gjerne en forespørsel — det verste som kan skje er at vi ikke
er riktig match for hverandre, og da kan jeg gjerne anbefale en kollega.`,
  },
  {
    title: 'Hva kunden bør sende inn',
    content: `For at jeg skal gi deg et godt estimat og en realistisk vurdering av prosjektet, trenger jeg:\n\n• Referansebilder (stiler du liker, motiver som inspirerer)\n• Bilde av plasseringen på kroppen, gjerne flere vinkler\n• Beskrivelse av motivet — jo mer konkret, jo bedre\n• Ønsket størrelse og om du er fleksibel på dette\n• Eventuelle spesielle krav (cover-up, eksisterende tatoveringer i nærheten, etc.)\n\nDu trenger ikke ha alt klart — vi kan utvikle konseptet sammen gjennom dialog.`,
  },
  {
    title: 'Slik estimeres prisen',
    content: `Prisen baseres på:\n\n• Størrelse og kompleksitet\n• Estimert tidsbruk i studio\n• Plasseringens tilgjengelighet (noen steder er vanskeligere å tatovere)\n• Om det er et cover-up-prosjekt\n\nSmå, enkle design: fra 1000 kr. Mellomstore prosjekter: 2500–5000 kr. Store, komplekse prosjekter: 6000 kr og oppover, gjerne over flere sesjoner. Du får alltid et konkret prisestimat via e-post før vi bekrefter booking.`,
  },
  {
    title: 'Depositum og betalingsvilkår',
    content: `Etter at vi er blitt enige om prosjektet og pris, betaler du et depositum på 500–1500 kr (avhengig av prosjektets størrelse). Depositumet:\n\n• Bekrefter din booking og sikrer at dato holdes for deg\n• Trekkes av den totale sluttprisen\n• Er ikke refunderbart ved avlysning uten minst 48 timers varsel\n\nResten av beløpet betales i studio på dagen. Vi aksepterer Vipps og kortbetaling.`,
  },
  {
    title: 'Hva skjer etter at du har sendt inn?',
    content: `1. Du sender forespørselen via skjemaet\n2. Jeg bekrefter mottak innen 2–5 virkedager\n3. Om prosjektet passer, sender jeg et estimat og forslag til datoer\n4. Vi diskuterer designet og gjør eventuelle justeringer\n5. Du betaler depositum og booking er bekreftet\n6. Ferdig design presenteres på tattoo-dagen\n7. Etter sesjonen sender jeg etterbehandlingsinstruksjoner på e-post`,
  },
]

export default function BookingInfoPage() {
  return (
    <div className='mx-auto max-w-2xl px-pad py-12'>
      <div className='mb-6'>
        <LinkI href='/'>← Tilbake</LinkI>
      </div>

      <Eyebrow withLine className='mb-4'>Informasjon</Eyebrow>
      <h1 className='font-serif italic text-[clamp(32px,5vw,48px)] text-paper leading-[1.1] tracking-[-0.02em] mb-2'>
        Slik fungerer bookingen
      </h1>
      <p className='font-sans text-[14px] text-body mb-10 leading-[1.8]'>
        Alt du trenger å vite om prosessen — fra idé til ferdig tatovering.
      </p>

      <div className='flex flex-col gap-10'>
        {sections.map((section, i) => (
          <section key={i}>
            <h2 className='font-serif italic text-[clamp(22px,3vw,30px)] text-paper leading-[1.1] tracking-[-0.02em] mb-4'>
              {section.title}
            </h2>
            {section.title === 'Depositum og betalingsvilkår' ? (
              /* Highlighted info-celle for key information */
              <div
                className='px-5 py-4 font-sans text-[14px] text-body leading-[1.8] whitespace-pre-line max-w-[48ch]'
                style={{
                  background: 'linear-gradient(180deg, rgba(237,233,230,0.045), rgba(237,233,230,0.02))',
                  borderTop: '1px solid rgba(237,233,230,0.1)',
                  borderBottom: '1px solid rgba(237,233,230,0.1)',
                }}
              >
                {section.content}
              </div>
            ) : (
              <p className='font-sans text-[14px] text-body leading-[1.8] whitespace-pre-line max-w-[48ch]'>
                {section.content}
              </p>
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
