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
    <div style={{ padding: '40px 20px', textAlign: 'center' }}>
      <div
        style={{
          background: '#141210',
          border: '1px solid #2a2724',
          borderRadius: '8px',
          padding: '32px',
          maxWidth: '480px',
          margin: '0 auto',
        }}
      >
        <h2 style={{ color: '#c96b6b', fontSize: '1.1rem', marginBottom: '12px' }}>
          Noe gikk galt{context ? ` i ${context}` : ''}
        </h2>
        <p style={{ color: '#7a6e62', fontSize: '0.875rem', marginBottom: '20px', lineHeight: '1.6' }}>
          {error.message || 'En uventet feil oppstod. Prøv igjen eller kontakt support.'}
        </p>
        <button
          onClick={reset}
          style={{
            padding: '12px 24px',
            background: '#c9933a',
            color: '#0d0c0b',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontWeight: '500',
            minHeight: '48px',
          }}
        >
          Prøv igjen
        </button>
      </div>
    </div>
  )
}
