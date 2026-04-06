import Link from 'next/link'

const placeholderImages = Array.from({ length: 9 }, (_, i) => i + 1)

const steps = [
  { num: '01', title: 'Send forespørsel', body: 'Fyll ut bookingskjemaet med ideen din, størrelse, plassering og referansebilder.' },
  { num: '02', title: 'Konsultasjon og estimat', body: 'Vi gjennomgår forespørselen din og sender et prisestimat og mulige tidspunkter.' },
  { num: '03', title: 'Book og betal depositum', body: 'Bekreft time og betal depositum for å sikre plassen din.' },
]

export default function PublicHomePage() {
  return (
    <div>
      {/* Hero */}
      <section className='flex min-h-[80vh] flex-col items-center justify-center px-5 py-20 text-center'>
        <h1
          className='font-serif italic text-5xl leading-tight tracking-tight sm:text-6xl'
          style={{ color: '#c9b99a', maxWidth: '600px' }}
        >
          Trovum Tattoo
        </h1>
        <p className='mt-6 max-w-md text-base leading-relaxed' style={{ color: '#7a6e62' }}>
          Håndtegnet tatovering med fokus på linjearbeid og tidløs estetikk.
        </p>
        <Link
          href='/book'
          className='mt-10 inline-block rounded px-8 py-4 text-sm font-medium transition-opacity hover:opacity-80'
          style={{ background: '#c9933a', color: '#0d0c0b', minHeight: '48px' }}
        >
          Send bookingforespørsel
        </Link>
      </section>

      {/* Artist intro */}
      <section className='border-t px-5 py-16' style={{ borderColor: '#2a2724' }}>
        <div className='mx-auto max-w-xl'>
          <h2 className='font-serif italic text-2xl' style={{ color: '#c9b99a' }}>Om tatovøren</h2>
          <p className='mt-4 leading-relaxed' style={{ color: '#7a6e62' }}>
            Trovum spesialiserer seg på fine-line og blackwork med en editorial sensibilitet.
            Hvert arbeid er tegnet fra bunnen av — skreddersydd til deg og kroppen din.
          </p>
        </div>
      </section>

      {/* Portfolio grid */}
      <section className='border-t px-5 py-16' style={{ borderColor: '#2a2724' }}>
        <div className='mx-auto max-w-4xl'>
          <h2 className='mb-8 font-serif italic text-2xl' style={{ color: '#c9b99a' }}>Portfolio</h2>
          <div className='grid grid-cols-2 gap-2 sm:grid-cols-3'>
            {placeholderImages.map((i) => (
              <div
                key={i}
                className='aspect-square rounded'
                style={{ background: '#1c1916', border: '1px solid #2a2724' }}
                aria-label={`Portfolio-bilde ${i}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Process steps */}
      <section className='border-t px-5 py-16' style={{ borderColor: '#2a2724' }}>
        <div className='mx-auto max-w-2xl'>
          <h2 className='mb-10 font-serif italic text-2xl' style={{ color: '#c9b99a' }}>Slik fungerer det</h2>
          <div className='flex flex-col gap-8'>
            {steps.map((step) => (
              <div key={step.num} className='flex gap-5'>
                <span className='shrink-0 font-mono text-sm' style={{ color: '#c9933a', paddingTop: '2px' }}>
                  {step.num}
                </span>
                <div>
                  <h3 className='font-medium' style={{ color: '#c9b99a' }}>{step.title}</h3>
                  <p className='mt-1 text-sm leading-relaxed' style={{ color: '#7a6e62' }}>{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className='border-t px-5 py-20 text-center' style={{ borderColor: '#2a2724' }}>
        <h2 className='font-serif italic text-3xl' style={{ color: '#c9b99a' }}>Klar til å booke?</h2>
        <p className='mt-3 text-sm' style={{ color: '#7a6e62' }}>Ta første steg — fyll ut bookingskjemaet.</p>
        <Link
          href='/book'
          className='mt-8 inline-block rounded px-8 py-4 text-sm font-medium transition-opacity hover:opacity-80'
          style={{ background: '#c9933a', color: '#0d0c0b', minHeight: '48px' }}
        >
          Book tatovering
        </Link>
      </section>
    </div>
  )
}
