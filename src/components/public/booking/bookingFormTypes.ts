import type { FieldErrors, UseFormRegister, UseFormSetValue } from 'react-hook-form'
import type { InquiryFormValues } from '@/lib/validators/inquiry'

export interface BookingFormSectionProps {
  register: UseFormRegister<InquiryFormValues>
  setValue?: UseFormSetValue<InquiryFormValues>
  errors: FieldErrors<InquiryFormValues>
}
