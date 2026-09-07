import { z } from "zod"

export const accountDeletionConfirmation = "excluir permanentemente"

export const accountDeletionSchema = z.object({
  confirmation: z.literal(accountDeletionConfirmation, {
    error: "Digite a frase de confirmação exatamente como exibida",
  }),
})

export type AccountDeletionInput = z.infer<typeof accountDeletionSchema>
