'use client'

import type { ReactNode } from 'react'
import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import { Rule } from '@/components/ui/Rule'
import { Btn } from '@/components/ui/Btn'
import { facebookProfileUrl, instagramMessageUrl } from '@/lib/seo'

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
  if (external || href.startsWith('sms:') || href.startsWith('tel:')) {
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
        Standard vei er å sende inn en <InlineLink href='/book'>bookingforespørsel</InlineLink>.
        Hvis du er usikker på noe før du sender inn, kan du sende melding via{' '}
        <InlineLink href={instagramMessageUrl} external>Instagram</InlineLink> eller{' '}
        <InlineLink href={facebookProfileUrl} external>Facebook</InlineLink>.
      </>
    ),
  },
  {
    question: 'Hva bør jeg sende inn?',
    answer:
      'Du blir guidet gjennom prosessen i bookingforespørselen. Der fyller du inn kontaktinfo, motividé, plassering, størrelse, ønsket tidsrom og referansebilder hvis du har det.',
  },
  {
    question: 'Tar du cover-up?',
    answer:
      'Ja, jeg tar cover-up-jobber, men de krever ekstra planlegging. Send inn bilder av tatoveringen som skal dekkes, og legg ved referansebilder eller en beskrivelse av det nye motivet.',
  },
  {
    question: 'Hva koster en tatovering?',
    answer:
      'Prisen avhenger av størrelse, kompleksitet, plassering og tidsbruk. Send inn en bookingforespørsel, så får du et konkret estimat før vi avtaler noe. Minstepris er 1000 kr.',
  },
  {
    question: 'Hvordan fungerer depositum?',
    answer:
      'Etter at vi er blitt enige om prosjektet, pris og tidspunkt, betaler du et depositum. Innbetaling av depositum bekrefter booking og timebestilling. Depositumet trekkes fra totalprisen, er ikke et tillegg, og refunderes ikke ved avlysning.',
  },
  {
    question: 'Hvor lang tid tar det å få svar?',
    answer:
      'Så raskt som mulig innen 3 virkedager.',
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

      <div className='flex flex-col gap-8'>
        <div className='flex flex-col gap-4'>
          <p className='font-sans text-[14px] text-body'>Har du en ide du vil utforske?</p>
          <Btn href='/book' variant='action-primary' className='max-w-xs'>
            Send bookingforespørsel
          </Btn>
        </div>

        <div className='flex flex-col gap-4'>
          <p className='font-sans text-[14px] text-body'>Fant du ikke det du lurte på?</p>
          <Btn href='/kontakt' variant='action-primary' className='max-w-xs'>
            Kontakt
          </Btn>
        </div>
      </div>
    </>
  )
}
