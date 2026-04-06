import Link from 'next/link'

const sections = [
  {
    title: 'Hva slags prosjekter passer?',
    content: `Jeg jobber primært med detaljrike svart/grå-tatoveringer, fineline og illustrativt arbeid.
Prosjekter som passer godt: naturmotiver, botanikk, portretter, geometri og abstrakt ornamentikk.
Jeg tar ikke lettering (tekst alene), diffuse watercolor uten kontur, eller rent dekorativt arbeid
uten konsept. Er du usikker, send gjerne en forespørsel — det verste som kan skje er at vi ikke
er riktig match for hverandre, og da kan jeg gjerne anbefale en kollega.`,
  },
  {
    title: 'Hva kunden bør sende inn',
    content: `For at jeg skal gi deg et godt estimat og en realistisk vurdering av prosjektet,
trenger jeg:\n\n• Referansebilder (stiler du liker, motiver som inspirerer)\n• Bilde av
plasseringen på kroppen, gjerne flere vinkler\n• Beskrivelse av motivet — jo mer konkret,
jo bedre\n• Ønsket størrelse og om du er fleksibel på dette\n• Eventuelle spesielle krav
(cover-up, eksisterende tatoveringer i nærheten, etc.)\n\nDu trenger ikke ha alt klart —
vi kan utvikle konseptet sammen gjennom dialog.`,
  },
  {
    title: 'Slik estimeres prisen',
    content: `Prisen baseres på:\n\n• Størrelse og kompleksitet\n• Estimert tidsbruk i studio\n•
Plasseringens tilgjengelighet (noen steder er vanskeligere å tatovere)\n• Om det er et
cover-up-prosjekt\n\nSmå, enkle design: fra 1500 kr. Mellomstore prosjekter: 2500–5000 kr.
Store, komplekse prosjekter: 6000 kr og oppover, gjerne over flere sesjoner.
Du får alltid et konkret prisestimat via e-post før vi bekrefter booking.`,
  },
  {
    title: 'Depositum og betalingsvilkår',
    content: `Etter at vi er blitt enige om prosjektet og pris, betaler du et depositum på
500–1500 kr (avhengig av prosjektets størrelse). Depositumet:\n\n• Bekrefter din booking
og sikrer at dato holdes for deg\n• Trekkes av den totale sluttprisen\n• Er ikke refunderbart
ved avlysning uten minst 48 timers varsel\n\nResten av beløpet betales i studio på dagen.
Vi aksepterer Vipps og kortbetaling. Faktura kan ordnes for bedrifter.`,
  },
  {
    title: 'Hva skjer etter at du har sendt inn?',
    content: `1. Du sender forespørselen via skjemaet\n2. Jeg bekrefter mottak innen 2–5 virkedager\n
3. Om prosjektet passer, sender jeg et estimat og forslag til datoer\n4. Vi diskuterer
designet og gjør eventuelle justeringer\n5. Du betaler depositum og booking er bekreftet\n
6. Ferdig design presenteres på tattoo-dagen — mindre justeringer kan gjøres der og da\n
7. Etter sesjonen sender jeg etterbehandlingsinstruksjoner på e-post`,
  },
]

export default function BookingInfoPage() {
  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '48px 20px' }}>
      <div style={{ marginBottom: '16px' }}>
        <Link href='/' style={{ color: '#7a6e62', fontSize: '0.8rem', textDecoration: 'none' }}>
          ← Tilbake til forsiden
        </Link>
      </div>

      <h1
        className='font-serif italic'
        style={{ color: '#c9b99a', fontSize: '2rem', marginBottom: '8px' }}
      >
        Slik fungerer bookingen
      </h1>
      <p style={{ color: '#7a6e62', marginBottom: '40px', fontSize: '0.9rem' }}>
        Alt du trenger å vite om prosessen — fra idé til ferdig tatovering.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {sections.map((section, i) => (
          <section key={i}>
            <h2
              style={{
                color: '#c9b99a',
                fontSize: '1.1rem',
                fontWeight: '600',
                marginBottom: '12px',
                paddingBottom: '12px',
                borderBottom: '1px solid #2a2724',
              }}
            >
              {section.title}
            </h2>
            <p
              style={{
                color: '#7a6e62',
                fontSize: '0.875rem',
                lineHeight: '1.8',
                whiteSpace: 'pre-line',
              }}
            >
              {section.content}
            </p>
          </section>
        ))}
      </div>

      <div
        style={{
          marginTop: '48px',
          display: 'flex',
          gap: '16px',
          flexWrap: 'wrap',
        }}
      >
        <Link
          href='/book'
          style={{
            display: 'inline-block',
            padding: '14px 28px',
            background: '#c9933a',
            color: '#0d0c0b',
            borderRadius: '4px',
            textDecoration: 'none',
            fontWeight: '600',
            fontSize: '0.9rem',
            minHeight: '48px',
            lineHeight: '20px',
          }}
        >
          Send forespørsel
        </Link>
        <Link
          href='/faq'
          style={{
            display: 'inline-block',
            padding: '14px 28px',
            background: 'transparent',
            color: '#c9b99a',
            border: '1px solid #2a2724',
            borderRadius: '4px',
            textDecoration: 'none',
            fontSize: '0.9rem',
            minHeight: '48px',
            lineHeight: '20px',
          }}
        >
          Vanlige spørsmål
        </Link>
      </div>
    </div>
  )
}
