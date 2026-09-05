import { z } from "zod"
import { textSchema } from "@/lib/schemas-zod"
import { methodologyInputSchema } from "@/lib/workouts/methodology/types"
import { workoutFormSchema } from "@/lib/workouts/schemas"

const referenceSchema = z
  .string()
  .min(1)
  .max(160)
  .regex(/^(default|custom):[^/]+$/, "Selecione um exercício válido")

export const safetyQuestions = [
  { value: "acutePain", label: "Dor intensa ou aguda" },
  { value: "unassessedInjury", label: "Lesão ainda não avaliada" },
  { value: "medicalRestriction", label: "Restrição médica para exercícios" },
  {
    value: "effortSymptoms",
    label: "Sintomas durante esforço, como tontura, falta de ar ou dor no peito",
  },
  { value: "recentSurgery", label: "Recuperação recente de cirurgia" },
  { value: "cardiovascular", label: "Condição cardiovascular sem liberação profissional" },
  {
    value: "needsAdaptation",
    label: "Condição que exige adaptação além de excluir um movimento",
  },
  { value: "otherPainOrInjury", label: "Outras dores ou lesões" },
] as const

const safetyValues = safetyQuestions.map(item => item.value) as [
  (typeof safetyQuestions)[number]["value"],
  ...(typeof safetyQuestions)[number]["value"][],
]

export const aiWorkoutInputSchema = methodologyInputSchema
  .safeExtend({
    name: textSchema,
    preferredExercises: z.array(referenceSchema).max(30, "Escolha até 30 exercícios"),
    avoidedExercises: z.array(referenceSchema).max(100, "Escolha até 100 exercícios"),
    excludedMovementPatterns: z.array(z.string().trim().max(150)).max(100),
    healthNotes: z.string().trim().max(500, "Use até 500 caracteres"),
    additionalNotes: z.string().trim().max(500, "Use até 500 caracteres"),
    safetyFlags: z.array(z.enum(safetyValues)).max(safetyQuestions.length),
    safetyConfirmed: z
      .boolean()
      .refine(Boolean, "Leia e confirme a informação de segurança"),
  })
  .strict()
  .superRefine((value, context) => {
    if (value.preferredExercises.some(item => value.avoidedExercises.includes(item)))
      context.addIssue({
        code: "custom",
        path: ["preferredExercises"],
        message: "Um exercício preferido não pode estar entre os evitados",
      })
  })

export type AiWorkoutInput = z.infer<typeof aiWorkoutInputSchema>

export const aiWorkoutResultSchema = z.object({
  plan: workoutFormSchema,
  notices: z.array(z.string().max(500)).max(30),
})

export type AiWorkoutResult = z.infer<typeof aiWorkoutResultSchema>
