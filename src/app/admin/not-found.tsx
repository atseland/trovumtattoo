import Link from 'next/link'

export default function AdminNotFound() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '40vh',
        gap: '16px',
        textAlign: 'center',
        padding: '40px 20px',
      }}
    >
      <span style={{ fontSize: '2.5rem', lineHeight: 1 }}>404</span>
      <h1
        className='font-serif italic'
        style={{ color: '#c9b99a', fontSize: '1.5rem' }}
      >
        Siden ble ikke funnet
      </h1>
      <p style={{ color: '#7a6e62', fontSize: '0.875rem' }}>
        Siden du leter etter eksisterer ikke eller har blitt flyttet.
      </p>
      <Link
        href='/admin'
        style={{
          display: 'inline-block',
          marginTop: '8px',
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
        Tilbake til dashboard
      </Link>
    </div>
  )
}
