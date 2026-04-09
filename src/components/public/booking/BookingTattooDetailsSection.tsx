import type { BookingFormSectionProps } from '@/components/public/booking/bookingFormTypes'
import { InputField, SelectField, TextareaField } from '@/components/ui/FormField'

export function BookingTattooDetailsSection({ register, errors }: BookingFormSectionProps) {
  return (
    <>
      <TextareaField
        label='Beskriv tattoo-ideen din *'
        error={errors.description?.message}
        placeholder='Fortell om motivet, stemningen, detaljer…'
        {...register('description')}
      />

      <InputField
        label='Plassering på kroppen *'
        error={errors.bodyPlacement?.message}
        placeholder='F.eks. underarm, skulder, legg'
        {...register('bodyPlacement')}
      />

      <SelectField
        label='Størrelse *'
        error={errors.size?.message}
        {...register('size')}
      >
        <option value=''>Velg størrelse</option>
        <option>Liten</option>
        <option>Middels</option>
        <option>Stor</option>
        <option>Veldig stor</option>
      </SelectField>

      <InputField
        label='Ønsket stil *'
        error={errors.style?.message}
        placeholder='F.eks. fine-line, blackwork, realistisk'
        {...register('style')}
      />

      <InputField
        label='Budsjett'
        optional
        error={errors.budget?.message}
        placeholder='F.eks. 2 000–5 000 kr'
        {...register('budget')}
      />

      <InputField
        label='Ønsket tidsrom'
        optional
        error={errors.desiredTiming?.message}
        placeholder='F.eks. sommer 2025, fleksibel'
        {...register('desiredTiming')}
      />
    </>
  )
}
