import { z } from "zod"

export const fullNameSchema = z
  .string()
  .trim()
  .min(3, "Deve ter pelo menos 3 caracteres")
  .max(100, "Deve ter no máximo 100 caracteres")

export const emailSchema = z.email("Informe um valor válido")

export const passwordSchema = z
  .string()
  .trim()
  .min(8, "Deve ter pelo menos 8 caracteres")
  .max(50, "Deve ter no máximo 50 caracteres")
  .regex(/[a-z]/, "Deve conter pelo menos uma letra minúscula")
  .regex(/[A-Z]/, "Deve conter pelo menos uma letra maiúscula")
  .regex(/[0-9]/, "Deve conter pelo menos um número")
