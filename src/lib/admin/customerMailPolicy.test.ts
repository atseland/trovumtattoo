import { describe, expect, it } from 'vitest'
import { createCustomerMailDraft } from '@convex/mail/customerMailPolicy'

describe('customer mail policy', () => {
  it('uses the selected customer email as the only recipient', () => {
    const draft = createCustomerMailDraft({
      client: { email: ' Kunde@Example.com ' },
      subject: 'Hei fra Trovum',
      body: 'Vi følger opp prosjektet ditt.',
    })

    expect(draft.to).toEqual(['Kunde@Example.com'])
    expect(draft.subject).toBe('Hei fra Trovum')
    expect(draft.body).toBe('Vi følger opp prosjektet ditt.')
  })

  it('rejects invalid customer context and blank content', () => {
    expect(() =>
      createCustomerMailDraft({
        client: null,
        subject: 'Hei',
        body: 'Melding',
      }),
    ).toThrow('existing customer')

    expect(() =>
      createCustomerMailDraft({
        client: { email: 'kunde@example.com' },
        subject: '   ',
        body: 'Melding',
      }),
    ).toThrow('Subject is required')

    expect(() =>
      createCustomerMailDraft({
        client: { email: 'ikke-epost' },
        subject: 'Hei',
        body: 'Melding',
      }),
    ).toThrow('valid customer email')
  })
})
