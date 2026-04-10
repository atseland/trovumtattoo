/**
 * Layout 9: Profile In Hero
 *
 * Layout 8 med én endring: sirkulært profilbilde av tatovøren
 * plassert i hero-seksjonen mellom "Trovum Tattoo"-tittelen
 * og "Se arbeider" / "Send melding"-knappene.
 *
 * Rekkefølge:
 *   Hero (tittel → profilbilde → CTA) → Portefølje → Om → Booking → Footer
 */

import Image from 'next/image'
import Link from 'next/link'
import { Logo } from '@/components/Logo'
import { Btn } from '@/components/ui/Btn'

/* ------------------------------------------------------------------ */
/*  Innhold                                                            */
/* ------------------------------------------------------------------ */

const works = [
  {
    src: '/artworks/Art1.png',
    title: 'Ladybug / cathedral',
    caption: 'Marihøne og katedral i ett motiv. En retning jeg gjerne gjør mer av.',
  },
  {
    src: '/artworks/Art2.png',
    title: 'Semi realistic skull',
    caption: 'Halvt engel, halvt demon. Detaljert black and grey på arm.',
  },
  {
    src: '/artworks/Art3.png',
    title: 'Ghost',
    caption: 'Papa Emeritus i black and grey. Bandrelaterte motiver gjør jeg gjerne mer av.',
  },
  {
    src: '/artworks/Art4.png',
    title: 'Blomster',
    caption: 'Semi-realistiske blomster på underarm. Samme ro i uttrykket, bare mykere motiv.',
  },
  {
    src: '/artworks/Art5.png',
    title: 'Traditional bat',
    caption: 'Blackwork med tradisjonell form og mørk vri.',
  },
]

/* ------------------------------------------------------------------ */
/*  Ornament                                                           */
/* ------------------------------------------------------------------ */

function Ornament({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      <span className="block h-px w-8 bg-rule-heavy md:w-12" />
      <span className="block h-1 w-1 rotate-45 border border-rule-heavy" />
      <span className="block h-px w-8 bg-rule-heavy md:w-12" />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Layout                                                             */
/* ------------------------------------------------------------------ */

export default function Layout9ProfileInHero() {
  return (
    <div className="min-h-screen bg-bg text-paper">

      {/* ============================================================ */}
      {/*  HERO — L8 + sirkulært profilbilde mellom tittel og CTA-er  */}
      {/* ============================================================ */}
      <section className="flex flex-col items-center justify-center px-6 pb-10 pt-16 text-center md:min-h-screen md:px-12 md:py-20">
        <span className="mb-8 font-mono text-[9px] uppercase tracking-[0.28em] text-index-num md:mb-12">
          Tigr Tattoo &middot; Sandvika
        </span>

        <h1 className="mb-4 font-serif text-[clamp(52px,12vw,120px)] italic leading-[0.88] tracking-[-0.04em] text-paper">
          Trovum
        </h1>
        <h1 className="mb-6 font-serif text-[clamp(52px,12vw,120px)] italic leading-[0.88] tracking-[-0.04em] md:mb-10" style={{ color: 'rgba(237,233,230,0.3)' }}>
          Tattoo
        </h1>

        <Ornament className="mb-8 md:mb-10" />

        {/* Profilbilde — sirkulær maske */}
        <div className="mb-8 md:mb-10">
          <Image
            src="/profilbilde.jpeg"
            alt="Trovum Tattoo"
            width={96}
            height={96}
            className="rounded-full object-cover"
            style={{
              width: 96,
              height: 96,
              filter: 'grayscale(20%) contrast(1.05)',
              border: '1px solid rgba(237,233,230,0.10)',
            }}
          />
        </div>

        <p className="mb-8 max-w-[36ch] font-serif text-[16px] italic leading-[1.6] md:mb-12 md:text-[19px]" style={{ color: 'rgba(237,233,230,0.45)' }}>
          Dark art, blackwork og black and grey
        </p>

        <div className="flex gap-3">
          <Btn href="#arbeider" variant="default" className="min-w-[148px]">
            Se arbeider
          </Btn>
          <Btn href="/book" variant="default" className="min-w-[148px]">
            Kontakt
          </Btn>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  PORTEFØLJE — løftet opp, før om-seksjonen                  */}
      {/* ============================================================ */}
      <section id="arbeider" className="border-t border-rule py-14 md:py-24">
        <div className="mx-auto max-w-xl px-6 text-center md:px-12">
          <span className="mb-3 block font-mono text-[9px] uppercase tracking-[0.22em] text-index-num">
            Portefølje
          </span>
          <p className="mb-8 font-serif text-[22px] italic leading-[1.15] tracking-[-0.02em] text-paper md:mb-12 md:text-[28px]">
            Et utvalg arbeider som viser retningen jeg jobber i.
          </p>
        </div>

        <div className="overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          <div className="flex gap-4 px-6 md:gap-6 md:px-12" style={{ width: 'max-content' }}>
            {works.map((work, index) => (
              <div key={work.src} className="w-[280px] shrink-0 md:w-[340px]">
                <div className="aspect-[3/4] overflow-hidden bg-panel">
                  <Image
                    src={work.src}
                    alt={work.title}
                    width={340}
                    height={453}
                    className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.03]"
                    style={{ filter: 'grayscale(20%) contrast(1.05)' }}
                    priority={index === 0}
                  />
                </div>
                <div className="mt-3 flex items-start gap-2.5">
                  <span className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.22em] text-index-num">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="font-serif text-[15px] italic leading-tight text-paper">
                      {work.title}
                    </h3>
                    <p className="mt-1 max-w-[28ch] font-sans text-[12px] leading-[1.5] text-body">
                      {work.caption}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            <div className="w-6 shrink-0 md:w-12" />
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <span className="font-mono text-[8px] uppercase tracking-[0.22em] text-index-num" style={{ opacity: 0.5 }}>
            Scroll for mer
          </span>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  OM — flyttet ned, under porteføljen                         */}
      {/* ============================================================ */}
      <section className="border-t border-rule px-6 py-14 md:px-12 md:py-24">
        <div className="mx-auto max-w-xl text-center">
          <div className="mb-6 flex justify-center">
            <Image
              src="/profilbilde.jpeg"
              alt="Trovum Tattoo"
              width={88}
              height={88}
              className="rounded-full object-cover"
              style={{
                width: 88,
                height: 88,
                filter: 'grayscale(20%) contrast(1.05)',
                border: '1px solid rgba(237,233,230,0.08)',
              }}
            />
          </div>

          <p className="mb-4 font-sans text-[14px] leading-[1.8] text-body md:text-[15px]">
            Jeg tatoverer hos Tigr Tattoo i Sandvika og har holdt på siden starten av 2023.
            Jeg jobber hovedsakelig i black and grey, blackwork, dark art og semi realism.
          </p>
          <p className="mb-6 font-sans text-[14px] leading-[1.8] text-body md:text-[15px]">
            Jeg liker motiver med tyngde og kontrast — skaller, katedraler, flaggermus, blomster
            og mørkere fantasy-, film- og bandreferanser. Mye av det jeg lager ligger et sted
            mellom det makabre og det pene.
          </p>

          <Ornament className="mb-5" />
          <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-index-num">
            Black and grey &middot; Blackwork &middot; Dark art &middot; Semi realism
          </p>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  BOOKING / KONTAKT — identisk med L4                         */}
      {/* ============================================================ */}
      <section className="border-t border-rule px-6 py-14 md:px-12 md:py-24">
        <div className="mx-auto max-w-xl text-center">
          <Ornament className="mb-6" />

          <h2 className="mb-4 font-serif text-[26px] italic leading-[1.1] tracking-[-0.02em] text-paper md:text-[32px]">
            Ta kontakt
          </h2>

          <p className="mb-3 font-sans text-[14px] leading-[1.7] text-body md:text-[15px]">
            Du trenger ikke ha et ferdig design for å ta kontakt.
            En referanse, en idé eller bare en stemning holder fint.
          </p>

          <p className="mb-3 font-sans text-[14px] leading-[1.7] text-body md:text-[15px]">
            Jeg er opptatt av rolig stemning, god dialog og å finne et uttrykk som passer
            motivet og plasseringen.
          </p>

          <p className="mb-8 font-sans text-[14px] leading-[1.7] text-body md:text-[15px]">
            Send melding med motiv, plassering, størrelse og eventuelle referanser,
            så tar vi det derfra.
          </p>

          <p className="mb-8 font-mono text-[10px] uppercase tracking-[0.16em] text-accent">
            Tigr Tattoo &middot; Elias Smithsvei 27, 1337 Sandvika
          </p>

          <div className="mx-auto max-w-xs space-y-3">
            <Btn href="/book" variant="action-cta" className="w-full">
              Send melding
            </Btn>
            <Btn
              href="https://instagram.com/trovumtattoo"
              variant="action"
              className="w-full"
              target="_blank"
              rel="noopener noreferrer"
            >
              Se mer på Instagram
            </Btn>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  FOOTER — identisk med L4                                    */}
      {/* ============================================================ */}
      <footer className="border-t border-rule bg-bg">
        <div className="px-6 py-8 md:px-12 md:py-12">
          <div className="mx-auto max-w-xl">
            <div className="flex flex-col items-center gap-4 text-center">
              <Logo context="footer" />
              <div className="flex gap-4 sm:gap-6">
                <Link
                  href="https://instagram.com/trovumtattoo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-sans text-[12px] text-accent no-underline transition-colors duration-200 hover:text-paper sm:text-[13px]"
                >
                  @trovumtattoo
                </Link>
                <a
                  href="mailto:kontakt@trovum.no"
                  className="font-sans text-[12px] text-accent no-underline transition-colors duration-200 hover:text-paper sm:text-[13px]"
                >
                  kontakt@trovum.no
                </a>
              </div>
              <p className="font-sans text-[10px] tracking-wide text-footer-label sm:text-[11px]">
                {`© ${new Date().getFullYear()} Trovum Tattoo — Sandvika`}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
