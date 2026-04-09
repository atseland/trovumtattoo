'use client'

import { Btn } from '@/components/ui/Btn'

interface BookingSuccessStateProps {
  onReset: () => void
}

export function BookingSuccessState({ onReset }: BookingSuccessStateProps) {
  return (
    <div className='mx-auto max-w-xl px-6 lg:px-12 py-20 text-center'>
      <h2 className='font-serif italic text-[clamp(28px,5vw,40px)] text-paper leading-[1.1]'>
        Takk for forespørselen!
      </h2>
      <p className='font-sans text-[14px] text-body mt-3 leading-[1.8]'>
        Vi tar kontakt innen 2 virkedager med estimat og mulige tidspunkter.
      </p>
      <div className='mt-8 flex justify-center'>
        <Btn variant='sm' onClick={onReset}>
          Send ny forespørsel
        </Btn>
      </div>
    </div>
  )
}
