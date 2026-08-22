import { z } from "zod"
import { parseBrazilianDate } from "./date"

export const requiredSchema = z.string().trim().min(1, "Campo obrigatório")

export const textSchema = z
  .string()
  .trim()
  .min(3, "Deve ter no mínimo 3 caracteres")
  .max(100, "Deve ter no máximo 100 caracteres")

export const textLongSchema = z
  .string()
  .trim()
  .min(10, "Deve ter no mínimo 10 caracteres")
  .max(1000, "Deve ter no máximo 1000 caracteres")

export const emailSchema = z.email("Informe um e-mail válido")

export const passwordSchema = z
  .string()
  .trim()
  .min(8, "Deve ter no mínimo 8 caracteres")
  .max(50, "Deve ter no máximo 50 caracteres")
  .regex(/[a-z]/, "Deve ter pelo menos uma letra minúscula")
  .regex(/[A-Z]/, "Deve ter pelo menos uma letra maiúscula")
  .regex(/[0-9]/, "Deve ter pelo menos um número")

export const dateSchema = z
  .string()
  .trim()
  .refine(value => {
    return !value || parseBrazilianDate(value)
  }, "Use o formato DD/MM/AAAA")
  .refine(value => {
    const now = new Date().toISOString().slice(0, 10)
    return !value || (parseBrazilianDate(value) ?? "") <= now
  }, "A data não pode ser futura")

export const genderSchema = z
  .enum(["male", "female", "other"], "Informe um gênero válido")
  .or(z.literal(""))

export const goalSchema = z
  .enum(
    ["hypertrophy", "weightLoss", "conditioning", "strength", "qualityOfLife"],
    "Informe um objetivo válido"
  )
  .or(z.literal(""))

export const experienceSchema = z
  .enum(
    ["beginner", "basic", "intermediate", "advanced", "expert"],
    "Informe uma experiencia válida"
  )
  .or(z.literal(""))
