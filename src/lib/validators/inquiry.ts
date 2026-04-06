import { z } from 'zod'

export const inquirySchema = z.object({
  name: z.string().min(2, 'Navn er påkrevd'),
  email: z.string().email('Ugyldig e-postadresse'),
  phone: z.string().min(8, 'Telefonnummer er påkrevd'),
  instagramHandle: z.string().optional(),
  description: z.string().min(10, 'Beskriv tattoo-ideen din (min 10 tegn)'),
  bodyPlacement: z.string().min(2, 'Plassering er påkrevd'),
  size: z.enum(['Liten', 'Middels', 'Stor', 'Veldig stor'] as const, {
    error: 'Velg en størrelse',
  }),
  style: z.string().min(2, 'Stil er påkrevd'),
  budget: z.string().optional(),
  desiredTiming: z.string().optional(),
  firstTattoo: z.boolean(),
  coverUp: z.boolean(),
  touchUp: z.boolean(),
  extraNotes: z.string().optional(),
  referenceImages: z
    .custom<FileList>()
    .optional()
    .refine(
      (files) => !files || files.length <= 10,
      'Maks 10 referansebilder'
    )
    .refine(
      (files) => {
        if (!files) return true
        return Array.from(files).every((f) =>
          ['image/jpeg', 'image/png', 'image/webp'].includes(f.type)
        )
      },
      'Kun JPG, PNG eller WebP bilder'
    ),
})

export type InquiryFormValues = z.infer<typeof inquirySchema>
