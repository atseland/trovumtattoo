import type { InquiryFormValues } from '@/lib/validators/inquiry'
import type { UseFormSetValue } from 'react-hook-form'

const requestTypes = [
  { value: 'firstTattoo', label: 'Dette er min første tatovering' },
  { value: 'newTattoo', label: 'Dette er en ny tatovering' },
  { value: 'coverUp', label: 'Dette er en cover-up' },
  { value: 'touchUp', label: 'Dette er en touch-up' },
] as const

type TattooRequestType = (typeof requestTypes)[number]['value']

function mapRequestType(value: TattooRequestType) {
  return {
    firstTattoo: value === 'firstTattoo',
    coverUp: value === 'coverUp',
    touchUp: value === 'touchUp',
  }
}

interface BookingFlagsSectionProps {
  setValue: UseFormSetValue<InquiryFormValues>
}

export function BookingFlagsSection({ setValue }: BookingFlagsSectionProps) {
  function handleChange(value: TattooRequestType) {
    const mapped = mapRequestType(value)
    setValue('firstTattoo', mapped.firstTattoo, { shouldDirty: true, shouldValidate: true })
    setValue('coverUp', mapped.coverUp, { shouldDirty: true, shouldValidate: true })
    setValue('touchUp', mapped.touchUp, { shouldDirty: true, shouldValidate: true })
  }

  return (
    <div className='flex flex-col gap-3'>
      {requestTypes.map(({ value, label }) => (
        <label
          key={value}
          className='flex items-center gap-3 cursor-pointer font-sans text-[14px] text-body min-h-[44px]'
        >
          <input
            name='tattooRequestType'
            type='radio'
            value={value}
            defaultChecked={value === 'newTattoo'}
            onChange={() => handleChange(value)}
            className='w-5 h-5 shrink-0 accent-accent'
          />
          {label}
        </label>
      ))}
    </div>
  )
}
