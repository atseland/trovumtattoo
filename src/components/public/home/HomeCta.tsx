import { Btn } from '@/components/ui/Btn'
import { Eyebrow } from '@/components/ui/Eyebrow'

export function HomeCta() {
  return (
    <section className='px-5 py-20 text-center lg:px-12'>
      <div className='mx-auto max-w-3xl'>
        <Eyebrow withLine className='mb-4 justify-center'>Book</Eyebrow>
        <h2 className='mb-3 font-serif italic text-[clamp(32px,5vw,48px)] leading-[1.1] tracking-[-0.02em] text-paper'>
          Klar til å booke?
        </h2>
        <p className='mb-8 font-sans text-[14px] text-body'>
          Ta første steg — fyll ut bookingskjemaet.
        </p>
        <div className='flex justify-center'>
          <Btn href='/book' variant='action-cta' className='max-w-sm'>
            Book tatovering
          </Btn>
        </div>
      </div>
    </section>
  )
}
