interface CustomerMailClient {
  email: string
}

interface CustomerMailDraftInput {
  client: CustomerMailClient | null
  subject: string
  body: string
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function createCustomerMailDraft({ client, subject, body }: CustomerMailDraftInput) {
  if (!client) {
    throw new Error('New outbound mail must be scoped to an existing customer')
  }

  const customerEmail = client.email.trim()
  const normalizedSubject = subject.trim()
  const normalizedBody = body.trim()

  if (!EMAIL_PATTERN.test(customerEmail)) {
    throw new Error('Customer must have a valid customer email')
  }
  if (!normalizedSubject) {
    throw new Error('Subject is required')
  }
  if (normalizedSubject.length > 500) {
    throw new Error('Subject too long')
  }
  if (!normalizedBody) {
    throw new Error('Body is required')
  }
  if (normalizedBody.length > 100_000) {
    throw new Error('Body too long')
  }

  return {
    to: [customerEmail],
    subject: normalizedSubject,
    body: normalizedBody,
  }
}
