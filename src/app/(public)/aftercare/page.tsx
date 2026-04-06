import Link from 'next/link'

const steps = [
  {
    day: 'Dag 1',
    title: 'Rett etter tatoveringen',
    instructions: [
      'Hold plastfolien på i 2–4 timer (eller til du er hjemme)',
      'Fjern folien forsiktig og skyll tatoveringen med lunkent vann og en mild, parfymefri såpe',
      'Tørk forsiktig med et rent papirhåndkle — ikke gni',
      'Påfør et tynt lag uparfymert fuktighetskrem (f.eks. Bepanthen, CeraVe eller A&D)',
      'La tatoveringen lufttørke i noen minutter før du kler på deg',
    ],
  },
  {
    day: 'Dag 2–4',
    title: 'Første helingsuke',
    instructions: [
      'Vask tatoveringen 2–3 ganger daglig med mild såpe',
      'Påfør fuktighetskrem etter vask — et tynt, ikke-klebrig lag',
      'Unngå å dekke tatoveringen med tett klær — bomull er OK',
      'Ikke riv eller skrap om tatoveringen klør — klapp forsiktig over klærne',
      'Hold tatoveringen unna direkte sollys',
    ],
  },
  {
    day: 'Dag 5–14',
    title: 'Skallingsfase',
    instructions: [
      'Tatoveringen vil begynne å skalle — dette er normalt',
      'Ikke riv av skall — la dem falle av naturlig',
      'Fortsett å fukte tatoveringen, men ikke overdriv',
      'Unngå bading i basseng, badstue og langvarig dusj i denne perioden',
      'Hold tatoveringen beskyttet fra solen — bruk løse klær eller plast (ikke krem ennå)',
    ],
  },
  {
    day: 'Uke 3–6',
    title: 'Dyp heling',
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
  'Ta vaksiner i tatovert område under heling',
  'Intensiv trening som gir mye svette de første dagene',
]

export default function AftercarePage() {
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
        Etterbehandling
      </h1>
      <p style={{ color: '#7a6e62', marginBottom: '40px', fontSize: '0.9rem' }}>
        Riktig etterbehandling er avgjørende for at tatoveringen skal hele godt og beholde
        linjerenhet og fargedybde over tid.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', marginBottom: '40px' }}>
        {steps.map((step, i) => (
          <div
            key={i}
            style={{
              background: '#141210',
              border: '1px solid #2a2724',
              borderRadius: '8px',
              padding: '20px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <span
                style={{
                  background: '#c9933a',
                  color: '#0d0c0b',
                  fontSize: '0.7rem',
                  fontWeight: '700',
                  padding: '3px 10px',
                  borderRadius: '999px',
                  flexShrink: 0,
                }}
              >
                {step.day}
              </span>
              <h2 style={{ color: '#c9b99a', fontSize: '0.95rem', fontWeight: '600' }}>
                {step.title}
              </h2>
            </div>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '0', listStyle: 'none' }}>
              {step.instructions.map((instruction, j) => (
                <li
                  key={j}
                  style={{ color: '#7a6e62', fontSize: '0.875rem', lineHeight: '1.6', display: 'flex', gap: '8px' }}
                >
                  <span style={{ color: '#c9933a', flexShrink: 0, marginTop: '2px' }}>·</span>
                  {instruction}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div
        style={{
          background: '#1a1008',
          border: '1px solid #3a2a10',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '40px',
        }}
      >
        <h2 style={{ color: '#c9933a', fontSize: '0.95rem', fontWeight: '600', marginBottom: '14px' }}>
          Unngå dette under heling
        </h2>
        <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px', listStyle: 'none', padding: 0 }}>
          {donts.map((item, i) => (
            <li key={i} style={{ color: '#7a6e62', fontSize: '0.875rem', display: 'flex', gap: '8px', lineHeight: '1.6' }}>
              <span style={{ color: '#c9933a', flexShrink: 0 }}>✗</span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div style={{ padding: '16px 0', borderTop: '1px solid #2a2724' }}>
        <p style={{ color: '#7a6e62', fontSize: '0.8rem', lineHeight: '1.7' }}>
          Har du spørsmål om helingsforløpet eller opplever noe unormalt? Send en melding —
          jeg hjelper deg gjerne.
        </p>
        <Link
          href='/faq'
          style={{ color: '#c9933a', fontSize: '0.8rem', textDecoration: 'none', display: 'inline-block', marginTop: '8px' }}
        >
          Se vanlige spørsmål →
        </Link>
      </div>
    </div>
  )
}
