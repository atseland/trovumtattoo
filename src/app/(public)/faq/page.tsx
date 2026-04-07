'use client'

import type { Metadata } from 'next'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { LinkI } from '@/components/ui/LinkI'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { Rule } from '@/components/ui/Rule'
import { Btn } from '@/components/ui/Btn'

const faqItems = [
  {
    question: 'Hvordan booker jeg en tatovering?',
    answer:
      'Du sender inn en forespørsel via booking-skjemaet på denne siden. Beskriv ideen din, last opp referansebilder hvis du har, og velg størrelse og ønsket plassering. Jeg tar kontakt innen 2–5 virkedager for å diskutere prosjektet videre.',
  },
  {
    question: 'Hva bør jeg sende inn?',
    answer:
      'Jo mer detaljer du gir, jo lettere er det å gi deg et godt tilbud. Send gjerne referansebilder av stilen du liker, bilder av plasseringen på kroppen, og beskriv motivet så nøyaktig som mulig. Det er ikke nødvendig å ha en ferdig idé — vi kan utvikle konseptet sammen gjennom dialog.',
  },
  {
    question: 'Tar du cover-up?',
    answer:
      'Ja, jeg tar cover-up-jobber, men de krever ekstra planlegging. Send inn bilder av tatoveringen som skal dekkes, og beskriv hva du ønsker i stedet. Ikke alle cover-ups er mulige, men jeg vurderer hvert tilfelle individuelt.',
  },
  {
    question: 'Hva koster en tatovering?',
    answer:
      'Prisen avhenger av størrelse, kompleksitet og plassering. Enkle, små design starter fra 1000 kr. Større prosjekter prises etter time eller som en total pris for hele jobben. Du får alltid et estimat før vi avtaler noe.',
  },
  {
    question: 'Hvordan fungerer depositum?',
    answer:
      'Etter at vi har blitt enige om prosjektet og pris, betaler du et depositum — vanligvis 500–1000 kr avhengig av prosjektets størrelse. Depositumet går av den totale prisen og bekrefter din booking. Det er ikke refunderbart om du avlyser uten varsel, men vi kan flytte timen mot et gebyr.',
  },
  {
    question: 'Hvor lang tid tar det å få svar?',
    answer:
      'Jeg svarer på alle forespørsler innen 2–5 virkedager. I travle perioder kan det ta litt lengre tid. Har du ikke hørt noe etter 5 virkedager, er du velkommen til å sende en oppfølging.',
  },
  {
    question: 'Hvordan fungerer etterbehandling?',
    answer:
      'Du får skriftlige etterbehandlingsinstruksjoner tilsendt etter sesjonen. Kort oppsummert: hold tatoveringen ren og fuktig de første dagene, unngå sol, basseng og hardt fysisk arbeid i to uker. Se etterbehandlingssiden for fullstendig guide.',
  },
]

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className='border-b border-rule'>
      <button
        onClick={() => setOpen((v) => !v)}
        className='flex w-full items-center justify-between gap-4 py-4 text-left font-sans text-[14px] text-paper min-h-[52px] transition-colors duration-[200ms] hover:text-accent'
        aria-expanded={open}
      >
        <span>{question}</span>
        <ChevronDown
          size={16}
          strokeWidth={1.5}
          className='shrink-0 text-nav transition-transform duration-[200ms]'
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>
      {open && (
        <div className='pb-4 font-sans text-[13px] text-body leading-[1.8] max-w-[48ch]'>
          {answer}
        </div>
      )}
    </div>
  )
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

      <div className='border-t border-rule'>
        {faqItems.map((item, i) => (
          <FaqItem key={i} question={item.question} answer={item.answer} />
        ))}
      </div>

      <Rule className='my-10' />

      <div className='flex flex-col gap-4'>
        <p className='font-sans text-[14px] text-body'>Fant du ikke svar på det du lurte på?</p>
        <Btn href='/book' variant='action-primary' className='max-w-xs'>
          Send en forespørsel
        </Btn>
      </div>
    </div>
  )
}
