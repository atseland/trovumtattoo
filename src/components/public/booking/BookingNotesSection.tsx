import type { BookingFormSectionProps } from '@/components/public/booking/bookingFormTypes'
import { TextareaField } from '@/components/ui/FormField'

export function BookingNotesSection({ register, errors }: BookingFormSectionProps) {
  return (
    <TextareaField
      label='Ekstra kommentarer'
      optional
      error={errors.extraNotes?.message}
      placeholder='Noe annet vi bør vite?'
      className='min-h-[80px]'
      {...register('extraNotes')}
    />
  )
}
