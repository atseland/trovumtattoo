import type { FieldErrors, UseFormRegister } from 'react-hook-form'
import type { InquiryFormValues } from '@/lib/validators/inquiry'

export interface BookingFormSectionProps {
  register: UseFormRegister<InquiryFormValues>
  errors: FieldErrors<InquiryFormValues>
}
