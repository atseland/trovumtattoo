import Link from 'next/link'

export function PublicFooter() {
  return (
    <footer
      className='border-t px-5 py-8 text-sm'
      style={{ borderColor: '#2a2724', color: '#7a6e62' }}
    >
      <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <span className='font-serif italic' style={{ color: '#c9b99a' }}>
          Trovum
        </span>
        <div className='flex items-center gap-5'>
          <Link
            href='https://instagram.com/trovumtattoo'
            target='_blank'
            rel='noopener noreferrer'
            className='flex items-center gap-2 transition-colors hover:opacity-80'
            style={{ color: '#7a6e62' }}
          >
            <span>Instagram</span>
            <span>@trovumtattoo</span>
          </Link>
          <a
            href='mailto:kontakt@trovum.no'
            className='transition-colors hover:opacity-80'
            style={{ color: '#7a6e62' }}
          >
            kontakt@trovum.no
          </a>
        </div>
      </div>
    </footer>
  )
}
