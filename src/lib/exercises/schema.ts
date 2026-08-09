import { z } from "zod"
import { exerciseLevels, muscleGroups } from "@/lib/exercises/types"

const muscleGroupValues = muscleGroups.map(item => item.value) as [
  (typeof muscleGroups)[number]["value"],
  ...(typeof muscleGroups)[number]["value"][],
]

const exerciseLevelValues = exerciseLevels.map(item => item.value) as [
  (typeof exerciseLevels)[number]["value"],
  ...(typeof exerciseLevels)[number]["value"][],
]

const requiredText = (label: string, maximum = 500) =>
  z
    .string()
    .trim()
    .min(1, `Informe ${label}`)
    .max(maximum, `Use no máximo ${maximum} caracteres`)

export const exerciseSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, "Deve ter pelo menos 3 caracteres")
      .max(30, "Deve ter no máximo 30 caracteres"),
    muscleGroup: z.enum(muscleGroupValues, "Selecione o grupo muscular"),
    primaryMuscles: z
      .array(requiredText("o músculo principal", 100))
      .min(1, "Selecione pelo menos um músculo principal")
      .max(20),
    secondaryMuscles: z.array(requiredText("o músculo secundário", 100)).max(20),
    level: z.enum(exerciseLevelValues, { error: "Selecione o nível" }),
    movementPattern: requiredText("o padrão de movimento", 150),
    startingPosition: requiredText("a posição inicial", 1000),
    movementExecution: requiredText("a execução do movimento", 1000),
    importantCautions: requiredText("os cuidados importantes", 1000),
  })
  .refine(
    values =>
      !values.secondaryMuscles.some(secondary =>
        values.primaryMuscles.includes(secondary)
      ),
    {
      message: "Um músculo principal não pode ser selecionado como secundário",
      path: ["secondaryMuscles"],
    }
  )

export type ExerciseFormValues = z.infer<typeof exerciseSchema>
