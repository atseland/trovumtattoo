/**
 * Layout 7: Asymmetric Entry
 *
 * Utgangspunkt: Layout 4 + feedbacken om at arbeidene må komme raskere.
 * Løsning: Bygg to kuraterte bilder INN I hero-seksjonen på desktop.
 * På mobil: ett featured bilde rett under hero-teksten — innrammet,
 * ikke full-bleed, ikke blinkende — bare stille bevis på arbeidet.
 *
 * Tre prinsipper som skiller dette fra Layout 3 (Split Cinematic):
 * 1. Ikke sticky. Alt scroller normalt.
 * 2. Bildene er inneholdte elementer, ikke bakgrunner. De blender ikke.
 * 3. Mobil degraderer naturlig til én kolonne uten lange scroll-seksjoner.
 *
 * Struktur:
 * — INTRO: tekst (venstre) + to stablede bilder (høyre) — desktop
 *          tekst + ett featured bilde — mobil
 * — PORTEFØLJE: horisontal scroll (full 5 arbeider)
 * — OM: kompakt profil + tekst
 * — BOOKING: rolig, direkte
 * — FOOTER
 *
 * Bilder som vises i intro: Art1 (stor), Art2 (mindre) — de sterkeste arbeidene.
 * Resten er i portefølje-stripen nedenfor.
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

export default function Layout7AsymmetricEntry() {
  return (
    <div className="min-h-screen bg-bg text-paper">

      {/* ============================================================ */}
      {/*  INTRO — Asymmetrisk split                                   */}
      {/*                                                              */}
      {/*  Desktop: to-kolonne grid                                    */}
      {/*    Venstre (55%): hero-tekst, vertikalt sentrert             */}
      {/*    Høyre (45%): to stablede bilder som fyller kolonnen       */}
      {/*                                                              */}
      {/*  Mobil: tekst, deretter ett featured bilde (innrammet,       */}
      {/*    full bredde minus padding, ikke full-bleed).              */}
      {/* ============================================================ */}
      <section
        className="grid md:min-h-[580px] md:grid-cols-[55fr_45fr]"
        style={{ minHeight: 'auto' }}
      >

        {/* ---- Venstre: Hero-tekst ---- */}
        <div className="flex flex-col justify-center px-pad pb-8 pt-10 md:py-16">

          {/* Sted */}
          <p className="mb-5 font-mono text-[9px] uppercase tracking-[0.26em] text-index-num md:mb-7">
            Tigr Tattoo &middot; Sandvika
          </p>

          {/* Tittel */}
          <h1 className="mb-5 font-serif text-[clamp(42px,8vw,76px)] italic leading-[0.9] tracking-[-0.035em] text-paper md:mb-6">
            Trovum
            <br />
            <span style={{ color: 'rgba(237,233,230,0.3)' }}>Tattoo</span>
          </h1>

          {/* Undertekst */}
          <p
            className="mb-7 max-w-[30ch] font-serif text-[15px] italic leading-[1.5] md:mb-9 md:text-[17px]"
            style={{ color: 'rgba(237,233,230,0.45)' }}
          >
            Dark art, blackwork og black and grey
          </p>

          {/* CTA-er */}
          <div className="flex gap-3">
            <Btn href="#portefolje" variant="default" className="flex-1 sm:flex-none sm:min-w-[148px]">
              Se arbeider
            </Btn>
            <Btn href="/book" variant="default" className="flex-1 sm:flex-none sm:min-w-[148px]">
              Send melding
            </Btn>
          </div>
        </div>

        {/* ---- Høyre: To stablede bilder (desktop only) ---- */}
        {/*                                                     */}
        {/* Bruker flex-col med flex-[3] og flex-[2] for å     */}
        {/* fylle kolonnen uten faste px-høyder.               */}
        {/* gap-1 mellom bildene — subtilt, ikke distraherende. */}
        <div
          className="hidden gap-1 border-l border-rule md:flex md:flex-col"
          style={{ minHeight: 580 }}
        >
          {/* Bilde 1 — størst (Art1: ladybug/cathedral) */}
          <div className="relative min-h-0 flex-[3] overflow-hidden bg-panel">
            <Image
              src={works[0].src}
              alt={works[0].title}
              width={720}
              height={960}
              className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.02]"
              style={{ filter: 'grayscale(20%) contrast(1.05)' }}
              priority
            />
            {/* Caption-overlay nede til venstre */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-bg/60 to-transparent px-5 pb-4 pt-10">
              <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-index-num">01</p>
              <p className="font-serif text-[13px] italic leading-tight text-paper">
                {works[0].title}
              </p>
            </div>
          </div>

          {/* Bilde 2 — mindre (Art2: semi realistic skull) */}
          <div className="relative min-h-0 flex-[2] overflow-hidden bg-panel">
            <Image
              src={works[1].src}
              alt={works[1].title}
              width={720}
              height={480}
              className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.02]"
              style={{ filter: 'grayscale(20%) contrast(1.05)' }}
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-bg/60 to-transparent px-5 pb-4 pt-8">
              <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-index-num">02</p>
              <p className="font-serif text-[13px] italic leading-tight text-paper">
                {works[1].title}
              </p>
            </div>
          </div>
        </div>

        {/* ---- Mobil: Featured bilde under teksten ---- */}
        {/*                                               */}
        {/* Innrammet med px-pad — ikke full-bleed.       */}
        {/* Rolig presentasjon av hovedarbeidet.          */}
        <div className="px-pad pb-8 md:hidden">
          <div
            className="relative overflow-hidden bg-panel"
            style={{ aspectRatio: '4/5' }}
          >
            <Image
              src={works[0].src}
              alt={works[0].title}
              width={600}
              height={750}
              className="h-full w-full object-cover"
              style={{ filter: 'grayscale(20%) contrast(1.05)' }}
              priority
            />
            {/* Subtil caption overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-bg/55 to-transparent px-4 pb-4 pt-10">
              <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-index-num">01</p>
              <p className="font-serif text-[14px] italic leading-tight text-paper">
                {works[0].title}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  PORTEFØLJE — Horisontal scroll, alle 5 arbeider             */}
      {/*                                                              */}
      {/*  Art1 og Art2 er allerede vist i intro, men gjentas her     */}
      {/*  fordi captions vises, og brukeren ser dem i sammenheng.     */}
      {/* ============================================================ */}
      <section id="portefolje" className="border-t border-rule pt-10 pb-2 md:pt-14">

        {/* Header-rad */}
        <div className="mb-6 flex items-baseline gap-4 px-pad md:mb-8">
          <span className="shrink-0 font-mono text-[9px] uppercase tracking-[0.22em] text-index-num">
            Portefølje
          </span>
          <Ornament className="flex-1" />
          <span
            className="shrink-0 font-serif text-[13px] italic"
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
                className="w-[72vw] shrink-0 sm:w-[54vw] md:w-[300px] lg:w-[340px]"
              >
                <div className="aspect-[3/4] overflow-hidden bg-panel">
                  <Image
                    src={work.src}
                    alt={work.title}
                    width={400}
                    height={533}
                    className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.03]"
                    style={{ filter: 'grayscale(20%) contrast(1.05)' }}
                  />
                </div>
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
            <div className="w-pad shrink-0" />
          </div>
        </div>

        <p
          className="mt-4 px-pad font-mono text-[8px] uppercase tracking-[0.2em] text-index-num"
          style={{ opacity: 0.4 }}
        >
          Scroll →
        </p>
      </section>

      {/* ============================================================ */}
      {/*  OM — Kompakt, to-kolonne på desktop                         */}
      {/* ============================================================ */}
      <section className="border-t border-rule px-pad py-12 md:py-20">
        <div className="mx-auto max-w-3xl">
          <div className="mb-7 flex items-center gap-4">
            <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-index-num">Om</span>
            <span className="block h-px flex-1 bg-rule" />
          </div>

          <div className="grid gap-6 md:grid-cols-[auto_1fr] md:gap-12">
            <div className="shrink-0">
              <Image
                src="/profilbilde.jpeg"
                alt="Trovum Tattoo"
                width={96}
                height={96}
                className="object-cover"
                style={{
                  width: 96,
                  height: 96,
                  filter: 'grayscale(20%) contrast(1.05)',
                  border: '1px solid rgba(237,233,230,0.08)',
                }}
              />
            </div>

            <div>
              <h2 className="mb-3 font-serif text-[22px] italic leading-[1.1] tracking-[-0.02em] text-paper md:text-[26px]">
                Trovum Tattoo
              </h2>
              <p className="mb-3 max-w-[48ch] font-sans text-[13px] leading-[1.8] text-body md:text-[14px]">
                Jeg tatoverer hos Tigr Tattoo i Sandvika og har holdt på siden starten av 2023.
                Jeg jobber hovedsakelig i black and grey, blackwork, dark art og semi realism.
              </p>
              <p className="mb-5 max-w-[48ch] font-sans text-[13px] leading-[1.8] text-body md:text-[14px]">
                Jeg liker motiver med tyngde og kontrast — skaller, katedraler, flaggermus,
                blomster og mørkere fantasy-, film- og bandreferanser. Mye av det jeg lager
                ligger et sted mellom det makabre og det pene.
              </p>
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
