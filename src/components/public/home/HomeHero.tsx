import { Logo } from '@/components/Logo'
import { Btn } from '@/components/ui/Btn'
import { Eyebrow } from '@/components/ui/Eyebrow'

export function HomeHero() {
  return (
    <section className='relative overflow-hidden px-6 pb-10 pt-8 md:px-12 md:pb-24 md:pt-20 lg:px-12'>
      <div className='pointer-events-none absolute inset-0 flex items-end justify-center pb-4 select-none md:items-center md:pb-0'>
        <Logo context='hero-watermark' />
      </div>

      <div className='relative z-10 mx-auto max-w-3xl'>
        <Eyebrow withLine className='mb-4 md:mb-6'>Tatovør i Sandvika</Eyebrow>
        <h1 className='mb-4 font-serif italic text-[36px] leading-[0.95] tracking-[-0.02em] text-paper sm:text-[44px] md:mb-6 md:text-[clamp(48px,6.5vw,68px)]'>
          Dark art &amp; custom&nbsp;design
        </h1>
        <p
          className='mb-7 max-w-[28ch] font-serif italic text-[15px] leading-[1.5] md:mb-10 md:max-w-[30ch] md:text-[17px]'
          style={{ color: 'rgba(237,233,230,0.55)' }}
        >
          Skreddersydde tatoveringer fra bunnen av — hvert motiv tegnet for deg.
        </p>
        <Btn href='/book' variant='action-cta' className='sm:max-w-sm'>
          Send bookingforespørsel
        </Btn>
      </div>
    </section>
  )
}
