import { describe, expect, it } from 'vitest'
import { inquirySchema, normalizeNorwegianPhoneNumber } from './inquiry'

const validInquiry = {
  name: 'Ola Nordmann',
  email: 'ola@example.com',
  phone: '99999999',
  instagramHandle: '@ola',
  description: 'Jeg ønsker en dark art tatovering på underarmen.',
  bodyPlacement: 'Underarm',
  size: 'Middels',
  style: 'Black and grey',
  budget: '8000',
  desiredTiming: 'Våren',
  firstTattoo: false,
  coverUp: false,
  touchUp: false,
  extraNotes: 'Helst en hverdag.',
}

describe('inquirySchema', () => {
  it('accepts a valid booking inquiry payload', () => {
    expect(inquirySchema.safeParse(validInquiry).success).toBe(true)
  })

  it('rejects invalid email', () => {
    const result = inquirySchema.safeParse({
      ...validInquiry,
      email: 'ikke-en-epost',
    })

    expect(result.success).toBe(false)
  })

  it('rejects descriptions shorter than 10 characters', () => {
    const result = inquirySchema.safeParse({
      ...validInquiry,
      description: 'Kort',
    })

    expect(result.success).toBe(false)
  })

  it('rejects unsupported size values', () => {
    const result = inquirySchema.safeParse({
      ...validInquiry,
      size: 'Tiny',
    })

    expect(result.success).toBe(false)
  })

  it('normalizes Norwegian phone numbers before submission', () => {
    expect(normalizeNorwegianPhoneNumber('+47 999 99 999')).toBe('999 99 999')
    expect(normalizeNorwegianPhoneNumber('0047 999 99 999')).toBe('999 99 999')

    const result = inquirySchema.parse({
      ...validInquiry,
      phone: '+47 999 99 999',
    })

    expect(result.phone).toBe('999 99 999')
  })

  it('accepts missing optional fields', () => {
    const requiredInquiry = {
      name: validInquiry.name,
      email: validInquiry.email,
      phone: validInquiry.phone,
      description: validInquiry.description,
      bodyPlacement: validInquiry.bodyPlacement,
      size: validInquiry.size,
      style: validInquiry.style,
      firstTattoo: validInquiry.firstTattoo,
      coverUp: validInquiry.coverUp,
      touchUp: validInquiry.touchUp,
    }

    expect(inquirySchema.safeParse(requiredInquiry).success).toBe(true)
  })
})
