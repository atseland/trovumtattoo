import { z } from 'zod'

export const exampleSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
})

export type ExampleInput = z.infer<typeof exampleSchema>
