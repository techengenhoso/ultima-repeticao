import { z } from "zod"
import { parseBrazilianDate } from "./date"
import {
  difficultiesValues,
  experiencesValues,
  gendersValues,
  goalsValues,
  muscleGroupValues,
  musclesValues,
} from "./values-zod"

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
  .enum(gendersValues, "Selecione um gênero válido")
  .or(z.literal(""))

export const goalSchema = z
  .enum(goalsValues, "Selecione um objetivo válido")
  .or(z.literal(""))

export const experienceSchema = z
  .enum(experiencesValues, "Selecione uma experiencia válida")
  .or(z.literal(""))

export const muscleGroupSchema = z
  .enum(muscleGroupValues, "Selecione um grupo muscular válido")
  .or(z.literal(""))
  .refine(Boolean, "Campo obrigatório")

export const primaryMusclesSchema = z
  .array(z.enum(musclesValues, "Selecione um músculo válido"))
  .min(1, "Selecione no mínimo 1 músculo")
  .max(20, "Selecione no máximo 20 músculos")

export const secondaryMusclesSchema = z
  .array(z.enum(musclesValues, "Selecione um músculo válido"))
  .max(20, "Selecione no máximo 20 músculos")

export const difficultiesSchema = z
  .enum(difficultiesValues, "Selecione uma dificuldade válida")
  .or(z.literal(""))
  .refine(Boolean, "Campo obrigatório")
