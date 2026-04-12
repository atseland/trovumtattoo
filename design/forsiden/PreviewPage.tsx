/**
 * PreviewPage — aktiv fokusert versjon
 *
 * Viser kun layout 4 og 8 (numrene er bevart for konsistens).
 * Se PreviewPage_v1.tsx for alle 8 layouter.
 */

'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'

const layouts = [
  { id: 4, name: 'Typographic Minimal', description: 'Typografidrevet hero, horisontal porteføljescroll' },
  { id: 8, name: 'Portfolio Before About', description: 'L4 med én endring: portefølje og bio byttet om.' },
  { id: 9, name: 'Aleks Edits', description: 'L8 med profilbilde i hero, éin CTA, scroll-indikator og "Om meg"-overskrift.' },
  { id: 10, name: 'Ellen Action', description: 'L9 med nytt profilbilde og actionbilde i "Om meg"-seksjonen.' },
  { id: 11, name: 'Final', description: 'L10 med kortere "Ta kontakt"-tekst og bg-panel for visuelt skifte.' },
]

const loadingFallback = (
  <div className="flex min-h-screen items-center justify-center bg-bg">
    <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-index-num">
      Laster layout...
    </span>
  </div>
)

const Layout4 = dynamic(() => import('./Layout4TypographicMinimal'), { ssr: false, loading: () => loadingFallback })
const Layout8 = dynamic(() => import('./Layout8PortfolioBeforeAbout'), { ssr: false, loading: () => loadingFallback })
const Layout9 = dynamic(() => import('./Layout9AleksEdits'), { ssr: false, loading: () => loadingFallback })
const Layout10 = dynamic(() => import('./Layout10EllenAction'), { ssr: false, loading: () => loadingFallback })
const Layout11 = dynamic(() => import('./Layout11Final'), { ssr: false, loading: () => loadingFallback })

const layoutComponents = [Layout4, Layout8, Layout9, Layout10, Layout11]

export default function PreviewPage() {
  const [active, setActive] = useState(0)
  const [selectorOpen, setSelectorOpen] = useState(true)

  const ActiveLayout = layoutComponents[active]

  return (
    <div className="relative min-h-screen">
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
            {String(layouts[active].id).padStart(2, '0')}
          </button>
        )}
      </div>

      <ActiveLayout />
    </div>
  )
}
