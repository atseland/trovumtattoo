import { Btn } from '@/components/ui/Btn'
import { Eyebrow } from '@/components/ui/Eyebrow'

export function HomeCta() {
  return (
    <section className='border-t border-rule px-6 py-12 md:px-12 md:py-24 lg:px-12'>
      <div className='mx-auto max-w-3xl text-center'>
        <Eyebrow withLine className='mb-3 justify-center'>Book</Eyebrow>
        <h2 className='mb-2 font-serif italic text-[28px] leading-[1.1] tracking-[-0.02em] text-paper sm:text-[38px] md:text-[clamp(38px,4.5vw,48px)]'>
          Klar til å booke?
        </h2>
        <p className='mb-7 font-sans text-[14px] leading-[1.6] text-body'>
          Ta første steg — fyll ut bookingskjemaet.
        </p>
        <div className='mx-auto max-w-sm'>
          <Btn href='/book' variant='action-cta' className='w-full'>
            Book tatovering
          </Btn>
        </div>
      </div>
    </section>
  )
}
