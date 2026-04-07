import Link from 'next/link'

export default function AdminNotFound() {
  return (
    <div className='flex flex-col items-center justify-center min-h-[40vh] gap-4 text-center px-5 py-10'>
      <span className='font-serif italic text-[clamp(48px,8vw,80px)] text-nav leading-[1]'>404</span>
      <h1 className='font-serif italic text-[clamp(20px,3vw,28px)] text-paper leading-[1.1] tracking-[-0.02em]'>
        Siden ble ikke funnet
      </h1>
      <p className='font-sans text-[13px] text-body max-w-[36ch] leading-[1.8]'>
        Siden du leter etter eksisterer ikke eller har blitt flyttet.
      </p>
      <Link
        href='/admin'
        className='font-sans text-[8.5px] tracking-[0.12em] uppercase min-h-[44px] px-6 border border-rule text-nav hover:text-paper hover:border-[rgba(237,233,230,0.38)] hover:bg-[rgba(237,233,230,0.04)] transition-colors duration-[200ms] no-underline inline-flex items-center mt-2'
        style={{ background: 'transparent' }}
      >
        Tilbake til dashboard
      </Link>
    </div>
  )
}
