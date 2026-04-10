/**
 * Layout 1: Editorial Vertical
 *
 * Konsept: Magasinlayout med generøs whitespace og vertikal rytme.
 * Store enkeltbilder med captions plassert ved siden av (ikke under).
 * Porteføljen presenteres som en redaksjonell bildeserie — hvert bilde
 * får plass til å puste. Teksten er stram og presis.
 *
 * Kjennetegn:
 * - Tekstbasert hero med dekorativ linje og stort seriffentypografi
 * - Om-seksjon med profilbilde og tekst side om side
 * - Portefølje som alternerende bilde/tekst-par (bilde venstre/høyre)
 * - Rolig booking-seksjon med lav terskel
 * - Vertikal linje som binder siden sammen visuelt
 */

import Image from 'next/image'
import Link from 'next/link'
import { Logo } from '@/components/Logo'
import { Btn } from '@/components/ui/Btn'
import { Eyebrow } from '@/components/ui/Eyebrow'

/* ------------------------------------------------------------------ */
/*  Innhold fra spec                                                   */
/* ------------------------------------------------------------------ */

const portfolioWorks = [
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

export default function Layout1Editorial() {
  return (
    <div className="min-h-screen bg-bg text-paper">
      {/* ============================================================ */}
      {/*  HERO                                                        */}
      {/* ============================================================ */}
      <section className="relative px-6 pb-16 pt-12 md:px-12 md:pb-32 md:pt-24 lg:px-16">
        {/* Dekorativ vertikal linje */}
        <div
          className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 lg:block"
          style={{ background: 'linear-gradient(to bottom, transparent, rgba(237,233,230,0.06) 20%, rgba(237,233,230,0.06) 80%, transparent)' }}
        />

        {/* Bakgrunn watermark */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center select-none">
          <Logo context="hero-watermark" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl">
          {/* Eyebrow */}
          <div className="mb-6 flex items-center gap-4 md:mb-10">
            <span className="block h-px w-10 bg-index-num md:w-16" />
            <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-index-num">
              Tigr Tattoo, Sandvika
            </span>
          </div>

          {/* Hovedtittel */}
          <h1 className="mb-5 font-serif text-[clamp(42px,8vw,88px)] leading-[0.92] tracking-[-0.03em] text-paper md:mb-8">
            <span className="italic">Trovum</span>
            <br />
            <span className="italic" style={{ color: 'rgba(237,233,230,0.45)' }}>
              Tattoo
            </span>
          </h1>

          {/* Undertekst */}
          <p className="mb-8 max-w-[34ch] font-serif text-[16px] italic leading-[1.55] md:mb-12 md:text-[19px]" style={{ color: 'rgba(237,233,230,0.5)' }}>
            Dark art, blackwork og black and grey
            <br className="hidden md:block" />
            {' '}hos Tigr Tattoo i Sandvika.
          </p>

          {/* CTA-er */}
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
            <Btn href="#portfolio" variant="action-cta" className="sm:w-auto sm:max-w-[200px]">
              Se arbeider
            </Btn>
            <Btn href="/book" variant="action" className="sm:w-auto sm:max-w-[200px]">
              Send melding
            </Btn>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  OM + STIL                                                   */}
      {/* ============================================================ */}
      <section className="border-t border-rule px-6 py-14 md:px-12 md:py-24 lg:px-16">
        <div className="mx-auto max-w-4xl">
          <Eyebrow withLine className="mb-6 md:mb-10">Om</Eyebrow>

          <div className="grid gap-8 md:grid-cols-[140px_1fr] md:gap-12">
            {/* Profilbilde */}
            <div className="shrink-0">
              <Image
                src="/profilbilde.jpeg"
                alt="Trovum Tattoo"
                width={140}
                height={140}
                className="rounded-sm object-cover"
                style={{
                  width: 140,
                  height: 140,
                  filter: 'grayscale(20%) contrast(1.05)',
                  border: '1px solid rgba(237,233,230,0.08)',
                }}
              />
            </div>

            {/* Tekst */}
            <div>
              <p className="mb-4 max-w-[50ch] font-sans text-[14px] leading-[1.75] text-body md:text-[15px]">
                Jeg tatoverer hos Tigr Tattoo i Sandvika og har holdt på siden starten av 2023.
                Jeg jobber hovedsakelig i black and grey, blackwork, dark art og semi realism.
              </p>
              <p className="max-w-[50ch] font-sans text-[14px] leading-[1.75] text-body md:text-[15px]">
                Jeg liker motiver med tyngde og kontrast — skaller, katedraler, flaggermus, blomster
                og mørkere fantasy-, film- og bandreferanser. Mye av det jeg lager ligger et sted
                mellom det makabre og det pene.
              </p>

              {/* Stilretninger som inline liste */}
              <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 border-t border-rule-light pt-5">
                {['Black and grey', 'Blackwork', 'Dark art', 'Semi realism'].map((style) => (
                  <span key={style} className="flex items-center gap-2">
                    <span className="block h-px w-3 bg-index-num" />
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-accent">
                      {style}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  PORTEFØLJE — Redaksjonell bildeserie                        */}
      {/* ============================================================ */}
      <section id="portfolio" className="border-t border-rule py-14 md:py-24">
        <div className="mx-auto max-w-4xl px-6 md:px-12 lg:px-16">
          <Eyebrow withLine className="mb-3">Portefølje</Eyebrow>
          <p className="mb-10 font-serif text-[15px] italic leading-[1.5] md:mb-16 md:text-[17px]" style={{ color: 'rgba(237,233,230,0.45)' }}>
            Et utvalg arbeider som viser retningen jeg jobber i.
          </p>
        </div>

        {/* Alternerende bilde/tekst-par */}
        <div className="mx-auto max-w-5xl space-y-0">
          {portfolioWorks.map((work, index) => {
            const isEven = index % 2 === 0
            return (
              <div
                key={work.src}
                className={`grid items-center gap-0 border-t border-rule md:grid-cols-2 ${
                  isEven ? '' : 'md:[direction:rtl]'
                }`}
              >
                {/* Bilde */}
                <div className="aspect-square overflow-hidden bg-panel md:[direction:ltr]">
                  <Image
                    src={work.src}
                    alt={work.title}
                    width={600}
                    height={600}
                    className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.03]"
                    style={{ filter: 'grayscale(20%) contrast(1.05)' }}
                  />
                </div>

                {/* Caption */}
                <div className="flex flex-col justify-center px-6 py-6 md:px-12 md:py-10 md:[direction:ltr]">
                  <span className="mb-2 font-mono text-[9px] uppercase tracking-[0.22em] text-index-num">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className="mb-2 font-serif text-[20px] italic leading-[1.2] tracking-[-0.01em] text-paper md:text-[24px]">
                    {work.title}
                  </h3>
                  <p className="max-w-[32ch] font-sans text-[13px] leading-[1.65] text-body md:text-[14px]">
                    {work.caption}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* ============================================================ */}
      {/*  BOOKING / KONTAKT                                           */}
      {/* ============================================================ */}
      <section className="border-t border-rule px-6 py-14 md:px-12 md:py-24 lg:px-16">
        <div className="mx-auto max-w-4xl">
          <div className="grid gap-8 md:grid-cols-2 md:gap-16">
            {/* Venstre: tekst */}
            <div>
              <Eyebrow withLine className="mb-5">Kontakt</Eyebrow>
              <h2 className="mb-4 font-serif text-[26px] italic leading-[1.1] tracking-[-0.02em] text-paper md:text-[32px]">
                Ta kontakt
              </h2>
              <div className="space-y-3">
                <p className="max-w-[42ch] font-sans text-[14px] leading-[1.7] text-body md:text-[15px]">
                  Du trenger ikke ha et ferdig design for å ta kontakt. En referanse, en idé
                  eller bare en stemning holder fint.
                </p>
                <p className="max-w-[42ch] font-sans text-[14px] leading-[1.7] text-body md:text-[15px]">
                  Jeg er opptatt av rolig stemning, god dialog og å finne et uttrykk som passer
                  motivet og plasseringen. Jeg tar både mindre og større prosjekter.
                </p>
                <p className="max-w-[42ch] font-sans text-[14px] leading-[1.7] text-body md:text-[15px]">
                  Send melding med motiv, plassering, størrelse og eventuelle referanser,
                  så tar vi det derfra.
                </p>
              </div>
            </div>

            {/* Høyre: CTA-er og info */}
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

              {/* Praktisk info */}
              <div className="mt-8 space-y-2 border-t border-rule-light pt-6">
                <div className="flex items-center gap-3">
                  <span className="block h-px w-3 bg-index-num" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-accent">
                    Tigr Tattoo
                  </span>
                </div>
                <p className="pl-[21px] font-sans text-[13px] leading-[1.6] text-body">
                  Elias Smithsvei 27, 1337 Sandvika
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  FOOTER                                                      */}
      {/* ============================================================ */}
      <footer className="border-t border-rule bg-bg">
        <div className="px-6 py-8 md:px-12 md:py-12 lg:px-16">
          <div className="mx-auto max-w-4xl">
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
        </div>
      </footer>
    </div>
  )
}
