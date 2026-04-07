'use client'

export function ErrorFallback({
  error,
  reset,
  context,
}: {
  error: Error & { digest?: string }
  reset: () => void
  context?: string
}) {
  return (
    <div className='py-10 px-5 flex justify-center'>
      <div className='bg-panel border border-rule px-8 py-8 max-w-[480px] w-full text-center'>
        <h2 className='font-sans font-medium text-[14px] mb-3' style={{ color: '#af8c87' }}>
          Noe gikk galt{context ? ` i ${context}` : ''}
        </h2>
        <p className='font-sans text-[13px] text-mast-left mb-5 leading-[1.7]'>
          {error.message || 'En uventet feil oppstod. Prøv igjen eller kontakt support.'}
        </p>
        <button
          onClick={reset}
          className='font-sans text-[8.5px] tracking-[0.12em] uppercase min-h-[44px] px-6 border border-rule text-nav hover:text-paper hover:border-[rgba(237,233,230,0.38)] hover:bg-[rgba(237,233,230,0.04)] transition-colors duration-[200ms] cursor-pointer'
          style={{ background: 'transparent' }}
        >
          Prøv igjen
        </button>
      </div>
    </div>
  )
}
