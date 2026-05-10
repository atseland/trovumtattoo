'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, ExternalLink, X } from 'lucide-react'

type PortfolioWork = {
  src: string
  title: string
  caption: string
  instagramUrl?: string
}

const works: PortfolioWork[] = [
  {
    src: '/portfolio/Blomster.png',
    title: 'Blomster',
    caption: 'Black and grey blomster-tatovering med myke skygger, ornamentikk og dekorativ innramming.',
  },
  {
    src: '/portfolio/Semi realistic skull.png',
    title: 'Semi realistic skull',
    caption: 'Semi realistisk black and grey hodeskalle med engel- og djevelkontrast.',
  },
  {
    src: '/portfolio/Traditional bat.png',
    title: 'Traditional bat',
    caption: 'Traditional-inspirert blackwork flaggermus-tatovering med roser og tydelige svarte flater.',
  },
  {
    src: '/portfolio/Ghost.png',
    title: 'Ghost',
    caption: 'Black and grey half-and-half portrett av Papa Emeritus IV og V fra bandet Ghost.',
  },
  {
    src: '/portfolio/Ladybug_cathedral mashup.png',
    title: 'Ladybug/cathedral mashup',
    caption:
      'Dark art mashup som kombinerer marihøne, gotisk katedralarkitektur og fin ornamental linjeføring.',
  },
  {
    src: '/portfolio/Flaggermuser.png',
    title: 'Flaggermus',
    caption: 'Clean blackwork-flaggermus med symmetrisk form og tydelig silhuett.',
  },
  {
    src: '/portfolio/Rygg skalle.png',
    title: 'Backpiece',
    caption: 'Påbegynt black and grey backpiece med dyrekranium, blomster og mørk ornamental komposisjon.',
  },
]

function wrapIndex(index: number) {
  if (index < 0) return works.length - 1
  if (index >= works.length) return 0
  return index
}

export function PortfolioCarousel() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const closeButtonRef = useRef<HTMLButtonElement | null>(null)
  const dialogRef = useRef<HTMLDivElement | null>(null)
  const triggerRefs = useRef<Array<HTMLButtonElement | null>>([])
  const activeWork = activeIndex === null ? null : works[activeIndex]
  const activePosition = activeIndex ?? 0

  const closePreview = useCallback(() => {
    const returnIndex = activeIndex
    setActiveIndex(null)
    if (returnIndex !== null) {
      window.requestAnimationFrame(() => triggerRefs.current[returnIndex]?.focus())
    }
  }, [activeIndex])

  useEffect(() => {
    if (activeIndex === null) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') closePreview()
      if (event.key === 'ArrowRight') setActiveIndex((current) => wrapIndex((current ?? 0) + 1))
      if (event.key === 'ArrowLeft') setActiveIndex((current) => wrapIndex((current ?? 0) - 1))
      if (event.key !== 'Tab') return

      const focusable = Array.from(
        dialogRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      )
      const first = focusable[0]
      const last = focusable.at(-1)
      if (!first || !last) return

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [activeIndex, closePreview])

  return (
    <>
      <div className='overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
        <div className='mx-auto flex w-max gap-4 px-6 md:gap-6 md:px-12'>
          {works.map((work, index) => (
            <article key={work.src} className='w-[250px] shrink-0 md:w-[300px]'>
              <button
                ref={(node) => {
                  triggerRefs.current[index] = node
                }}
                type='button'
                onClick={() => setActiveIndex(index)}
                className='group block aspect-[3/4] w-full cursor-zoom-in overflow-hidden border border-transparent bg-panel text-left transition-colors duration-300 hover:border-[rgba(237,233,230,0.22)] focus:outline-none focus-visible:border-accent'
                aria-label={`Åpne ${work.title} i fullscreen`}
              >
                <Image
                  src={work.src}
                  alt={`${work.title}: ${work.caption}`}
                  width={300}
                  height={400}
                  sizes='(min-width: 768px) 300px, 250px'
                  className='h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]'
                  style={{ filter: 'grayscale(20%) contrast(1.05)' }}
                  priority={index === 0}
                />
              </button>
              <div className='mt-3 flex items-start gap-2.5'>
                <span className='mt-0.5 font-mono text-[9px] uppercase tracking-[0.22em] text-index-num'>
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className='font-serif text-[15px] italic leading-tight text-paper'>
                    {work.title}
                  </h3>
                  <p className='mt-1 max-w-[28ch] font-sans text-[12px] leading-[1.5] text-body'>
                    {work.caption}
                  </p>
                </div>
              </div>
            </article>
          ))}
          <div className='w-6 shrink-0 md:w-12' />
        </div>
      </div>

      {activeWork && (
        <div
          ref={dialogRef}
          role='dialog'
          aria-modal='true'
          aria-label={activeWork.title}
          className='fixed inset-0 z-50 flex flex-col bg-[rgba(13,11,9,0.96)] text-paper'
        >
          <div className='flex min-h-14 shrink-0 items-center justify-between border-b border-rule px-4 md:min-h-16 md:px-6'>
            <div className='min-w-0'>
              <p className='font-mono text-[9px] uppercase tracking-[0.22em] text-index-num'>
                Portfolio
              </p>
              <h2 className='truncate font-serif text-[20px] italic leading-tight text-paper md:text-[24px]'>
                {activeWork.title}
              </h2>
            </div>
            <button
              ref={closeButtonRef}
              type='button'
              onClick={closePreview}
              className='flex h-11 w-11 shrink-0 items-center justify-center border border-rule text-nav transition-colors duration-200 hover:border-[rgba(237,233,230,0.34)] hover:text-paper'
              aria-label='Lukk fullscreen'
            >
              <X size={18} strokeWidth={1.7} aria-hidden='true' />
            </button>
          </div>

          <div className='grid min-h-0 flex-1 grid-rows-[minmax(0,1fr)_auto] md:grid-cols-[minmax(0,1fr)_320px] md:grid-rows-1'>
            <div className='relative min-h-0 bg-black/30'>
              <Image
                src={activeWork.src}
                alt={`${activeWork.title}: ${activeWork.caption}`}
                fill
                sizes='100vw'
                className='object-contain'
                priority
              />
              <button
                type='button'
                onClick={() => setActiveIndex((current) => wrapIndex((current ?? 0) - 1))}
                className='absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center border border-rule bg-bg/70 text-paper backdrop-blur transition-colors duration-200 hover:border-[rgba(237,233,230,0.34)] md:left-5'
                aria-label='Forrige bilde'
              >
                <ChevronLeft size={20} aria-hidden='true' />
              </button>
              <button
                type='button'
                onClick={() => setActiveIndex((current) => wrapIndex((current ?? 0) + 1))}
                className='absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center border border-rule bg-bg/70 text-paper backdrop-blur transition-colors duration-200 hover:border-[rgba(237,233,230,0.34)] md:right-5'
                aria-label='Neste bilde'
              >
                <ChevronRight size={20} aria-hidden='true' />
              </button>
            </div>

            <aside className='border-t border-rule bg-panel px-5 py-5 md:border-l md:border-t-0 md:px-6 md:py-6'>
              <p className='mb-3 font-mono text-[9px] uppercase tracking-[0.22em] text-index-num'>
                {String(activePosition + 1).padStart(2, '0')} / {String(works.length).padStart(2, '0')}
              </p>
              <p className='font-sans text-[14px] leading-[1.75] text-body'>
                {activeWork.caption}
              </p>
              {activeWork.instagramUrl && (
                <a
                  href={activeWork.instagramUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='mt-5 inline-flex min-h-10 items-center gap-2 border border-rule px-3 font-sans text-[9px] uppercase tracking-[0.12em] text-nav transition-colors duration-200 hover:text-paper'
                >
                  Åpne Instagram-post
                  <ExternalLink size={13} aria-hidden='true' />
                </a>
              )}
            </aside>
          </div>
        </div>
      )}
    </>
  )
}
