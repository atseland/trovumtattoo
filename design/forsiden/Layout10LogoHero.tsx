/**
 * Layout 10: Logo Hero
 *
 * Basert på Layout 9 (AleksEdits) med tre endringer:
 *
 * 1. Tekst-overskriften "Trovum / Tattoo" erstattet med logo-bilde.
 *    Sparer vertikal plass og gir tydeligere branding.
 *
 * 2. Hero tilpasser seg mobilskjermens høyde (min-h: 100svh, max-h: 740px).
 *    Innholdet er sentrert i flex-1-blokken, scroll-indikatoren
 *    ligger alltid naturlig i bunn av hero — uavhengig av skjermhøyde.
 *
 * 3. border-t mellom portefølje og om-seksjonen er gjeninnført.
 *
 * Rekkefølge:
 *   Hero (logo → ornament → bilde → undertekst → knapp → scroll-indikator)
 *   → Portefølje → [border] → Om → Booking → Footer
 */

import Image from 'next/image'
import { Btn } from '@/components/ui/Btn'

const filter = 'invert(93%) sepia(5%) saturate(200%) hue-rotate(340deg) brightness(95%)'

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

export default function Layout10LogoHero() {
  return (
    <div className="min-h-screen bg-bg text-paper">

      {/* ============================================================ */}
      {/*  HERO                                                        */}
      {/*                                                              */}
      {/*  Høyde: min-h-[100svh] sørger for at hero alltid fyller     */}
      {/*  skjermen. max-h-[740px] setter et tak slik at siden ikke   */}
      {/*  blir for luftig på store telefoner og tablets.             */}
      {/*                                                              */}
      {/*  Struktur:                                                   */}
      {/*  - flex-col, items-center, px-6                             */}
      {/*  - Sentralt innhold i en flex-1-blokk → sentrert            */}
      {/*  - Scroll-indikator utenfor flex-1 → faller naturlig ned    */}
      {/* ============================================================ */}
      <section
        className="flex flex-col items-center px-6 text-center md:px-12"
        style={{ minHeight: '100svh', maxHeight: 740 }}
      >

        {/* Sentralt innhold */}
        <div className="flex flex-1 flex-col items-center justify-center">

          {/* Sted */}
          <span className="mb-6 font-mono text-[9px] uppercase tracking-[0.28em] text-index-num md:mb-8">
            Tigr Tattoo &middot; Sandvika
          </span>

          {/* Logo i stedet for tekst-overskrift */}
          <picture className="mb-6 md:mb-8">
            <source srcSet="/logo.webp" type="image/webp" />
            <img
              src="/logo.png"
              alt="Trovum Tattoo"
              className="h-12 w-auto md:h-16"
              style={{ opacity: 0.92, filter }}
            />
          </picture>

          <Ornament className="mb-6 md:mb-8" />

          {/* Profilbilde — sirkulær maske */}
          <div className="mb-6 md:mb-8">
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

          {/* Undertekst */}
          <p
            className="mb-7 max-w-[36ch] font-serif text-[16px] italic leading-[1.6] md:mb-8 md:text-[19px]"
            style={{ color: 'rgba(237,233,230,0.45)' }}
          >
            Dark art, blackwork og black and grey
          </p>

          {/* CTA */}
          <Btn href="/book" variant="default" className="min-w-[148px]">
            Send melding
          </Btn>
        </div>

        {/* Scroll-indikator — utenfor flex-1, hviler naturlig i bunn */}
        <a
          href="#arbeider"
          className="mb-8 flex w-full max-w-xs flex-col items-center gap-2 transition-opacity duration-200 hover:opacity-60"
        >
          <span className="flex w-full items-center gap-3">
            <span className="block h-px flex-1 bg-rule-heavy" />
            <span className="font-mono text-[8px] uppercase tracking-[0.22em] text-index-num">
              se arbeider
            </span>
            <span className="block h-px flex-1 bg-rule-heavy" />
          </span>
          <svg
            width="10" height="12" viewBox="0 0 10 12" fill="none"
            className="text-index-num"
          >
            <path d="M5 0v7M1 4l4 4 4-4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M1 7.5l4 4 4-4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" opacity="0.4" />
          </svg>
        </a>
      </section>

      {/* ============================================================ */}
      {/*  PORTEFØLJE                                                  */}
      {/* ============================================================ */}
      <section id="arbeider" className="py-14 md:py-24">
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
      {/*  OM — border-t gjeninnført (punkt 5 fra evaluering)          */}
      {/* ============================================================ */}
      <section className="border-t border-rule px-6 py-14 md:px-12 md:py-24">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="mb-6 font-serif italic text-[28px] leading-[1.1] tracking-[-0.02em] text-paper md:text-[34px]">
            Om meg
          </h2>

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
      {/*  BOOKING / KONTAKT                                           */}
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

    </div>
  )
}
