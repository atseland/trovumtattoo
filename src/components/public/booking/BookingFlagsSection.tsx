import type { BookingFormSectionProps } from '@/components/public/booking/bookingFormTypes'

const bookingFlags = [
  { name: 'firstTattoo', label: 'Dette er min første tatovering' },
  { name: 'coverUp', label: 'Dette er en cover-up' },
  { name: 'touchUp', label: 'Dette er en touch-up' },
] as const

export function BookingFlagsSection({ register }: Pick<BookingFormSectionProps, 'register'>) {
  return (
    <div className='flex flex-col gap-3'>
      {bookingFlags.map(({ name, label }) => (
        <label
          key={name}
          className='flex items-center gap-3 cursor-pointer font-sans text-[14px] text-body min-h-[44px]'
        >
          <input
            {...register(name)}
            type='checkbox'
            className='w-5 h-5 shrink-0 accent-accent'
          />
          {label}
        </label>
      ))}
    </div>
  )
}
