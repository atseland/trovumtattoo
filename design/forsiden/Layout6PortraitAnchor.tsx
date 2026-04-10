/**
 * Layout 6: Portrait Anchor
 * — REWRITE — Mobile first
 *
 * Filosofi: Én sterk portrettbilde-presentasjon er ankeret. Besøkeren
 * ser ett fremhevet arbeid over fold på 390px-skjerm, deretter 4 til i
 * et 2×2-grid like under. Ingen horisontal scroll nødvendig.
 *
 * Rekkefølge (mobil og desktop):
 *   Intro (kompakt) → featured bilde + caption → 2×2-grid → om → booking
 *
 * Piksel-kalkyle for iPhone 14 Pro (390×844px):
 *   Header:            56px
 *   Intro (pt-8…pb-6): ≈ 240px
 *   ─── Featured bilde starter ved ≈ 296px fra toppen ───
 *   Bilde (4:5 aspect, 350px bred): 438px høy
 *   Bildet slutter ved ≈ 734px → godt over fold (844px) ✓
 *
 * Desktop-bonus (md+):
 *   Intro-tekst og featured bilde går side om side i et 2-kol-grid.
 *   2×2-grid for resterende arbeider blir en rad med 4.
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
/*  Layout                                                             */
/* ------------------------------------------------------------------ */

export default function Layout6PortraitAnchor() {
  return (
    <div className="min-h-screen bg-bg text-paper">

      {/* ============================================================
          INTRO + FEATURED BILDE
          Desktop: side om side. Mobil: stablet.
      ============================================================ */}
      <div className="md:grid md:grid-cols-[55fr_45fr]">

        {/* --- Intro-tekst --- */}
        <section className="px-pad pt-8 pb-6 md:flex md:flex-col md:justify-center md:py-16">
          {/* Sted */}
          <p className="mb-4 font-mono text-[9px] uppercase tracking-[0.26em] text-index-num">
            Tigr Tattoo &middot; Sandvika
          </p>

          {/* Navn */}
          <h1 className="mb-4 font-serif italic text-[clamp(42px,10vw,76px)] leading-[0.9] tracking-[-0.035em] text-paper">
            Trovum
            <br />
            <span style={{ color: 'rgba(237,233,230,0.3)' }}>Tattoo</span>
          </h1>

          {/* Undertekst */}
          <p
            className="mb-6 font-serif italic text-[15px] leading-[1.5] md:text-[17px]"
            style={{ color: 'rgba(237,233,230,0.45)' }}
          >
            Dark art, blackwork og black and grey
          </p>

          {/* CTA-er — side om side, ingen full-bredde blokker */}
          <div className="flex gap-3">
            <Btn href="#arbeider" variant="default" className="flex-1 sm:flex-none sm:min-w-[148px]">
              Se arbeider
            </Btn>
            <Btn href="/book" variant="default" className="flex-1 sm:flex-none sm:min-w-[148px]">
              Send melding
            </Btn>
          </div>
        </section>

        {/* --- Featured bilde (Art1) ---
            Mobil: full bredde minus px-pad, 4:5 ratio.
            Desktop: fyller hele høyre kolonne (ingen fast høyde → naturlig stretch).
        */}
        <div className="px-pad pb-1 pt-2 md:p-0 md:border-l md:border-rule">
          <div
            className="relative overflow-hidden bg-panel md:h-full"
            style={{ aspectRatio: '4 / 5' }}
          >
            <Image
              src={works[0].src}
              alt={works[0].title}
              fill
              sizes="(min-width: 768px) 45vw, calc(100vw - 40px)"
              className="object-cover transition-transform duration-700 hover:scale-[1.02]"
              style={{ filter: 'grayscale(20%) contrast(1.05)' }}
              priority
            />
            {/* Subtil caption-stripe nede */}
            <div
              className="absolute inset-x-0 bottom-0 px-4 pb-4 pt-10"
              style={{ background: 'linear-gradient(to top, rgba(13,11,9,0.6) 0%, transparent 100%)' }}
            >
              <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-index-num">01</p>
              <p className="font-serif text-[14px] italic leading-tight text-paper">
                {works[0].title}
              </p>
            </div>
          </div>
          {/* Caption under bilde — kun mobil */}
          <p className="mt-2 font-sans text-[12px] leading-[1.5] text-body md:hidden">
            {works[0].caption}
          </p>
        </div>
      </div>

      {/* ============================================================
          RESTERENDE ARBEIDER — 2×2-grid (mobil) / 4-kol rad (desktop)
          gap-1 binder det visuelt sammen med featured bildet over.
      ============================================================ */}
      <section id="arbeider" className="px-pad pt-1 pb-10 md:pb-16">
        {/* Seksjonslabel */}
        <div className="mb-3 mt-3 flex items-center gap-3">
          <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-index-num">
            Portefølje
          </span>
          <span className="block h-px flex-1 bg-rule" />
          <span
            className="font-serif text-[12px] italic"
            style={{ color: 'rgba(237,233,230,0.35)' }}
          >
            Et utvalg som viser retningen
          </span>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-1 md:grid-cols-4">
          {works.slice(1).map((work, i) => (
            <div key={work.src} className="group">
              {/* Bilde — kvadratisk på mobil, litt høyere på desktop */}
              <div className="relative aspect-square overflow-hidden bg-panel md:aspect-[3/4]">
                <Image
                  src={work.src}
                  alt={work.title}
                  fill
                  sizes="(min-width: 768px) 25vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  style={{ filter: 'grayscale(20%) contrast(1.05)' }}
                />
              </div>
              {/* Tittel under */}
              <div className="mt-2 flex items-start gap-1.5">
                <span className="mt-[3px] shrink-0 font-mono text-[8px] uppercase tracking-[0.2em] text-index-num">
                  {String(i + 2).padStart(2, '0')}
                </span>
                <div>
                  <p className="font-serif text-[13px] italic leading-tight text-paper">
                    {work.title}
                  </p>
                  {/* Caption — skjult på mobil, synlig på desktop */}
                  <p className="mt-0.5 hidden font-sans text-[11px] leading-[1.5] text-body md:block">
                    {work.caption}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================
          OM
      ============================================================ */}
      <section className="border-t border-rule px-pad py-10 md:py-16">
        {/* Header-rad */}
        <div className="mb-6 flex items-center gap-4">
          <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-index-num">Om</span>
          <span className="block h-px flex-1 bg-rule" />
        </div>

        <div className="grid gap-5 md:grid-cols-[auto_1fr] md:gap-10">
          {/* Profilbilde */}
          <Image
            src="/profilbilde.jpeg"
            alt="Trovum Tattoo"
            width={88}
            height={88}
            className="object-cover"
            style={{
              width: 88,
              height: 88,
              filter: 'grayscale(20%) contrast(1.05)',
              border: '1px solid rgba(237,233,230,0.08)',
            }}
          />

          {/* Tekst */}
          <div>
            <h2 className="mb-3 font-serif italic text-[22px] leading-[1.1] tracking-[-0.02em] text-paper md:text-[26px]">
              Trovum Tattoo
            </h2>
            <p className="mb-3 max-w-[50ch] font-sans text-[13px] leading-[1.8] text-body md:text-[14px]">
              Jeg tatoverer hos Tigr Tattoo i Sandvika og har holdt på siden starten av 2023.
              Jeg jobber hovedsakelig i black and grey, blackwork, dark art og semi realism.
            </p>
            <p className="mb-4 max-w-[50ch] font-sans text-[13px] leading-[1.8] text-body md:text-[14px]">
              Jeg liker motiver med tyngde og kontrast — skaller, katedraler, flaggermus, blomster
              og mørkere fantasy-, film- og bandreferanser.
            </p>
            {/* Stilretninger */}
            <div className="flex items-center gap-3">
              <span className="block h-px w-8 bg-rule-heavy" />
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-index-num">
                Black and grey &middot; Blackwork &middot; Dark art &middot; Semi realism
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          BOOKING / KONTAKT
      ============================================================ */}
      <section className="border-t border-rule px-pad py-10 md:py-16">
        <div className="grid gap-8 md:grid-cols-2 md:gap-16">
          {/* Tekst */}
          <div>
            <div className="mb-5 flex items-center gap-4">
              <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-index-num">Kontakt</span>
              <span className="block h-px flex-1 bg-rule" />
            </div>
            <h2 className="mb-4 font-serif italic text-[24px] leading-[1.1] tracking-[-0.02em] text-paper md:text-[28px]">
              Ta kontakt
            </h2>
            <p className="mb-3 max-w-[44ch] font-sans text-[13px] leading-[1.8] text-body md:text-[14px]">
              Du trenger ikke ha et ferdig design for å ta kontakt. En referanse, en idé
              eller bare en stemning holder fint.
            </p>
            <p className="max-w-[44ch] font-sans text-[13px] leading-[1.8] text-body md:text-[14px]">
              Send melding med motiv, plassering, størrelse og eventuelle referanser,
              så tar vi det derfra.
            </p>
          </div>

          {/* CTA-er */}
          <div className="flex flex-col justify-center">
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
