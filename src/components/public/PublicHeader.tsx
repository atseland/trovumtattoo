import Link from 'next/link'

export function PublicHeader() {
  return (
    <header
      className='sticky top-0 z-40 flex items-center justify-between border-b px-5 py-4'
      style={{ background: '#0d0c0b', borderColor: '#2a2724' }}
    >
      <Link href='/' className='font-serif italic text-xl tracking-wide' style={{ color: '#c9b99a' }}>
        Trovum
      </Link>
      <Link
        href='/book'
        className='rounded px-4 py-2 text-sm font-medium transition-opacity hover:opacity-80'
        style={{
          background: '#c9933a',
          color: '#0d0c0b',
          minHeight: '48px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        Book time
      </Link>
    </header>
  )
}
