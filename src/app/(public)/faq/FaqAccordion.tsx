'use client'

import type { ReactNode } from 'react'
import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import { Rule } from '@/components/ui/Rule'
import { Btn } from '@/components/ui/Btn'
import { businessPhoneDisplay, businessPhoneHref, facebookProfileUrl, instagramMessageUrl } from '@/lib/seo'

function InlineLink({
  href,
  children,
  external = false,
}: {
  href: string
  children: ReactNode
  external?: boolean
}) {
  const className = 'text-accent underline decoration-[rgba(160,148,136,0.34)] underline-offset-4 transition-colors hover:text-paper'
  if (external || href.startsWith('tel:')) {
    return (
      <a href={href} className={className} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined}>
        {children}
      </a>
    )
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  )
}

const faqItems = [
  {
    question: 'Hvordan booker jeg en tatovering?',
    answer: (
      <>
        Send melding via <InlineLink href={instagramMessageUrl} external>Instagram</InlineLink>,{' '}
        <InlineLink href={facebookProfileUrl} external>Facebook</InlineLink> eller{' '}
        <InlineLink href={businessPhoneHref}>{businessPhoneDisplay}</InlineLink>. Beskriv ideen din,
        cirka størrelse og ønsket plassering. Jeg tar kontakt innen 1-3 virkedager for å følge opp.
      </>
    ),
  },
  {
    question: 'Hva bør jeg sende inn?',
    answer:
      'Send en kort beskrivelse av motivet, ønsket plassering på kroppen, cirka størrelse og gjerne referansebilder av stil eller stemning du liker. Det er ikke nødvendig å ha en ferdig idé.',
  },
  {
    question: 'Tar du cover-up?',
    answer:
      'Ja, jeg tar cover-up-jobber, men de krever ekstra planlegging. Send inn bilder av tatoveringen som skal dekkes, og beskriv hva du ønsker i stedet.',
  },
  {
    question: 'Hva koster en tatovering?',
    answer:
      'Prisen avhenger av størrelse, kompleksitet, plassering og tidsbruk. Send inn en bookingforespørsel med motiv, ønsket størrelse, plassering og referanser, så får du et konkret estimat før vi avtaler noe. Minstepris er 1000 kr.',
  },
  {
    question: 'Hvordan fungerer depositum?',
    answer:
      'Prosessen er: bookingforespørsel -> oppfølging og avklaringer som klargjør for oppsetting av time og tegning. Tegning av tatovering starter ikke før depositum er betalt og timen er satt opp.',
  },
  {
    question: 'Hvor lang tid tar det å få svar?',
    answer:
      'Jeg svarer vanligvis innen 1-3 virkedager. I travle perioder kan det ta litt lengre tid.',
  },
  {
    question: 'Hvordan fungerer etterbehandling?',
    answer: (
      <>
        Du får med et etterbehandlingsskjema etter timen. Se også{' '}
        <InlineLink href='/aftercare'>etterbehandlingssiden</InlineLink> for mer informasjon.
      </>
    ),
  },
]

function FaqItem({ question, answer }: { question: string; answer: ReactNode }) {
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

export default function FaqAccordion() {
  return (
    <>
      <div className='border-t border-rule'>
        {faqItems.map((item, i) => (
          <FaqItem key={i} question={item.question} answer={item.answer} />
        ))}
      </div>

      <Rule className='my-10' />

      <div className='flex flex-col gap-4'>
        <p className='font-sans text-[14px] text-body'>Fant du ikke svar på det du lurte på?</p>
        <Btn href='/kontakt' variant='action-primary' className='max-w-xs'>
          Send melding
        </Btn>
      </div>
    </>
  )
}
