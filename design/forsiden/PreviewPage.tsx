/**
 * Preview-side for å bytte mellom alle 7 layoutene.
 *
 * Bruk: Legg til en midlertidig rute:
 *   src/app/(public)/design/page.tsx  →  export { default } from '../../../../design/forsiden/PreviewPage'
 *
 * next/dynamic med ssr: false unngår hydration-mismatch fordi
 * serveren aldri renderer layoutkomponentene — kun klienten gjør det.
 */

'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'

const layouts = [
  { id: 1, name: 'Editorial Vertical', description: 'Magasinlayout med alternerende bilde/tekst-par og vertikal rytme' },
  { id: 2, name: 'Portfolio-First Mosaic', description: 'Porteføljen som hero — mosaikk-grid fyller viewport' },
  { id: 3, name: 'Split Cinematic', description: 'Sticky bildepanel + scrollende innhold side om side' },
  { id: 4, name: 'Typographic Minimal', description: 'Typografidrevet hero, horisontal porteføljescroll' },
  { id: 5, name: 'Stacked Immersive', description: 'Full-bleed seksjoner med bakgrunnsbilder og overlay' },
  { id: 6, name: 'Portrait Anchor', description: 'Fremhevet portrettbilde synlig over fold. Resterende 4 i 2×2-grid. Desktop: side-by-side.' },
  { id: 7, name: 'Strip + Act After', description: 'Stripa kommer før CTA. Alle 5 arbeider synlig før siden ber om handling.' },
]

const loadingFallback = (
  <div className="flex min-h-screen items-center justify-center bg-bg">
    <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-index-num">
      Laster layout...
    </span>
  </div>
)

// next/dynamic med ssr: false — ingen SSR, ingen hydration-konflikt
const Layout1 = dynamic(() => import('./Layout1Editorial'), { ssr: false, loading: () => loadingFallback })
const Layout2 = dynamic(() => import('./Layout2GridMosaic'), { ssr: false, loading: () => loadingFallback })
const Layout3 = dynamic(() => import('./Layout3SplitCinematic'), { ssr: false, loading: () => loadingFallback })
const Layout4 = dynamic(() => import('./Layout4TypographicMinimal'), { ssr: false, loading: () => loadingFallback })
const Layout5 = dynamic(() => import('./Layout5StackedImmersive'), { ssr: false, loading: () => loadingFallback })
const Layout6 = dynamic(() => import('./Layout6PortraitAnchor'), { ssr: false, loading: () => loadingFallback })
const Layout7 = dynamic(() => import('./Layout7StripActAfter'), { ssr: false, loading: () => loadingFallback })

const layoutComponents = [Layout1, Layout2, Layout3, Layout4, Layout5, Layout6, Layout7]

export default function PreviewPage() {
  const [active, setActive] = useState(0)
  const [selectorOpen, setSelectorOpen] = useState(true)

  const ActiveLayout = layoutComponents[active]

  return (
    <div className="relative min-h-screen">
      {/* Floating layout selector */}
      <div className="fixed right-4 top-4 z-50">
        {selectorOpen ? (
          <div className="w-72 rounded-sm border border-rule bg-panel/95 p-4 shadow-lg backdrop-blur-sm">
            <div className="mb-3 flex items-center justify-between">
              <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-index-num">
                Layout preview
              </span>
              <button
                onClick={() => setSelectorOpen(false)}
                className="cursor-pointer font-mono text-[10px] text-accent transition-colors hover:text-paper"
              >
                Skjul
              </button>
            </div>
            <div className="space-y-1">
              {layouts.map((layout, index) => (
                <button
                  key={layout.id}
                  onClick={() => { setActive(index); window.scrollTo(0, 0) }}
                  className={`block w-full cursor-pointer rounded-sm px-3 py-2 text-left transition-colors duration-150 ${
                    active === index
                      ? 'bg-[rgba(237,233,230,0.06)] text-paper'
                      : 'text-body hover:bg-[rgba(237,233,230,0.03)] hover:text-paper'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="font-mono text-[9px] text-index-num">
                      {String(layout.id).padStart(2, '0')}
                    </span>
                    <span className="font-sans text-[12px] font-medium">
                      {layout.name}
                    </span>
                  </span>
                  <span className="mt-0.5 block pl-[22px] font-sans text-[10px] leading-[1.4] text-nav">
                    {layout.description}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <button
            onClick={() => setSelectorOpen(true)}
            className="cursor-pointer rounded-sm border border-rule bg-panel/90 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.22em] text-accent shadow-lg backdrop-blur-sm transition-colors hover:text-paper"
          >
            {String(active + 1).padStart(2, '0')} / 07
          </button>
        )}
      </div>

      {/* Active layout — rendres kun på klienten (ssr: false) */}
      <ActiveLayout />
    </div>
  )
}
