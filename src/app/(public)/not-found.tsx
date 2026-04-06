import Link from 'next/link'

export default function PublicNotFound() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        gap: '16px',
        textAlign: 'center',
        padding: '40px 20px',
      }}
    >
      <h1
        className='font-serif italic'
        style={{ color: '#c9b99a', fontSize: '3rem', lineHeight: 1.1 }}
      >
        404
      </h1>
      <p style={{ color: '#7a6e62', fontSize: '1rem', maxWidth: '360px', lineHeight: '1.6' }}>
        Siden du leter etter finnes ikke. Den kan ha blitt fjernet eller adressen er feil.
      </p>
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '8px' }}>
        <Link
          href='/'
          style={{
            display: 'inline-block',
            padding: '12px 24px',
            background: '#c9933a',
            color: '#0d0c0b',
            borderRadius: '4px',
            textDecoration: 'none',
            fontWeight: '600',
            fontSize: '0.875rem',
            minHeight: '48px',
            lineHeight: '24px',
          }}
        >
          Tilbake til forsiden
        </Link>
        <Link
          href='/book'
          style={{
            display: 'inline-block',
            padding: '12px 24px',
            background: 'transparent',
            color: '#c9b99a',
            border: '1px solid #2a2724',
            borderRadius: '4px',
            textDecoration: 'none',
            fontSize: '0.875rem',
            minHeight: '48px',
            lineHeight: '24px',
          }}
        >
          Book tatovering
        </Link>
      </div>
    </div>
  )
}
