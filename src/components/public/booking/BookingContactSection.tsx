import type { BookingFormSectionProps } from '@/components/public/booking/bookingFormTypes'
import { InputField } from '@/components/ui/FormField'

export function BookingContactSection({ register, errors }: BookingFormSectionProps) {
  return (
    <>
      <InputField
        label='Fullt navn *'
        error={errors.name?.message}
        placeholder='Ola Nordmann'
        {...register('name')}
      />

      <InputField
        label='E-post *'
        type='email'
        error={errors.email?.message}
        placeholder='ola@example.com'
        {...register('email')}
      />

      <InputField
        label='Telefonnummer *'
        type='tel'
        error={errors.phone?.message}
        placeholder='000 00 000'
        {...register('phone')}
      />

      <InputField
        label='Instagram-handle'
        optional
        error={errors.instagramHandle?.message}
        placeholder='@bruker'
        {...register('instagramHandle')}
      />
    </>
  )
}
