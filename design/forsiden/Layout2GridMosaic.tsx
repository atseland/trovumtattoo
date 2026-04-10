/**
 * Layout 2: Portfolio-First Mosaic
 *
 * Konsept: Porteføljen ER helten. Besøkeren møter umiddelbart arbeidene
 * i et visuelt mosaikk-grid som fyller viewport. Merkenavnet og CTA-ene
 * flyter oppå bildeveggen. Alt tekst er komprimert og sekundært —
 * bildene bærer estetikken.
 *
 * Kjennetegn:
 * - Hero = portefølje-grid med overlaid branding
 * - Kompakt om-seksjon under griddet
 * - Portefølje-captions avdekkes ved hover (desktop) / under bilde (mobil)
 * - Booking som en ren, kort boks
 * - Minimal vertikal plass brukt på tekst
 *
 * Effektiv for tatovør fordi: Potensielle kunder vil se arbeidet FØR
 * de leser noe. Denne layouten respekterer det.
 */

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
    span: 'row-span-2', // Stor celle
  },
  {
    src: '/artworks/Art2.png',
    title: 'Semi realistic skull',
    caption: 'Halvt engel, halvt demon. Detaljert black and grey på arm.',
    span: '',
  },
  {
    src: '/artworks/Art3.png',
    title: 'Ghost',
    caption: 'Papa Emeritus i black and grey. Bandrelaterte motiver gjør jeg gjerne mer av.',
    span: '',
  },
  {
    src: '/artworks/Art4.png',
    title: 'Blomster',
    caption: 'Semi-realistiske blomster på underarm. Samme ro i uttrykket, bare mykere motiv.',
    span: '',
  },
  {
    src: '/artworks/Art5.png',
    title: 'Traditional bat',
    caption: 'Blackwork med tradisjonell form og mørk vri.',
    span: '',
  },
]

/* ------------------------------------------------------------------ */
/*  Layout                                                             */
/* ------------------------------------------------------------------ */

export default function Layout2GridMosaic() {
  return (
    <div className="min-h-screen bg-bg text-paper">
      {/* ============================================================ */}
      {/*  HERO — Portefølje-grid med overlaid branding                */}
      {/* ============================================================ */}
      <section className="relative min-h-screen">
        {/* Grid av arbeider */}
        <div className="grid h-screen grid-cols-2 grid-rows-[1fr_1fr_1fr] gap-px md:grid-cols-3 md:grid-rows-[1fr_1fr]">
          {works.map((work, index) => (
            <div
              key={work.src}
              className={`group relative overflow-hidden bg-panel ${
                index === 0 ? 'row-span-2 md:row-span-2' : ''
              }`}
            >
              <Image
                src={work.src}
                alt={work.title}
                width={600}
                height={600}
                className="h-full w-full object-cover transition-[transform,filter] duration-700 group-hover:scale-[1.04]"
                style={{ filter: 'grayscale(20%) contrast(1.05)' }}
              />
              {/* Hover overlay med caption */}
              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 via-black/20 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100 md:p-6">
                <span className="mb-1 font-mono text-[9px] uppercase tracking-[0.22em] text-index-num">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="mb-1 font-serif text-[16px] italic leading-tight text-paper md:text-[18px]">
                  {work.title}
                </h3>
                <p className="max-w-[28ch] font-sans text-[12px] leading-[1.5] text-body md:text-[13px]">
                  {work.caption}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Overlaid branding */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          {/* Mørk overlay bak tekst */}
          <div className="rounded-sm px-8 py-6 backdrop-blur-[2px] md:px-12 md:py-8" style={{ background: 'rgba(13,11,9,0.7)' }}>
            <div className="pointer-events-auto text-center">
              <h1 className="mb-2 font-serif text-[clamp(32px,7vw,64px)] italic leading-[0.92] tracking-[-0.03em] text-paper">
                Trovum Tattoo
              </h1>
              <p className="mb-5 font-mono text-[9px] uppercase tracking-[0.22em] md:mb-7" style={{ color: 'rgba(237,233,230,0.5)' }}>
                Dark art &middot; Blackwork &middot; Black and grey
              </p>
              <div className="flex flex-col gap-2 sm:flex-row sm:justify-center sm:gap-3">
                <Btn href="#om" variant="default" className="sm:w-auto">
                  Se arbeider
                </Btn>
                <Btn href="/book" variant="default" className="sm:w-auto">
                  Send melding
                </Btn>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll-indikator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
          <div className="flex flex-col items-center gap-2">
            <span className="font-mono text-[8px] uppercase tracking-[0.22em] text-index-num">Scroll</span>
            <div className="h-6 w-px bg-index-num" style={{ opacity: 0.4 }} />
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  OM + STIL — Kompakt seksjon                                 */}
      {/* ============================================================ */}
      <section id="om" className="border-t border-rule px-6 py-14 md:px-12 md:py-20 lg:px-16">
        <div className="mx-auto max-w-4xl">
          <div className="grid gap-8 md:grid-cols-[1fr_1fr] md:gap-16">
            {/* Venstre: Om */}
            <div>
              <Eyebrow withLine className="mb-5">Om</Eyebrow>

              <div className="mb-5 flex items-center gap-4">
                <Image
                  src="/profilbilde.jpeg"
                  alt="Trovum Tattoo"
                  width={56}
                  height={56}
                  className="rounded-sm object-cover"
                  style={{
                    width: 56,
                    height: 56,
                    filter: 'grayscale(20%) contrast(1.05)',
                    border: '1px solid rgba(237,233,230,0.08)',
                  }}
                />
                <div>
                  <h2 className="font-serif text-[20px] italic leading-[1.15] text-paper">
                    Trovum Tattoo
                  </h2>
                  <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-index-num">
                    Tigr Tattoo, Sandvika
                  </span>
                </div>
              </div>

              <p className="max-w-[44ch] font-sans text-[14px] leading-[1.75] text-body">
                Jeg tatoverer hos Tigr Tattoo i Sandvika og har holdt på siden starten av 2023.
                Jeg jobber hovedsakelig i black and grey, blackwork, dark art og semi realism.
              </p>
            </div>

            {/* Høyre: Stil */}
            <div>
              <Eyebrow withLine className="mb-5">Uttrykk</Eyebrow>

              <p className="mb-5 max-w-[44ch] font-sans text-[14px] leading-[1.75] text-body">
                Jeg liker motiver med tyngde og kontrast — skaller, katedraler, flaggermus,
                blomster og mørkere fantasy-, film- og bandreferanser. Mye av det jeg lager
                ligger et sted mellom det makabre og det pene.
              </p>

              <p className="max-w-[44ch] font-sans text-[14px] leading-[1.75] text-body">
                Mesteparten jeg gjør ligger i sort og grått, med tydelige kontraster og en
                mørkere retning. Jeg trives best når motivet får ha litt karakter.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  PORTEFØLJE — Mobilvennlig visning med captions              */}
      {/* ============================================================ */}
      <section className="border-t border-rule py-14 md:py-20">
        <div className="mx-auto max-w-4xl px-6 md:px-12 lg:px-16">
          <Eyebrow withLine className="mb-3">Portefølje</Eyebrow>
          <p className="mb-8 font-serif text-[15px] italic leading-[1.5] md:text-[17px]" style={{ color: 'rgba(237,233,230,0.45)' }}>
            Et utvalg arbeider som viser retningen jeg jobber i.
          </p>
        </div>

        {/* Mosaikk-grid med captions synlig */}
        <div className="mx-auto max-w-5xl px-6 md:px-12 lg:px-16">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8">
            {works.map((work, index) => (
              <div
                key={work.src}
                className={`group ${index === 0 ? 'sm:col-span-2' : ''}`}
              >
                <div className={`overflow-hidden bg-panel ${index === 0 ? 'aspect-[16/9]' : 'aspect-square'}`}>
                  <Image
                    src={work.src}
                    alt={work.title}
                    width={800}
                    height={index === 0 ? 450 : 800}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    style={{ filter: 'grayscale(20%) contrast(1.05)' }}
                  />
                </div>
                <div className="mt-3 flex items-start gap-3">
                  <span className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.22em] text-index-num">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="font-serif text-[15px] italic leading-tight text-paper">
                      {work.title}
                    </h3>
                    <p className="mt-0.5 font-sans text-[12px] leading-[1.5] text-body">
                      {work.caption}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  BOOKING / KONTAKT                                           */}
      {/* ============================================================ */}
      <section className="border-t border-rule px-6 py-14 md:px-12 md:py-20 lg:px-16">
        <div className="mx-auto max-w-4xl">
          <div className="mx-auto max-w-xl text-center">
            <Eyebrow withLine className="mb-5 justify-center">Kontakt</Eyebrow>

            <h2 className="mb-4 font-serif text-[26px] italic leading-[1.1] tracking-[-0.02em] text-paper md:text-[32px]">
              Ta kontakt
            </h2>

            <p className="mb-3 font-sans text-[14px] leading-[1.7] text-body md:text-[15px]">
              Du trenger ikke ha et ferdig design for å ta kontakt. En referanse,
              en idé eller bare en stemning holder fint.
            </p>
            <p className="mb-3 font-sans text-[14px] leading-[1.7] text-body md:text-[15px]">
              Send melding med motiv, plassering, størrelse og eventuelle referanser,
              så tar vi det derfra.
            </p>

            <p className="mb-8 font-mono text-[10px] uppercase tracking-[0.16em] text-accent">
              Tigr Tattoo &middot; Elias Smithsvei 27 &middot; 1337 Sandvika
            </p>

            <div className="mx-auto max-w-sm space-y-3">
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
