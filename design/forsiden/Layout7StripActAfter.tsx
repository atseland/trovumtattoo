/**
 * Layout 7: Strip + Act After
 * — REWRITE — Mobile first
 *
 * Filosofi: Vis arbeidene FØR du ber om handling. Brukeren ser alle 5
 * i en horisontal scroll-strip umiddelbart etter en svært kompakt intro.
 * CTA-ene dukker opp *etter* stripa — ikke før. Arbeidene selger.
 *
 * Rekkefølge (mobil og desktop):
 *   Intro (ingen CTA) → strip (alle 5) → CTA-er → om → booking
 *
 * Piksel-kalkyle for iPhone 14 Pro (390×844px):
 *   Header:                   56px
 *   Intro (pt-7 … pb-5):      ≈ 190px
 *   Strip-label:               ≈  28px
 *   ─── Første kort starter ved ≈ 274px ───
 *   Kort (76vw = 296px, 3:4): 395px høy
 *   Kortet slutter ved ≈ 669px → over fold (844px) ✓
 *   Hint av andre kort synlig i kanten ✓
 *
 * Desktop-bonus (md+):
 *   Kortene er faste 300px brede → 3+ synlige.
 *   Om + booking får 2-kol-layout.
 *   Ingen ny seksjon, ingen nye elementer — bare mer luft og bredde.
 */

import React from 'react'
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
/*  Layout                                                             */
/* ------------------------------------------------------------------ */

export default function Layout7StripActAfter() {
  return (
    <div className="min-h-screen bg-bg text-paper">

      {/* ============================================================
          INTRO — Svært kompakt. Ingen CTA her.
          Formålet: etablere identitet raskt, la stripa ta over.
      ============================================================ */}
      <section className="px-pad pt-7 pb-5 md:pt-10 md:pb-7">
        {/* Sted */}
        <p className="mb-3 font-mono text-[9px] uppercase tracking-[0.26em] text-index-num md:mb-4">
          Tigr Tattoo &middot; Sandvika
        </p>

        {/* Navn */}
        <h1 className="mb-3 font-serif italic text-[clamp(40px,9vw,72px)] leading-[0.9] tracking-[-0.035em] text-paper md:mb-4">
          Trovum
          <br />
          <span style={{ color: 'rgba(237,233,230,0.3)' }}>Tattoo</span>
        </h1>

        {/* Undertekst — ingen CTA, ingen knapper */}
        <p
          className="font-serif italic text-[15px] leading-[1.5] md:text-[17px]"
          style={{ color: 'rgba(237,233,230,0.45)' }}
        >
          Dark art, blackwork og black and grey
        </p>
      </section>

      {/* ============================================================
          PORTEFØLJE-STRIP — Umiddelbart etter intro.
          Horisontalt scroll. Ingen vertikale avbrudd.
      ============================================================ */}
      <section id="arbeider">
        {/* Minimal seksjonslabel — smal, ikke distraherende */}
        <div className="mb-3 flex items-center gap-3 px-pad">
          <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-index-num">
            Arbeider
          </span>
          <span className="block h-px flex-1 bg-rule" />
        </div>

        {/* Scroll-beholderen — ingen padding siden kortene bruker px-pad som start-offset */}
        <div
          className="overflow-x-auto"
          style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' } as React.CSSProperties}
        >
          <div
            className="flex gap-2 px-pad md:gap-4"
            style={{ width: 'max-content' }}
          >
            {works.map((work, index) => (
              /* Mobil: 76vw = 296px. Desktop: fast 300px. */
              <div
                key={work.src}
                className="w-[76vw] shrink-0 md:w-[300px] lg:w-[330px]"
              >
                {/* Bilde — 3:4 portrettformat */}
                <div className="relative aspect-[3/4] overflow-hidden bg-panel">
                  <Image
                    src={work.src}
                    alt={work.title}
                    fill
                    sizes="(min-width: 768px) 300px, 76vw"
                    className="object-cover transition-transform duration-700 hover:scale-[1.02]"
                    style={{ filter: 'grayscale(20%) contrast(1.05)' }}
                    priority={index === 0}
                  />
                </div>

                {/* Caption under bilde — alltid synlig, ikke overlay */}
                <div className="mt-2.5 flex items-start gap-2">
                  <span className="mt-[3px] shrink-0 font-mono text-[9px] uppercase tracking-[0.2em] text-index-num">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <p className="font-serif text-[14px] italic leading-tight text-paper">
                      {work.title}
                    </p>
                    <p className="mt-1 font-sans text-[12px] leading-[1.5] text-body">
                      {work.caption}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* Lufteplass på slutten = samme pad som starten */}
            <div className="w-pad shrink-0" />
          </div>
        </div>

        {/* Scroll-hint */}
        <p
          className="mt-3 px-pad font-mono text-[8px] uppercase tracking-[0.2em] text-index-num"
          style={{ opacity: 0.4 }}
        >
          Scroll →
        </p>
      </section>

      {/* ============================================================
          CTA-ER — Etter stripa. Brukeren har sett arbeidet.
      ============================================================ */}
      <section className="border-t border-rule px-pad py-8 md:py-12">
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
          <Btn href="/book" variant="action-cta" className="flex-1 sm:flex-none sm:min-w-[200px]">
            Send melding
          </Btn>
          <Btn
            href="https://instagram.com/trovumtattoo"
            variant="action"
            className="flex-1 sm:flex-none sm:min-w-[200px]"
            target="_blank"
            rel="noopener noreferrer"
          >
            Se mer på Instagram
          </Btn>
        </div>
      </section>

      {/* ============================================================
          OM
      ============================================================ */}
      <section className="border-t border-rule px-pad py-10 md:py-16">
        <div className="grid gap-5 md:grid-cols-2 md:gap-16">
          {/* Venstre: Profil + tekst */}
          <div>
            <div className="mb-5 flex items-center gap-4">
              <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-index-num">Om</span>
              <span className="block h-px flex-1 bg-rule" />
            </div>

            <div className="mb-4 flex items-center gap-4">
              <Image
                src="/profilbilde.jpeg"
                alt="Trovum Tattoo"
                width={72}
                height={72}
                className="shrink-0 object-cover"
                style={{
                  width: 72,
                  height: 72,
                  filter: 'grayscale(20%) contrast(1.05)',
                  border: '1px solid rgba(237,233,230,0.08)',
                }}
              />
              <h2 className="font-serif italic text-[22px] leading-[1.1] tracking-[-0.02em] text-paper md:text-[24px]">
                Trovum Tattoo
              </h2>
            </div>

            <p className="mb-3 max-w-[50ch] font-sans text-[13px] leading-[1.8] text-body md:text-[14px]">
              Jeg tatoverer hos Tigr Tattoo i Sandvika og har holdt på siden starten av 2023.
              Jeg jobber hovedsakelig i black and grey, blackwork, dark art og semi realism.
            </p>
            <p className="mb-4 max-w-[50ch] font-sans text-[13px] leading-[1.8] text-body md:text-[14px]">
              Jeg liker motiver med tyngde og kontrast — skaller, katedraler, flaggermus, blomster
              og mørkere fantasy-, film- og bandreferanser.
            </p>
            <div className="flex items-center gap-3">
              <span className="block h-px w-8 bg-rule-heavy" />
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-index-num">
                Black and grey &middot; Blackwork &middot; Dark art &middot; Semi realism
              </p>
            </div>
          </div>

          {/* Høyre: Booking (desktop-bonus — alt stables på mobil) */}
          <div className="md:flex md:flex-col md:justify-center">
            <div className="mb-5 flex items-center gap-4">
              <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-index-num">Kontakt</span>
              <span className="block h-px flex-1 bg-rule" />
            </div>
            <h2 className="mb-4 font-serif italic text-[22px] leading-[1.1] tracking-[-0.02em] text-paper md:text-[24px]">
              Ta kontakt
            </h2>
            <p className="mb-3 max-w-[44ch] font-sans text-[13px] leading-[1.8] text-body md:text-[14px]">
              Du trenger ikke ha et ferdig design. En referanse, en idé eller bare en stemning
              holder fint.
            </p>
            <p className="mb-6 max-w-[44ch] font-sans text-[13px] leading-[1.8] text-body md:text-[14px]">
              Send melding med motiv, plassering, størrelse og eventuelle referanser,
              så tar vi det derfra.
            </p>
            <div className="space-y-3">
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
            <div className="mt-6 border-t border-rule-light pt-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-accent">Tigr Tattoo</p>
              <p className="mt-1 font-sans text-[13px] leading-[1.6] text-body">
                Elias Smithsvei 27, 1337 Sandvika
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          FOOTER
      ============================================================ */}
      <footer className="border-t border-rule bg-bg">
        <div className="px-pad py-8 md:py-12">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
          </div>
          <p className="mt-6 font-sans text-[10px] tracking-wide text-footer-label sm:mt-8 sm:text-[11px]">
            {`© ${new Date().getFullYear()} Trovum Tattoo — Sandvika`}
          </p>
        </div>
      </footer>
    </div>
  )
}
