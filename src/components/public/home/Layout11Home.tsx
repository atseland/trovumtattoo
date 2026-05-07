import Image from 'next/image'
import { Btn } from '@/components/ui/Btn'

const works = [
  {
    src: '/portfolio/Blomster.png',
    title: 'Blomster',
    caption: 'Realistiske blomster på innside underarm, med myk black and grey og tydelig ramme.',
  },
  {
    src: '/portfolio/Semi realistic skull.png',
    title: 'Semi realistic skull',
    caption: 'Detaljert black and grey-hodeskalle med engel/demon-kontrast på arm.',
  },
  {
    src: '/portfolio/Traditional bat.png',
    title: 'Traditional bat',
    caption: 'Tradisjonell flaggermus i blackwork på kne, med mørkere uttrykk og rene flater.',
  },
  {
    src: '/portfolio/Ghost.png',
    title: 'Ghost',
    caption: 'Black and grey-portrett inspirert av Ghost, laget for innside arm.',
  },
  {
    src: '/portfolio/Ladybug_cathedral mashup.png',
    title: 'Ladybug/cathedral mashup',
    caption: 'Marihøne og katedral i et dark art-motiv med feminin kontrast.',
  },
  {
    src: '/portfolio/Flaggermuser.png',
    title: 'Flaggermuser',
    caption: 'Clean blackwork-flaggermuser på bryst, med enkel plassering og tydelig silhuett.',
  },
  {
    src: '/portfolio/Rygg skalle.png',
    title: 'Rygg skalle',
    caption: 'Starten på et større ryggstykke med skalle, blader og black and grey-tyngde.',
  },
]

function Ornament({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      <span className='block h-px w-8 bg-rule-heavy md:w-12' />
      <span className='block h-1 w-1 rotate-45 border border-rule-heavy' />
      <span className='block h-px w-8 bg-rule-heavy md:w-12' />
    </div>
  )
}

export function Layout11Home() {
  return (
    <div className='min-h-screen bg-bg text-paper'>
      <section className='flex flex-col items-center justify-center px-6 pb-10 pt-16 text-center md:min-h-screen md:px-12 md:py-20'>
        <span className='mb-8 font-mono text-[9px] uppercase tracking-[0.28em] text-index-num md:mb-12'>
          Tigr Tattoo &middot; Sandvika
        </span>

        <h1 className='mb-4 font-serif text-[clamp(52px,12vw,120px)] italic leading-[0.88] tracking-[-0.04em] text-paper'>
          Trovum
        </h1>
        <h1
          className='mb-6 font-serif text-[clamp(52px,12vw,120px)] italic leading-[0.88] tracking-[-0.04em] md:mb-10'
          style={{ color: 'rgba(237,233,230,0.3)' }}
        >
          Tattoo
        </h1>

        <Ornament className='mb-8 md:mb-10' />

        <div className='mb-8 md:mb-10'>
          <Image
            src='/profilbilde_v2.jpeg'
            alt='Trovum Tattoo'
            width={96}
            height={96}
            className='rounded-full object-cover'
            style={{
              width: 96,
              height: 96,
              filter: 'grayscale(20%) contrast(1.05)',
              border: '1px solid rgba(237,233,230,0.10)',
            }}
            priority
          />
        </div>

        <p
          className='mb-8 max-w-[36ch] font-serif text-[16px] italic leading-[1.6] md:mb-12 md:text-[19px]'
          style={{ color: 'rgba(237,233,230,0.45)' }}
        >
          Dark art, blackwork og black and grey
        </p>

        <div className='flex gap-3'>
          <Btn href='/book' variant='default' className='min-w-[148px]'>
            Send melding
          </Btn>
        </div>

        <a
          href='#arbeider'
          className='mt-10 flex w-full max-w-xs flex-col items-center gap-2 transition-opacity duration-200 hover:opacity-60'
        >
          <span className='flex w-full items-center gap-3'>
            <span className='block h-px flex-1 bg-rule-heavy' />
            <span className='font-mono text-[8px] uppercase tracking-[0.22em] text-index-num'>
              se arbeider
            </span>
            <span className='block h-px flex-1 bg-rule-heavy' />
          </span>
          <svg width='10' height='12' viewBox='0 0 10 12' fill='none' className='text-index-num' aria-hidden='true'>
            <path d='M5 0v7M1 4l4 4 4-4' stroke='currentColor' strokeWidth='1' strokeLinecap='round' strokeLinejoin='round' />
            <path
              d='M1 7.5l4 4 4-4'
              stroke='currentColor'
              strokeWidth='1'
              strokeLinecap='round'
              strokeLinejoin='round'
              opacity='0.4'
            />
          </svg>
        </a>
      </section>

      <section id='arbeider' className='py-14 md:py-24'>
        <div className='mx-auto max-w-xl px-6 text-center md:px-12'>
          <span className='mb-3 block font-mono text-[9px] uppercase tracking-[0.22em] text-index-num'>
            Portefølje
          </span>
          <p className='mb-8 font-serif text-[22px] italic leading-[1.15] tracking-[-0.02em] text-paper md:mb-12 md:text-[28px]'>
            Et utvalg arbeider som viser retningen jeg jobber i.
          </p>
        </div>

        <div className='overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
          <div className='flex w-max gap-4 px-6 md:gap-6 md:px-12'>
            {works.map((work, index) => (
              <div key={work.src} className='w-[280px] shrink-0 md:w-[340px]'>
                <div className='aspect-[3/4] overflow-hidden bg-panel'>
                  <Image
                    src={work.src}
                    alt={work.title}
                    width={340}
                    height={453}
                    className='h-full w-full object-cover transition-transform duration-700 hover:scale-[1.03]'
                    style={{ filter: 'grayscale(20%) contrast(1.05)' }}
                    priority={index === 0}
                  />
                </div>
                <div className='mt-3 flex items-start gap-2.5'>
                  <span className='mt-0.5 font-mono text-[9px] uppercase tracking-[0.22em] text-index-num'>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className='font-serif text-[15px] italic leading-tight text-paper'>
                      {work.title}
                    </h3>
                    <p className='mt-1 max-w-[28ch] font-sans text-[12px] leading-[1.5] text-body'>
                      {work.caption}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            <div className='w-6 shrink-0 md:w-12' />
          </div>
        </div>

        <div className='mt-6 flex justify-center'>
          <span className='font-mono text-[8px] uppercase tracking-[0.22em] text-index-num opacity-50'>
            Scroll for mer
          </span>
        </div>
      </section>

      <section className='border-t border-rule px-6 py-14 md:px-12 md:py-24'>
        <div className='mx-auto max-w-xl'>
          <h2 className='mb-8 text-center font-serif text-[28px] italic leading-[1.1] tracking-[-0.02em] text-paper md:mb-10 md:text-[34px]'>
            Om meg
          </h2>

          <div className='mb-8 aspect-[4/3] overflow-hidden md:mb-10'>
            <Image
              src='/Bilde2_less.png'
              alt='Tatovering i arbeid'
              width={800}
              height={600}
              className='h-full w-full object-cover object-center'
              style={{ filter: 'grayscale(15%) contrast(1.08)' }}
            />
          </div>

          <div className='text-center'>
            <p className='mb-4 font-sans text-[14px] leading-[1.8] text-body md:text-[15px]'>
              Jeg tatoverer hos Tigr Tattoo i Sandvika og har holdt på siden starten av 2023.
              Jeg jobber hovedsakelig i black and grey, blackwork, dark art og semi realism.
            </p>
            <p className='mb-6 font-sans text-[14px] leading-[1.8] text-body md:text-[15px]'>
              Jeg liker motiver med tyngde og kontrast - skaller, katedraler, flaggermus, blomster
              og mørkere fantasy-, film- og bandreferanser. Mye av det jeg lager ligger et sted
              mellom det makabre og det pene.
            </p>

            <Ornament className='mb-5' />
            <p className='font-mono text-[9px] uppercase tracking-[0.22em] text-index-num'>
              Black and grey &middot; Blackwork &middot; Dark art &middot; Semi realism
            </p>
          </div>
        </div>
      </section>

      <section className='bg-panel px-6 py-14 md:px-12 md:py-24'>
        <div className='mx-auto max-w-xl text-center'>
          <h2 className='mb-6 font-serif text-[26px] italic leading-[1.1] tracking-[-0.02em] text-paper md:text-[32px]'>
            Ta kontakt
          </h2>

          <p className='mb-10 font-sans text-[14px] leading-[1.8] text-body md:text-[15px]'>
            Send meg en melding. Et motiv, en stemning, eller bare et bilde du har lagret lenge - det er nok til å starte en samtale.
          </p>

          <p className='mb-10 font-mono text-[10px] uppercase tracking-[0.16em] text-accent'>
            Tigr Tattoo &middot; Elias Smithsvei 27, 1337 Sandvika
          </p>

          <div className='mx-auto max-w-xs space-y-3'>
            <Btn href='/book' variant='action-cta' className='w-full'>
              Send melding
            </Btn>
            <Btn
              href='https://instagram.com/trovumtattoo'
              variant='action'
              className='w-full'
              target='_blank'
              rel='noopener noreferrer'
            >
              Se mer på Instagram
            </Btn>
          </div>
        </div>
      </section>
    </div>
  )
}
