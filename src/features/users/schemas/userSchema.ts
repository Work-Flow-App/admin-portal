import { z } from 'zod'

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  role: z.enum(['admin', 'member', 'viewer']),
  createdAt: z.string().datetime(),
})

export type User = z.infer<typeof userSchema>

export const inviteUserSchema = z.object({
  email: z.string().email('Valid email required'),
  role: z.enum(['admin', 'member', 'viewer']),
})

export type InviteUserInput = z.infer<typeof inviteUserSchema>
