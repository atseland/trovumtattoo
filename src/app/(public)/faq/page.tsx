import Link from 'next/link'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const faqItems = [
  {
    question: 'Hvordan booker jeg en tatovering?',
    answer:
      'Du sender inn en forespørsel via booking-skjemaet på denne siden. Beskriv ideen din, last opp referansebilder hvis du har, og velg størrelse og ønsket plassering. Jeg tar kontakt innen 2–5 virkedager for å diskutere prosjektet videre.',
  },
  {
    question: 'Hva bør jeg sende inn?',
    answer:
      'Jo mer detaljer du gir, jo lettere er det å gi deg et godt tilbud. Send gjerne referansebilder av stilen du liker, bilder av plasseringen på kroppen, og beskriv motivet så nøyaktig som mulig. Det er ikke nødvendig å ha en ferdig idé — vi kan utvikle konseptet sammen.',
  },
  {
    question: 'Tar du cover-up?',
    answer:
      'Ja, jeg tar cover-up-jobber, men de krever ekstra planlegging. Send inn bilder av tatoveringen som skal dekkes, og beskriv hva du ønsker i stedet. Ikke alle cover-ups er mulige, men jeg vurderer hvert tilfelle individuelt.',
  },
  {
    question: 'Hva koster en tatovering?',
    answer:
      'Prisen avhenger av størrelse, kompleksitet og plassering. Enkle, små design starter fra 1500 kr. Større prosjekter prises etter time eller som en total pris for hele jobben. Du får alltid et estimat før vi avtaler noe.',
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

export default function FaqPage() {
  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '48px 20px' }}>
      <div style={{ marginBottom: '16px' }}>
        <Link
          href='/'
          style={{ color: '#7a6e62', fontSize: '0.8rem', textDecoration: 'none' }}
        >
          ← Tilbake til forsiden
        </Link>
      </div>

      <h1
        className='font-serif italic'
        style={{ color: '#c9b99a', fontSize: '2rem', marginBottom: '8px' }}
      >
        Vanlige spørsmål
      </h1>
      <p style={{ color: '#7a6e62', marginBottom: '40px', fontSize: '0.9rem' }}>
        Alt du lurer på om prosessen, priser og praktisk informasjon.
      </p>

      <Accordion type='single' collapsible className='w-full' style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {faqItems.map((item, i) => (
          <AccordionItem
            key={i}
            value={`item-${i}`}
            style={{
              border: '1px solid #2a2724',
              borderRadius: '6px',
              background: '#141210',
              padding: '0 4px',
            }}
          >
            <AccordionTrigger
              style={{
                color: '#c9b99a',
                fontSize: '0.95rem',
                fontWeight: '500',
                textAlign: 'left',
                padding: '16px 12px',
              }}
            >
              {item.question}
            </AccordionTrigger>
            <AccordionContent
              style={{
                color: '#7a6e62',
                fontSize: '0.875rem',
                lineHeight: '1.7',
                padding: '0 12px 16px',
              }}
            >
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <div style={{ marginTop: '48px', padding: '24px', background: '#141210', border: '1px solid #2a2724', borderRadius: '8px' }}>
        <p style={{ color: '#c9b99a', fontSize: '0.9rem', marginBottom: '12px' }}>
          Fant du ikke svar på det du lurte på?
        </p>
        <Link
          href='/book'
          style={{
            display: 'inline-block',
            padding: '12px 24px',
            background: '#c9933a',
            color: '#0d0c0b',
            borderRadius: '4px',
            textDecoration: 'none',
            fontWeight: '600',
            fontSize: '0.875rem',
          }}
        >
          Send en forespørsel
        </Link>
      </div>
    </div>
  )
}
