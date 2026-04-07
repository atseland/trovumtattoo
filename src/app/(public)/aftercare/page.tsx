import type { Metadata } from 'next'
import { LinkI } from '@/components/ui/LinkI'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { Rule } from '@/components/ui/Rule'

export const metadata: Metadata = {
  title: 'Etterbehandling | Trovum Tattoo',
  description:
    'Komplett guide til etterbehandling av ny tatovering — dag-for-dag instruksjoner for riktig stell og heling.',
  alternates: { canonical: 'https://trovumtattoo.no/aftercare' },
  openGraph: {
    title: 'Etterbehandling | Trovum Tattoo',
    description: 'Dag-for-dag guide til etterbehandling av tatovering.',
    url: 'https://trovumtattoo.no/aftercare',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['https://trovumtattoo.no/og-image.jpg'],
  },
}

const steps = [
  {
    day: '01',
    title: 'Dag 1 — rett etter tatoveringen',
    instructions: [
      'Hold plastfolien på i 2–4 timer (eller til du er hjemme)',
      'Fjern folien forsiktig og skyll tatoveringen med lunkent vann og en mild, parfymefri såpe',
      'Tørk forsiktig med et rent papirhåndkle — ikke gni',
      'Påfør et tynt lag uparfymert fuktighetskrem (f.eks. Bepanthen, CeraVe eller A&D)',
      'La tatoveringen lufttørke i noen minutter før du kler på deg',
    ],
  },
  {
    day: '02',
    title: 'Dag 2–4 — første helingsuke',
    instructions: [
      'Vask tatoveringen 2–3 ganger daglig med mild såpe',
      'Påfør fuktighetskrem etter vask — et tynt, ikke-klebrig lag',
      'Unngå å dekke tatoveringen med tett klær — bomull er OK',
      'Ikke riv eller skrap om tatoveringen klør — klapp forsiktig over klærne',
      'Hold tatoveringen unna direkte sollys',
    ],
  },
  {
    day: '03',
    title: 'Dag 5–14 — skallingsfase',
    instructions: [
      'Tatoveringen vil begynne å skalle — dette er normalt',
      'Ikke riv av skall — la dem falle av naturlig',
      'Fortsett å fukte tatoveringen, men ikke overdriv',
      'Unngå bading i basseng, badstue og langvarig dusj i denne perioden',
      'Hold tatoveringen beskyttet fra solen — bruk løse klær',
    ],
  },
  {
    day: '04',
    title: 'Uke 3–6 — dyp heling',
    instructions: [
      'Tatoveringen kan se matt eller uklar ut — dette normaliserer seg',
      'Du kan nå bruke solkrem (SPF 50+) når tatoveringen er utendørs',
      'Unngå å plukke på noen gjenværende skall',
      'Om du opplever unormal rødhet, hevelse eller utflod — ta kontakt',
    ],
  },
]

const donts = [
  'Bade i hav, basseng eller badekar de første 2 ukene',
  'Sitte i badstue eller dampbad',
  'Bruke solkrem på fersk tatovering (første 2 uker)',
  'La hunder/katter slikke tatoveringen',
  'Intensiv trening som gir mye svette de første dagene',
]

export default function AftercarePage() {
  return (
    <div className='mx-auto max-w-2xl px-pad py-12'>
      <div className='mb-6'>
        <LinkI href='/'>← Tilbake</LinkI>
      </div>

      <Eyebrow withLine className='mb-4'>Guide</Eyebrow>
      <h1 className='font-serif italic text-[clamp(32px,5vw,48px)] text-paper leading-[1.1] tracking-[-0.02em] mb-2'>
        Etterbehandling
      </h1>
      <p className='font-sans text-[14px] text-body mb-10 leading-[1.8] max-w-[48ch]'>
        Riktig etterbehandling er avgjørende for at tatoveringen skal hele godt og beholde
        linjerenhet og fargedybde over tid.
      </p>

      <div className='flex flex-col gap-0'>
        {steps.map((step, i) => (
          <div key={step.day}>
            <div className='flex gap-5 py-6'>
              <span className='shrink-0 font-mono text-[8px] tracking-[0.24em] uppercase text-index-num pt-1'>
                {step.day}
              </span>
              <div>
                <h2 className='font-sans font-medium text-[14px] text-paper mb-3'>{step.title}</h2>
                <ul className='flex flex-col gap-2'>
                  {step.instructions.map((instruction, j) => (
                    <li key={j} className='flex gap-3 font-sans text-[13px] text-body leading-[1.8]'>
                      <span className='text-index-num shrink-0 mt-[1px]'>—</span>
                      {instruction}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {i < steps.length - 1 && <Rule />}
          </div>
        ))}
      </div>

      <Rule className='my-4' />

      {/* Don'ts highlighted cell */}
      <div
        className='px-5 py-4 mb-10'
        style={{
          background: 'linear-gradient(180deg, rgba(237,233,230,0.045), rgba(237,233,230,0.02))',
          borderTop: '1px solid rgba(237,233,230,0.1)',
          borderBottom: '1px solid rgba(237,233,230,0.1)',
        }}
      >
        <h2 className='font-sans font-medium text-[10px] tracking-[0.14em] uppercase text-nav mb-3'>Unngå dette under heling</h2>
        <ul className='flex flex-col gap-2'>
          {donts.map((item, i) => (
            <li key={i} className='flex gap-3 font-sans text-[13px] text-body leading-[1.8]'>
              <span className='text-index-num shrink-0'>×</span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      <Rule />

      <div className='pt-2'>
        <p className='font-sans text-[13px] text-body leading-[1.8] mb-3'>
          Har du spørsmål om helingsforløpet eller opplever noe unormalt? Send en melding — jeg hjelper deg gjerne.
        </p>
        <LinkI href='/faq'>Se vanlige spørsmål →</LinkI>
      </div>
    </div>
  )
}
