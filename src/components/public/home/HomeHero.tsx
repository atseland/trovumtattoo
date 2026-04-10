import { Logo } from '@/components/Logo'
import { Btn } from '@/components/ui/Btn'
import { Eyebrow } from '@/components/ui/Eyebrow'

export function HomeHero() {
  return (
    <section className='relative flex min-h-[100svh] flex-col justify-start overflow-hidden px-5 pb-20 pt-[28svh] md:justify-center md:pt-0 lg:px-12'>
      <div className='pointer-events-none absolute inset-0 flex items-center justify-center select-none'>
        <Logo context='hero-watermark' />
      </div>

      <div className='relative z-10 max-w-[600px]'>
        <Eyebrow withLine className='mb-6'>Tatovør i Sandvika</Eyebrow>
        <h1 className='mb-6 font-serif italic text-[44px] leading-[0.92] tracking-[-0.025em] text-paper md:text-[clamp(48px,7vw,72px)]'>
          Dark art &amp; custom&nbsp;design
        </h1>
        <p
          className='mb-10 max-w-[28ch] font-serif italic text-[17px] leading-[1.4]'
          style={{ color: 'rgba(237,233,230,0.60)' }}
        >
          Skreddersydde tatoveringer fra bunnen av — hvert motiv tegnet for deg.
        </p>
        <Btn href='/book' variant='action-cta' className='max-w-sm'>
          Send bookingforespørsel
        </Btn>
      </div>
    </section>
  )
}
