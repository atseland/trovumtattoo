/**
 * Layout 5: Stacked Full-Bleed Immersive
 *
 * Konsept: Full-viewport seksjoner stablet vertikalt. Hver seksjon
 * fyller hele skjermen og har sin egen visuelle behandling — noen
 * med bakgrunnsbilder og overlay, andre med ren typografi.
 * Scroll-snap gir en "rom-for-rom"-opplevelse.
 *
 * Kjennetegn:
 * - Hero med full-bleed bakgrunnsbilde og overlay
 * - Om-seksjon med mørk bakgrunn og sentrert tekst
 * - Portefølje som full-screen bildekarusell med snap
 * - Booking med rolig, åpen komposisjon
 * - Hver seksjon er et selvstendig visuelt rom
 *
 * Effektiv for tatovør fordi: Immersiv opplevelse som holder
 * besøkeren fokusert på én ting av gangen. Ingen distraksjoner.
 * Perfekt for visuelt sterkt arbeid.
 */

'use client'

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
/*  Layout                                                             */
/* ------------------------------------------------------------------ */

export default function Layout5StackedImmersive() {
  return (
    <div className="min-h-screen bg-bg text-paper">
      {/* ============================================================ */}
      {/*  HERO — Full-bleed med bakgrunnsbilde                        */}
      {/* ============================================================ */}
      <section className="relative flex min-h-screen items-end overflow-hidden">
        {/* Bakgrunnsbilde */}
        <Image
          src="/artworks/Art1.png"
          alt=""
          fill
          className="object-cover"
          style={{ filter: 'grayscale(30%) contrast(1.1)' }}
          priority
        />

        {/* Mørk overlay */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to top, rgba(13,11,9,0.92) 0%, rgba(13,11,9,0.5) 40%, rgba(13,11,9,0.3) 100%)',
        }} />

        {/* Innhold nede */}
        <div className="relative z-10 w-full px-6 pb-12 pt-20 md:px-12 md:pb-20 lg:px-16">
          <div className="mx-auto max-w-4xl">
            {/* Sted */}
            <div className="mb-5 flex items-center gap-3 md:mb-8">
              <span className="block h-px w-8 bg-paper/30 md:w-12" />
              <span className="font-mono text-[9px] uppercase tracking-[0.22em]" style={{ color: 'rgba(237,233,230,0.5)' }}>
                Tigr Tattoo, Sandvika
              </span>
            </div>

            {/* Tittel */}
            <h1 className="mb-4 font-serif text-[clamp(44px,9vw,96px)] italic leading-[0.9] tracking-[-0.03em] text-paper md:mb-6">
              Trovum Tattoo
            </h1>

            {/* Undertekst */}
            <p className="mb-8 max-w-[34ch] font-serif text-[16px] italic leading-[1.5] md:mb-12 md:text-[19px]" style={{ color: 'rgba(237,233,230,0.55)' }}>
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
        </div>

        {/* Scroll-indikator */}
        <div className="absolute bottom-4 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex">
          <div className="h-8 w-px animate-pulse" style={{ background: 'linear-gradient(to bottom, transparent, rgba(237,233,230,0.3))' }} />
        </div>
      </section>

      {/* ============================================================ */}
      {/*  OM + STIL — Mørkt rom med sentrert tekst                    */}
      {/* ============================================================ */}
      <section className="relative flex min-h-[70vh] items-center overflow-hidden md:min-h-screen">
        {/* Subtil gradient bakgrunn */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at 30% 50%, rgba(160,148,136,0.04), transparent 60%), linear-gradient(to bottom, #0d0b09, #131110, #0d0b09)',
        }} />

        <div className="relative z-10 w-full px-6 py-14 md:px-12 md:py-20 lg:px-16">
          <div className="mx-auto max-w-3xl">
            <div className="grid gap-10 md:grid-cols-[auto_1fr] md:gap-14">
              {/* Profilbilde */}
              <div className="flex flex-col items-center gap-3 md:items-start">
                <Image
                  src="/profilbilde.jpeg"
                  alt="Trovum Tattoo"
                  width={100}
                  height={100}
                  className="rounded-sm object-cover"
                  style={{
                    width: 100,
                    height: 100,
                    filter: 'grayscale(20%) contrast(1.05)',
                    border: '1px solid rgba(237,233,230,0.08)',
                  }}
                />
                <div className="hidden flex-col items-start gap-1.5 pt-3 md:flex">
                  {['Black and grey', 'Blackwork', 'Dark art', 'Semi realism'].map((style) => (
                    <span key={style} className="flex items-center gap-2">
                      <span className="block h-px w-3 bg-index-num" />
                      <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-accent">
                        {style}
                      </span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Tekst */}
              <div>
                <Eyebrow withLine className="mb-5">Om</Eyebrow>
                <h2 className="mb-4 font-serif text-[28px] italic leading-[1.1] tracking-[-0.02em] text-paper md:text-[36px]">
                  Trovum Tattoo
                </h2>
                <p className="mb-4 max-w-[48ch] font-sans text-[14px] leading-[1.8] text-body md:text-[15px]">
                  Jeg tatoverer hos Tigr Tattoo i Sandvika og har holdt på siden starten av 2023.
                  Jeg jobber hovedsakelig i black and grey, blackwork, dark art og semi realism.
                </p>
                <p className="mb-6 max-w-[48ch] font-sans text-[14px] leading-[1.8] text-body md:text-[15px]">
                  Jeg liker motiver med tyngde og kontrast — skaller, katedraler, flaggermus,
                  blomster og mørkere fantasy-, film- og bandreferanser. Mye av det jeg lager
                  ligger et sted mellom det makabre og det pene.
                </p>

                <p className="max-w-[48ch] font-sans text-[14px] leading-[1.8] text-body md:text-[15px]">
                  Mesteparten jeg gjør ligger i sort og grått, med tydelige kontraster og en
                  mørkere retning. Jeg trives best når motivet får ha litt karakter, enten det
                  er mørkt, dekorativt eller mer pop culture-preget.
                </p>

                {/* Mobil stilretninger */}
                <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 border-t border-rule-light pt-5 md:hidden">
                  {['Black and grey', 'Blackwork', 'Dark art', 'Semi realism'].map((style) => (
                    <span key={style} className="flex items-center gap-2">
                      <span className="block h-px w-3 bg-index-num" />
                      <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-accent">
                        {style}
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  PORTEFØLJE — Full-bleed bilder med overlay captions         */}
      {/* ============================================================ */}
      <section id="portfolio" className="border-t border-rule">
        {/* Intro */}
        <div className="px-6 py-10 md:px-12 md:py-14 lg:px-16">
          <div className="mx-auto max-w-4xl">
            <Eyebrow withLine className="mb-3">Portefølje</Eyebrow>
            <p className="font-serif text-[18px] italic leading-[1.4] tracking-[-0.01em] md:text-[22px]" style={{ color: 'rgba(237,233,230,0.45)' }}>
              Et utvalg arbeider som viser retningen jeg jobber i.
            </p>
          </div>
        </div>

        {/* Fullbredde bilder stacked */}
        <div className="space-y-px">
          {works.map((work, index) => (
            <div key={work.src} className="group relative overflow-hidden">
              {/* Bilde med kontrollert høyde */}
              <div className="relative h-[60vh] overflow-hidden md:h-[75vh]">
                <Image
                  src={work.src}
                  alt={work.title}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-[1.03]"
                  style={{ filter: 'grayscale(20%) contrast(1.05)' }}
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0" style={{
                  background: 'linear-gradient(to top, rgba(13,11,9,0.7) 0%, rgba(13,11,9,0.15) 40%, transparent 100%)',
                }} />
              </div>

              {/* Caption overlaid nede */}
              <div className="absolute inset-x-0 bottom-0 px-6 pb-8 pt-16 md:px-12 md:pb-12 lg:px-16">
                <div className="mx-auto max-w-4xl">
                  <div className="flex items-end gap-4 md:gap-6">
                    <span className="mb-0.5 font-mono text-[10px] uppercase tracking-[0.22em] text-index-num md:text-[11px]">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <h3 className="font-serif text-[20px] italic leading-tight text-paper md:text-[26px]">
                        {work.title}
                      </h3>
                      <p className="mt-1 max-w-[34ch] font-sans text-[13px] leading-[1.5] text-body md:text-[14px]">
                        {work.caption}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/*  BOOKING / KONTAKT — Åpent, rolig rom                        */}
      {/* ============================================================ */}
      <section className="relative flex min-h-[60vh] items-center overflow-hidden md:min-h-[70vh]">
        {/* Subtil bakgrunn */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at 70% 30%, rgba(160,148,136,0.03), transparent 50%), #0d0b09',
        }} />

        <div className="relative z-10 w-full px-6 py-14 md:px-12 md:py-20 lg:px-16">
          <div className="mx-auto max-w-4xl">
            <div className="grid gap-10 md:grid-cols-[1fr_auto] md:items-center md:gap-16">
              {/* Tekst */}
              <div>
                <Eyebrow withLine className="mb-5">Kontakt</Eyebrow>
                <h2 className="mb-4 font-serif text-[28px] italic leading-[1.1] tracking-[-0.02em] text-paper md:text-[36px]">
                  Ta kontakt
                </h2>
                <p className="mb-3 max-w-[44ch] font-sans text-[14px] leading-[1.75] text-body md:text-[15px]">
                  Du trenger ikke ha et ferdig design for å ta kontakt. En referanse,
                  en idé eller bare en stemning holder fint.
                </p>
                <p className="mb-3 max-w-[44ch] font-sans text-[14px] leading-[1.75] text-body md:text-[15px]">
                  Jeg er opptatt av rolig stemning, god dialog og å finne et uttrykk som passer
                  motivet og plasseringen. Jeg tar både mindre og større prosjekter.
                </p>
                <p className="max-w-[44ch] font-sans text-[14px] leading-[1.75] text-body md:text-[15px]">
                  Send melding med motiv, plassering, størrelse og eventuelle referanser,
                  så tar vi det derfra.
                </p>
              </div>

              {/* CTA-boks */}
              <div className="w-full md:w-[280px]">
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

                {/* Stedsinfo */}
                <div className="mt-6 border-t border-rule-light pt-5">
                  <div className="flex items-center gap-2.5">
                    <span className="block h-px w-3 bg-index-num" />
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-accent">
                      Tigr Tattoo
                    </span>
                  </div>
                  <p className="mt-1.5 pl-[17px] font-sans text-[13px] leading-[1.6] text-body">
                    Elias Smithsvei 27
                    <br />
                    1337 Sandvika
                  </p>
                </div>
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
