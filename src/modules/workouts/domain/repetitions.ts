import { z } from "zod"

export function parseRepetitions(value: string) {
  const match = /^(\d{1,3})(?:\s*[-–]\s*(\d{1,3}))?$/.exec(value.trim())
  if (!match) return null
  const min = Number(match[1])
  const max = Number(match[2] ?? match[1])
  return min >= 1 && max >= min && max <= 100 ? { min, max } : null
}

export const repetitionsSchema = z
  .string()
  .trim()
  .max(30)
  .refine(
    value => parseRepetitions(value) !== null,
    "Informe repetições de 1 a 100 ou uma faixa crescente, como 8-12"
  )
