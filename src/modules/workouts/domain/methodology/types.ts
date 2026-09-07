import { z } from "zod"
import { experiencesValues, goalsValues, muscleGroupValues } from "@/lib/values-zod"
import type { MuscleGroup } from "@/modules/exercises/domain/exercise"

export const methodologyInputSchema = z
  .object({
    goal: z.enum(goalsValues, "Selecione seu objetivo de treino"),
    experienceLevel: z.enum(experiencesValues, "Selecione seu nível de experiência"),
    daysPerWeek: z
      .number({ error: "Campo obrigatório" })
      .int("Informe um número inteiro")
      .min(1, "Informe no mínimo 1 dia")
      .max(7, "Informe no máximo 7 dias"),
    durationMinutes: z
      .number({ error: "Campo obrigatório" })
      .int("Informe um número inteiro")
      .min(10, "Reserve pelo menos 10 minutos")
      .max(180, "Reserve no máximo 180 minutos"),
    priorityMuscleGroups: z
      .array(z.enum(muscleGroupValues, "Selecione um grupo muscular válido"))
      .max(muscleGroupValues.length, "Selecione apenas os grupos musculares disponíveis"),
    excludedMuscleGroups: z
      .array(z.enum(muscleGroupValues, "Selecione um grupo muscular válido"))
      .max(muscleGroupValues.length, "Selecione apenas os grupos musculares disponíveis"),
  })
  .superRefine((value, context) => {
    for (const field of ["priorityMuscleGroups", "excludedMuscleGroups"] as const) {
      if (new Set(value[field]).size !== value[field].length)
        context.addIssue({
          code: "custom",
          path: [field],
          message: "Não repita grupos musculares",
        })
    }
    if (
      value.priorityMuscleGroups.some(group => value.excludedMuscleGroups.includes(group))
    )
      context.addIssue({
        code: "custom",
        path: ["priorityMuscleGroups"],
        message: "Um grupo prioritário não pode ser excluído",
      })
    if (value.excludedMuscleGroups.length === muscleGroupValues.length)
      context.addIssue({
        code: "custom",
        path: ["excludedMuscleGroups"],
        message: "Mantenha pelo menos um grupo disponível",
      })
  })

export type MethodologyInput = z.infer<typeof methodologyInputSchema>

export type Goal = MethodologyInput["goal"]

export type ExperienceLevel = MethodologyInput["experienceLevel"]

export type Range = { min: number; max: number }

export type ExerciseKind = "compound" | "isolation"

export type ExerciseRules = {
  sets: Range
  repetitions: string[]
  restSeconds: Range
  targetRir: Range
}

export type WorkoutPrescription = {
  goal: Goal
  experienceLevel: ExperienceLevel
  daysPerWeek: number
  durationMinutes: number
  suggestedSplit: string[]
  weeklyVolumeByMuscleGroup: Record<MuscleGroup, Range & { target: number }>
  compoundExerciseRules: ExerciseRules
  isolationExerciseRules: ExerciseRules
  preferredFrequencyByMuscleGroup: number
  maxExercisesPerDay: number
  // Indices de dias da semana, começando em zero, para avaliar recuperação.
  trainingWeekdays: number[]
  priorityMuscleGroups: MuscleGroup[]
  excludedMuscleGroups: MuscleGroup[]
  guidance: string[]
  feasibilityWarnings: string[]
}
