import { describe, expect, it } from 'vitest'
import { exampleSchema } from './example'

describe('exampleSchema', () => {
  it('accepts valid input', () => {
    expect(exampleSchema.safeParse({ title: 'Hello' }).success).toBe(true)
  })

  it('rejects invalid input', () => {
    expect(exampleSchema.safeParse({ title: 'A' }).success).toBe(false)
  })
})
