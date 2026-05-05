import type { Metadata } from 'next'
import { Btn } from '@/components/ui/Btn'

export const metadata: Metadata = {
  title: 'Trovum Tattoo — Ny nettside kommer',
  description: 'Trovum Tattoo lanserer snart ny nettside. Booking er fortsatt tilgjengelig.',
  alternates: { canonical: 'https://trovumtattoo.no' },
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: 'Trovum Tattoo — Ny nettside kommer',
    description: 'Trovum Tattoo lanserer snart ny nettside. Booking er fortsatt tilgjengelig.',
    url: 'https://trovumtattoo.no',
    type: 'website',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['https://trovumtattoo.no/og-image.jpg'],
  },
}

export default function PublicHomePage() {
  return (
    <section className='flex min-h-[calc(100svh-7rem)] items-center px-pad py-20'>
      <div className='mx-auto w-full max-w-3xl text-center'>
        <div className='mb-8 flex items-center justify-center gap-3 font-mono text-[9px] uppercase tracking-[0.22em] text-index-num'>
          <span className='block h-px w-5 shrink-0 bg-index-num' />
          Trovum Tattoo
          <span className='block h-px w-5 shrink-0 bg-index-num' />
        </div>

        <h1 className='mx-auto mb-6 max-w-[11ch] font-serif text-[clamp(42px,8vw,84px)] italic leading-[0.95] tracking-[-0.02em] text-paper'>
          Ny nettside kommer snart
        </h1>

        <p className='mx-auto mb-10 max-w-[48ch] font-sans text-[14px] leading-[1.8] text-body md:text-[15px]'>
          Vi finpusser den nye digitale opplevelsen. Booking er fortsatt åpen, og henvendelser behandles som normalt.
        </p>

        <div className='mx-auto flex max-w-sm flex-col gap-3 sm:flex-row sm:max-w-none sm:justify-center'>
          <Btn href='/book' variant='action-cta' className='sm:w-auto sm:min-w-56'>
            Send bookingforespørsel
          </Btn>
          <Btn href='https://www.instagram.com/trovumtattoo/' variant='default' className='sm:w-auto sm:min-w-44'>
            Instagram
          </Btn>
        </div>
      </div>
    </section>
  )
}
