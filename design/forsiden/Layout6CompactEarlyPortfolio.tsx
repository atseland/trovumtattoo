/**
 * Layout 6: Compact Hero + Portfolio First
 *
 * Utgangspunkt: Layout 4 (typografisk minimal, horisontal porteføljescroll).
 * Problemet med L4: hero tok full viewport, "om" kom mellom hero og portefølje
 * → to fulle skjermhøyder før besøkeren ser ett bilde.
 *
 * Fiksen her:
 * 1. Hero er kompakt — bare nok plass til å etablere navn, sted og to CTA-er.
 *    Ingen min-h. Ingen sentrering i viewport. Teksten starter ~32px fra toppen.
 * 2. Portefølje-seksjonen løftes til andreplass, rett etter hero.
 *    På mobil (390px skjerm) er første bilde synlig etter ca. 300–350px scroll.
 *    På desktop er første bilde ofte synlig uten scroll.
 * 3. "Om"-seksjonen flyttes ned under porteføljen.
 * 4. Rolig typografisk estetikk fra L4 bevares fullt ut.
 *
 * CTA-er:
 * - "Se arbeider" (anker til portefølje)
 * - "Send melding" (booking)
 * Sekundær: "Se mer på Instagram"
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
    <div className={`flex items-center gap-3 ${className}`}>
      <span className="block h-px flex-1 bg-rule-heavy" style={{ maxWidth: 48 }} />
      <span className="block h-[5px] w-[5px] rotate-45 border border-rule-heavy" />
      <span className="block h-px flex-1 bg-rule-heavy" style={{ maxWidth: 48 }} />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Layout                                                             */
/* ------------------------------------------------------------------ */

export default function Layout6CompactEarlyPortfolio() {
  return (
    <div className="min-h-screen bg-bg text-paper">

      {/* ============================================================ */}
      {/*  HERO — Kompakt, ingen min-h, venstre-justert                */}
      {/*                                                              */}
      {/*  Mål: hele blokken < 50svh på mobil så porteføljen          */}
      {/*  er synlig tidlig uten at hero føles klemmt.                 */}
      {/* ============================================================ */}
      <section className="px-pad pb-10 pt-10 md:pb-14 md:pt-16">

        {/* Sted-indikator */}
        <p className="mb-5 font-mono text-[9px] uppercase tracking-[0.26em] text-index-num md:mb-7">
          Tigr Tattoo &middot; Sandvika
        </p>

        {/* Tittel — stor, men ikke dramatisk stor (clamp ned fra 120px til 80px) */}
        <h1 className="mb-5 font-serif text-[clamp(42px,10vw,80px)] italic leading-[0.9] tracking-[-0.035em] text-paper md:mb-6">
          Trovum
          <br />
          <span style={{ color: 'rgba(237,233,230,0.3)' }}>Tattoo</span>
        </h1>

        {/* Undertekst — kort, en linje */}
        <p
          className="mb-7 font-serif text-[15px] italic leading-[1.5] md:mb-8 md:text-[18px]"
          style={{ color: 'rgba(237,233,230,0.45)' }}
        >
          Dark art, blackwork og black and grey
        </p>

        {/* CTA-er side om side — sparer vertikal plass vs. stacked */}
        <div className="flex gap-3">
          <Btn href="#arbeider" variant="default" className="flex-1 sm:flex-none sm:min-w-[150px]">
            Se arbeider
          </Btn>
          <Btn href="/book" variant="default" className="flex-1 sm:flex-none sm:min-w-[150px]">
            Send melding
          </Btn>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  PORTEFØLJE — Rett etter hero, ingen om-seksjon i mellom.   */}
      {/*                                                              */}
      {/*  Intro: én linje mono + én linje serif. Ingen lang ingress.  */}
      {/*  Scroll-strip: samme mønster som L4 men tettere intro.       */}
      {/* ============================================================ */}
      <section id="arbeider" className="border-t border-rule pt-10 pb-2 md:pt-14">

        {/* Minimal header — holder intro-tekst knapp */}
        <div className="mb-6 flex items-baseline gap-4 px-pad md:mb-8">
          <span className="shrink-0 font-mono text-[9px] uppercase tracking-[0.22em] text-index-num">
            Portefølje
          </span>
          <Ornament className="flex-1" />
          <span
            className="shrink-0 font-serif text-[13px] italic md:text-[14px]"
            style={{ color: 'rgba(237,233,230,0.4)' }}
          >
            Et utvalg som viser retningen
          </span>
        </div>

        {/* Horisontal scroll */}
        <div className="overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          <div
            className="flex gap-3 px-pad md:gap-5"
            style={{ width: 'max-content' }}
          >
            {works.map((work, index) => (
              <div
                key={work.src}
                className="w-[72vw] shrink-0 sm:w-[54vw] md:w-[320px] lg:w-[360px]"
              >
                {/* Bilde */}
                <div className="aspect-[3/4] overflow-hidden bg-panel">
                  <Image
                    src={work.src}
                    alt={work.title}
                    width={400}
                    height={533}
                    className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.03]"
                    style={{ filter: 'grayscale(20%) contrast(1.05)' }}
                    priority={index === 0}
                  />
                </div>

                {/* Caption */}
                <div className="mt-3 flex items-start gap-2">
                  <span className="mt-[3px] shrink-0 font-mono text-[9px] uppercase tracking-[0.2em] text-index-num">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <p className="font-serif text-[14px] italic leading-tight text-paper">
                      {work.title}
                    </p>
                    <p className="mt-1 max-w-[26ch] font-sans text-[12px] leading-[1.5] text-body">
                      {work.caption}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {/* Lufteplass på slutten */}
            <div className="w-pad shrink-0" />
          </div>
        </div>

        {/* Scroll-hint */}
        <p className="mt-4 px-pad font-mono text-[8px] uppercase tracking-[0.2em] text-index-num"
           style={{ opacity: 0.4 }}>
          Scroll →
        </p>
      </section>

      {/* ============================================================ */}
      {/*  OM — Flyttes under portefølje. Kompakt og to-kolonne.       */}
      {/* ============================================================ */}
      <section className="border-t border-rule px-pad py-12 md:py-20">
        <div className="mx-auto max-w-3xl">

          {/* Header-rad */}
          <div className="mb-7 flex items-center gap-4">
            <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-index-num">Om</span>
            <span className="block h-px flex-1 bg-rule" />
          </div>

          {/* To-kolonne på desktop, stacked på mobil */}
          <div className="grid gap-6 md:grid-cols-[auto_1fr] md:gap-12">

            {/* Profilbilde */}
            <div className="shrink-0">
              <Image
                src="/profilbilde.jpeg"
                alt="Trovum Tattoo"
                width={100}
                height={100}
                className="object-cover"
                style={{
                  width: 100,
                  height: 100,
                  filter: 'grayscale(20%) contrast(1.05)',
                  border: '1px solid rgba(237,233,230,0.08)',
                }}
              />
            </div>

            {/* Tekst */}
            <div>
              <h2 className="mb-3 font-serif text-[22px] italic leading-[1.1] tracking-[-0.02em] text-paper md:text-[26px]">
                Trovum Tattoo
              </h2>
              <p className="mb-3 max-w-[48ch] font-sans text-[13px] leading-[1.8] text-body md:text-[14px]">
                Jeg tatoverer hos Tigr Tattoo i Sandvika og har holdt på siden starten av 2023.
                Jeg jobber hovedsakelig i black and grey, blackwork, dark art og semi realism.
              </p>
              <p className="mb-5 max-w-[48ch] font-sans text-[13px] leading-[1.8] text-body md:text-[14px]">
                Jeg liker motiver med tyngde og kontrast — skaller, katedraler, flaggermus, blomster
                og mørkere fantasy-, film- og bandreferanser.
              </p>

              {/* Stilretninger */}
              <Ornament className="mb-4" />
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-index-num">
                Black and grey &middot; Blackwork &middot; Dark art &middot; Semi realism
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  BOOKING / KONTAKT                                           */}
      {/* ============================================================ */}
      <section className="border-t border-rule px-pad py-12 md:py-20">
        <div className="mx-auto max-w-3xl">
          <div className="grid gap-8 md:grid-cols-2 md:gap-16">

            {/* Tekst-kolonne */}
            <div>
              <div className="mb-5 flex items-center gap-4">
                <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-index-num">Kontakt</span>
                <span className="block h-px flex-1 bg-rule" />
              </div>
              <h2 className="mb-4 font-serif text-[24px] italic leading-[1.1] tracking-[-0.02em] text-paper md:text-[30px]">
                Ta kontakt
              </h2>
              <p className="mb-3 max-w-[42ch] font-sans text-[13px] leading-[1.8] text-body md:text-[14px]">
                Du trenger ikke ha et ferdig design for å ta kontakt. En referanse, en idé
                eller bare en stemning holder fint.
              </p>
              <p className="max-w-[42ch] font-sans text-[13px] leading-[1.8] text-body md:text-[14px]">
                Send melding med motiv, plassering, størrelse og eventuelle referanser,
                så tar vi det derfra.
              </p>
            </div>

            {/* CTA-kolonne */}
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
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-accent">
                  Tigr Tattoo
                </p>
                <p className="mt-1 font-sans text-[13px] leading-[1.6] text-body">
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
        <div className="px-pad py-8 md:py-12">
          <div className="mx-auto max-w-3xl">
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
