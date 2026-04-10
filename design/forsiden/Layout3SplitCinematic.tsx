/**
 * Layout 3: Split Cinematic
 *
 * Konsept: Todelt layout der venstre side er en sticky bildepanel som
 * viser porteføljebilder, og høyre side scroller med innhold. Skaper
 * et filmisk, immersivt uttrykk der bilde og tekst lever side om side
 * uten å konkurrere.
 *
 * Kjennetegn:
 * - På desktop: venstre 50% sticky med stort bilde, høyre 50% scroller
 * - På mobil: lineært flow med full-bredde bilder mellom seksjoner
 * - Porteføljen integrert i selve layouten, ikke som separat seksjon
 * - Minimal navigasjon — alt er én lang scroll
 * - Dekorativ diagonal linje som krysser split-punktet
 *
 * Effektiv for tatovør fordi: Gir porteføljen permanent tilstedeværelse
 * mens besøkeren leser. Visuelt bevis er alltid synlig.
 */

'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Logo } from '@/components/Logo'
import { Btn } from '@/components/ui/Btn'
import { Eyebrow } from '@/components/ui/Eyebrow'

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
/*  Seksjon: Portefølje-kort (mobilversjon)                            */
/* ------------------------------------------------------------------ */

function MobilePortfolioCard({ work, index }: { work: typeof works[0]; index: number }) {
  return (
    <div className="border-t border-rule">
      <div className="aspect-[4/5] overflow-hidden bg-panel">
        <Image
          src={work.src}
          alt={work.title}
          width={600}
          height={750}
          className="h-full w-full object-cover"
          style={{ filter: 'grayscale(20%) contrast(1.05)' }}
        />
      </div>
      <div className="flex items-start gap-3 px-6 py-4">
        <span className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.22em] text-index-num">
          {String(index + 1).padStart(2, '0')}
        </span>
        <div>
          <h3 className="font-serif text-[16px] italic leading-tight text-paper">
            {work.title}
          </h3>
          <p className="mt-1 font-sans text-[12px] leading-[1.5] text-body">
            {work.caption}
          </p>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Layout                                                             */
/* ------------------------------------------------------------------ */

export default function Layout3SplitCinematic() {
  const [activeImage, setActiveImage] = useState(0)

  return (
    <div className="min-h-screen bg-bg text-paper">
      {/* ============================================================ */}
      {/*  MOBIL: Lineær layout (under lg)                             */}
      {/* ============================================================ */}
      <div className="lg:hidden">
        {/* Hero */}
        <section className="relative px-6 pb-12 pt-10">
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center select-none">
            <Logo context="hero-watermark" />
          </div>
          <div className="relative z-10">
            <div className="mb-5 flex items-center gap-3">
              <span className="block h-px w-8 bg-index-num" />
              <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-index-num">
                Tigr Tattoo, Sandvika
              </span>
            </div>
            <h1 className="mb-4 font-serif text-[42px] italic leading-[0.92] tracking-[-0.03em] text-paper">
              Trovum
              <br />
              <span style={{ color: 'rgba(237,233,230,0.4)' }}>Tattoo</span>
            </h1>
            <p className="mb-6 max-w-[30ch] font-serif text-[15px] italic leading-[1.5]" style={{ color: 'rgba(237,233,230,0.5)' }}>
              Dark art, blackwork og black and grey hos Tigr Tattoo i Sandvika.
            </p>
            <div className="flex gap-3">
              <Btn href="#mobile-portfolio" variant="action-cta" className="flex-1">
                Se arbeider
              </Btn>
              <Btn href="/book" variant="action" className="flex-1">
                Send melding
              </Btn>
            </div>
          </div>
        </section>

        {/* Hovedbilde */}
        <div className="aspect-[4/5] overflow-hidden bg-panel">
          <Image
            src={works[0].src}
            alt={works[0].title}
            width={600}
            height={750}
            className="h-full w-full object-cover"
            style={{ filter: 'grayscale(20%) contrast(1.05)' }}
          />
        </div>

        {/* Om */}
        <section className="border-t border-rule px-6 py-10">
          <Eyebrow withLine className="mb-5">Om</Eyebrow>
          <div className="mb-5 flex items-center gap-4">
            <Image
              src="/profilbilde.jpeg"
              alt="Trovum Tattoo"
              width={56}
              height={56}
              className="rounded-sm object-cover"
              style={{
                width: 56, height: 56,
                filter: 'grayscale(20%) contrast(1.05)',
                border: '1px solid rgba(237,233,230,0.08)',
              }}
            />
            <h2 className="font-serif text-[20px] italic leading-[1.15] text-paper">
              Trovum Tattoo
            </h2>
          </div>
          <p className="mb-3 font-sans text-[14px] leading-[1.75] text-body">
            Jeg tatoverer hos Tigr Tattoo i Sandvika og har holdt på siden starten av 2023.
            Jeg jobber hovedsakelig i black and grey, blackwork, dark art og semi realism.
          </p>
          <p className="font-sans text-[14px] leading-[1.75] text-body">
            Jeg liker motiver med tyngde og kontrast — skaller, katedraler, flaggermus, blomster
            og mørkere fantasy-, film- og bandreferanser.
          </p>
        </section>

        {/* Portefølje */}
        <section id="mobile-portfolio" className="border-t border-rule py-10">
          <div className="px-6">
            <Eyebrow withLine className="mb-3">Portefølje</Eyebrow>
            <p className="mb-6 font-serif text-[15px] italic leading-[1.5]" style={{ color: 'rgba(237,233,230,0.45)' }}>
              Et utvalg arbeider som viser retningen jeg jobber i.
            </p>
          </div>
          <div className="space-y-0">
            {works.map((work, index) => (
              <MobilePortfolioCard key={work.src} work={work} index={index} />
            ))}
          </div>
        </section>

        {/* Booking */}
        <section className="border-t border-rule px-6 py-10">
          <Eyebrow withLine className="mb-5">Kontakt</Eyebrow>
          <h2 className="mb-4 font-serif text-[24px] italic leading-[1.1] text-paper">
            Ta kontakt
          </h2>
          <p className="mb-3 font-sans text-[14px] leading-[1.7] text-body">
            Du trenger ikke ha et ferdig design. En referanse, en idé eller bare en stemning holder fint.
          </p>
          <p className="mb-6 font-sans text-[14px] leading-[1.7] text-body">
            Send melding med motiv, plassering, størrelse og eventuelle referanser, så tar vi det derfra.
          </p>
          <div className="space-y-3">
            <Btn href="/book" variant="action-cta" className="w-full">Send melding</Btn>
            <Btn href="https://instagram.com/trovumtattoo" variant="action" className="w-full" target="_blank" rel="noopener noreferrer">
              Se mer på Instagram
            </Btn>
          </div>
          <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.14em] text-accent">
            Tigr Tattoo &middot; Elias Smithsvei 27, 1337 Sandvika
          </p>
        </section>
      </div>

      {/* ============================================================ */}
      {/*  DESKTOP: Split layout (lg+)                                 */}
      {/* ============================================================ */}
      <div className="hidden lg:grid lg:grid-cols-2">
        {/* ----- VENSTRE: Sticky bildepanel ----- */}
        <div className="sticky top-0 h-screen overflow-hidden">
          {/* Bilde som endres basert på scroll-posisjon */}
          <div className="relative h-full w-full">
            {works.map((work, index) => (
              <div
                key={work.src}
                className="absolute inset-0 transition-opacity duration-700"
                style={{ opacity: activeImage === index ? 1 : 0 }}
              >
                <Image
                  src={work.src}
                  alt={work.title}
                  fill
                  className="object-cover"
                  style={{ filter: 'grayscale(20%) contrast(1.05)' }}
                  priority={index === 0}
                />
              </div>
            ))}

            {/* Gradient overlay nede */}
            <div
              className="absolute inset-x-0 bottom-0 h-32"
              style={{ background: 'linear-gradient(to top, rgba(13,11,9,0.6), transparent)' }}
            />

            {/* Bildecaption */}
            <div className="absolute bottom-6 left-6 right-6 transition-opacity duration-500">
              <span className="mb-1 block font-mono text-[9px] uppercase tracking-[0.22em] text-index-num">
                {String(activeImage + 1).padStart(2, '0')} / {String(works.length).padStart(2, '0')}
              </span>
              <h3 className="font-serif text-[18px] italic leading-tight text-paper">
                {works[activeImage].title}
              </h3>
              <p className="mt-1 max-w-[30ch] font-sans text-[12px] leading-[1.5] text-body">
                {works[activeImage].caption}
              </p>
            </div>

            {/* Navigeringsdots */}
            <div className="absolute right-6 top-1/2 flex -translate-y-1/2 flex-col gap-3">
              {works.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`h-2 w-2 rounded-full border transition-all duration-300 cursor-pointer ${
                    activeImage === index
                      ? 'border-paper bg-paper'
                      : 'border-[rgba(237,233,230,0.3)] bg-transparent hover:border-paper'
                  }`}
                  aria-label={`Vis bilde ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Dekorativ diagonal linje ved split */}
          <div
            className="pointer-events-none absolute -right-px top-0 h-full w-px"
            style={{ background: 'linear-gradient(to bottom, transparent, rgba(237,233,230,0.08) 30%, rgba(237,233,230,0.08) 70%, transparent)' }}
          />
        </div>

        {/* ----- HØYRE: Scrollende innhold ----- */}
        <div className="relative">
          {/* Hero-tekst */}
          <section className="flex min-h-screen flex-col justify-center px-10 py-16 xl:px-16">
            <div className="mb-6 flex items-center gap-3">
              <span className="block h-px w-8 bg-index-num" />
              <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-index-num">
                Tigr Tattoo, Sandvika
              </span>
            </div>

            <h1 className="mb-5 font-serif text-[clamp(48px,5vw,72px)] italic leading-[0.92] tracking-[-0.03em] text-paper">
              Trovum
              <br />
              <span style={{ color: 'rgba(237,233,230,0.4)' }}>Tattoo</span>
            </h1>

            <p className="mb-8 max-w-[32ch] font-serif text-[17px] italic leading-[1.55]" style={{ color: 'rgba(237,233,230,0.5)' }}>
              Dark art, blackwork og black and grey hos Tigr Tattoo i Sandvika.
            </p>

            <div className="flex gap-3">
              <Btn href="#desktop-om" variant="action-cta" className="max-w-[180px]">
                Se arbeider
              </Btn>
              <Btn href="/book" variant="action" className="max-w-[180px]">
                Send melding
              </Btn>
            </div>
          </section>

          {/* Om */}
          <section id="desktop-om" className="border-t border-rule px-10 py-16 xl:px-16">
            <Eyebrow withLine className="mb-6">Om</Eyebrow>

            <div className="mb-6 flex items-center gap-5">
              <Image
                src="/profilbilde.jpeg"
                alt="Trovum Tattoo"
                width={72}
                height={72}
                className="rounded-sm object-cover"
                style={{
                  width: 72, height: 72,
                  filter: 'grayscale(20%) contrast(1.05)',
                  border: '1px solid rgba(237,233,230,0.08)',
                }}
              />
              <div>
                <h2 className="font-serif text-[22px] italic leading-[1.15] text-paper">
                  Trovum Tattoo
                </h2>
                <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-index-num">
                  Tatoverer siden 2023
                </span>
              </div>
            </div>

            <p className="mb-4 max-w-[44ch] font-sans text-[14px] leading-[1.75] text-body">
              Jeg tatoverer hos Tigr Tattoo i Sandvika og har holdt på siden starten av 2023.
              Jeg jobber hovedsakelig i black and grey, blackwork, dark art og semi realism.
            </p>
            <p className="mb-6 max-w-[44ch] font-sans text-[14px] leading-[1.75] text-body">
              Jeg liker motiver med tyngde og kontrast — skaller, katedraler, flaggermus,
              blomster og mørkere fantasy-, film- og bandreferanser. Mye av det jeg lager
              ligger et sted mellom det makabre og det pene.
            </p>

            {/* Stilretninger */}
            <div className="border-t border-rule-light pt-5">
              <span className="mb-3 block font-mono text-[9px] uppercase tracking-[0.22em] text-index-num">
                Stilretninger
              </span>
              <div className="flex flex-wrap gap-x-5 gap-y-2">
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
          </section>

          {/* Portefølje-liste (klikk for å vise bilde) */}
          <section className="border-t border-rule px-10 py-16 xl:px-16">
            <Eyebrow withLine className="mb-3">Portefølje</Eyebrow>
            <p className="mb-8 font-serif text-[15px] italic leading-[1.5]" style={{ color: 'rgba(237,233,230,0.45)' }}>
              Klikk et arbeid for å se det i full størrelse.
            </p>

            <ol className="flex flex-col">
              {works.map((work, index) => (
                <li key={work.src} className={`${index > 0 ? 'border-t border-rule' : ''}`}>
                  <button
                    onClick={() => setActiveImage(index)}
                    className={`flex w-full cursor-pointer items-start gap-4 py-5 text-left transition-colors duration-200 ${
                      activeImage === index ? 'text-paper' : 'text-body hover:text-paper'
                    }`}
                  >
                    <span className="mt-0.5 shrink-0 font-mono text-[9px] uppercase tracking-[0.22em] text-index-num">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <h3 className="font-serif text-[17px] italic leading-tight">
                        {work.title}
                      </h3>
                      <p className="mt-1 max-w-[32ch] font-sans text-[13px] leading-[1.5] text-body">
                        {work.caption}
                      </p>
                    </div>
                    {activeImage === index && (
                      <span className="ml-auto mt-1 block h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    )}
                  </button>
                </li>
              ))}
            </ol>
          </section>

          {/* Booking */}
          <section className="border-t border-rule px-10 py-16 xl:px-16">
            <Eyebrow withLine className="mb-5">Kontakt</Eyebrow>
            <h2 className="mb-4 font-serif text-[26px] italic leading-[1.1] text-paper">
              Ta kontakt
            </h2>
            <p className="mb-3 max-w-[42ch] font-sans text-[14px] leading-[1.7] text-body">
              Du trenger ikke ha et ferdig design for å ta kontakt. En referanse,
              en idé eller bare en stemning holder fint.
            </p>
            <p className="mb-3 max-w-[42ch] font-sans text-[14px] leading-[1.7] text-body">
              Jeg er opptatt av rolig stemning, god dialog og å finne et uttrykk som passer
              motivet og plasseringen. Jeg tar både mindre og større prosjekter.
            </p>
            <p className="mb-8 max-w-[42ch] font-sans text-[14px] leading-[1.7] text-body">
              Send melding med motiv, plassering, størrelse og eventuelle referanser,
              så tar vi det derfra.
            </p>

            <div className="max-w-sm space-y-3">
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

            <div className="mt-8 space-y-1 border-t border-rule-light pt-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-accent">
                Tigr Tattoo
              </p>
              <p className="font-sans text-[13px] leading-[1.6] text-body">
                Elias Smithsvei 27, 1337 Sandvika
              </p>
            </div>
          </section>

          {/* Footer */}
          <footer className="border-t border-rule px-10 py-8 xl:px-16">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <Logo context="footer" />
              <div className="flex gap-4 sm:gap-6">
                <Link
                  href="https://instagram.com/trovumtattoo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-sans text-[12px] text-accent no-underline transition-colors duration-200 hover:text-paper"
                >
                  @trovumtattoo
                </Link>
                <a
                  href="mailto:kontakt@trovum.no"
                  className="font-sans text-[12px] text-accent no-underline transition-colors duration-200 hover:text-paper"
                >
                  kontakt@trovum.no
                </a>
              </div>
            </div>
            <p className="mt-5 font-sans text-[10px] tracking-wide text-footer-label">
              {`© ${new Date().getFullYear()} Trovum Tattoo — Sandvika`}
            </p>
          </footer>
        </div>
      </div>

      {/* Mobil footer (bare vist under lg) */}
      <footer className="border-t border-rule bg-bg lg:hidden">
        <div className="px-6 py-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Logo context="footer" />
            <div className="flex gap-4">
              <Link
                href="https://instagram.com/trovumtattoo"
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans text-[12px] text-accent no-underline transition-colors duration-200 hover:text-paper"
              >
                @trovumtattoo
              </Link>
              <a
                href="mailto:kontakt@trovum.no"
                className="font-sans text-[12px] text-accent no-underline transition-colors duration-200 hover:text-paper"
              >
                kontakt@trovum.no
              </a>
            </div>
          </div>
          <p className="mt-5 font-sans text-[10px] tracking-wide text-footer-label">
            {`© ${new Date().getFullYear()} Trovum Tattoo — Sandvika`}
          </p>
        </div>
      </footer>
    </div>
  )
}
