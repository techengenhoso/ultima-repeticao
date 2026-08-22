import { z } from "zod"
import { exerciseLevels, muscleGroups } from "@/lib/exercises/types"
import { textLongSchema, textSchema } from "../schemas-zod"

const muscleGroupValues = muscleGroups.map(item => item.value) as [
  (typeof muscleGroups)[number]["value"],
  ...(typeof muscleGroups)[number]["value"][],
]

const exerciseLevelValues = exerciseLevels.map(item => item.value) as [
  (typeof exerciseLevels)[number]["value"],
  ...(typeof exerciseLevels)[number]["value"][],
]

export const exerciseSchema = z
  .object({
    name: textSchema,
    muscleGroup: z.enum(muscleGroupValues, "Selecione o grupo muscular"),
    primaryMuscles: z
      .array(textSchema)
      .min(1, "Selecione pelo menos um músculo principal")
      .max(20),
    secondaryMuscles: z.array(textSchema).max(20),
    level: z.enum(exerciseLevelValues, { error: "Selecione o nível" }),
    movementPattern: textSchema,
    startingPosition: textLongSchema,
    movementExecution: textLongSchema,
    importantCautions: textLongSchema,
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
