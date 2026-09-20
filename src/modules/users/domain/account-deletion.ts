import { z } from "zod"

export const accountDeletionSchema = z.object({
  password: z.string().min(1, "Informe sua senha"),
})

export type AccountDeletionInput = z.infer<typeof accountDeletionSchema>
