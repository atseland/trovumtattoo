import Link from 'next/link'

export default function PublicNotFound() {
  return (
    <div className='flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-5 py-10'>
      <h1 className='font-serif italic text-[clamp(64px,12vw,120px)] text-nav leading-[1]'>404</h1>
      <p className='font-sans text-[14px] text-body max-w-[36ch] leading-[1.8]'>
        Siden du leter etter finnes ikke. Den kan ha blitt fjernet eller adressen er feil.
      </p>
      <div className='flex gap-3 flex-wrap justify-center mt-2'>
        <Link
          href='/'
          className='font-sans text-[8.5px] tracking-[0.12em] uppercase min-h-[44px] px-6 border border-rule text-nav hover:text-paper hover:border-[rgba(237,233,230,0.38)] hover:bg-[rgba(237,233,230,0.04)] transition-colors duration-[200ms] no-underline inline-flex items-center'
          style={{ background: 'transparent' }}
        >
          Tilbake til forsiden
        </Link>
        <Link
          href='/book'
          className='font-sans text-[8.5px] tracking-[0.12em] uppercase min-h-[44px] px-6 border border-rule text-nav hover:text-paper hover:border-[rgba(237,233,230,0.38)] hover:bg-[rgba(237,233,230,0.04)] transition-colors duration-[200ms] no-underline inline-flex items-center'
          style={{ background: 'transparent' }}
        >
          Book tatovering
        </Link>
      </div>
    </div>
  )
}
