import { z } from "zod"
import { difficulties, muscleGroups, muscles, origins } from "@/lib/options-select"
import { difficultiesValues, muscleGroupValues, musclesValues } from "@/lib/values-zod"

export type MuscleGroup = (typeof muscleGroups)[number]["value"]
export type Muscle = (typeof muscles)[number]["value"]
export type ExerciseSource = (typeof origins)[number]["value"]
export type ExerciseDifficulty = (typeof difficulties)[number]["value"]

const exerciseNameSchema = z.string().trim().min(3).max(100)
const optionalTextSchema = z.string().trim().max(100)
const optionalLongTextSchema = z.string().trim().max(1000)

const exerciseFieldsSchema = z
  .object({
    name: exerciseNameSchema,
    muscleGroup: z.enum(muscleGroupValues),
    primaryMuscles: z.array(z.enum(musclesValues)).min(1).max(20),
    secondaryMuscles: z.array(z.enum(musclesValues)).max(20),
    difficulty: z.enum(difficultiesValues),
    movementPattern: optionalTextSchema,
    startingPosition: optionalLongTextSchema,
    movementExecution: optionalLongTextSchema,
    importantCautions: optionalLongTextSchema,
  })
  .strict()

function validateMuscleAssignments(
  value: z.infer<typeof exerciseFieldsSchema>,
  context: z.RefinementCtx
) {
  if (value.secondaryMuscles.some(secondary => value.primaryMuscles.includes(secondary)))
    context.addIssue({
      code: "custom",
      message: "Um músculo principal não pode ser selecionado como secundário",
      path: ["secondaryMuscles"],
    })
}

export const exerciseInputSchema = exerciseFieldsSchema.superRefine(
  validateMuscleAssignments
)

export const customExerciseDocumentSchema = exerciseFieldsSchema
  .extend({ normalizedName: z.string().min(3).max(100) })
  .strict()
  .superRefine(validateMuscleAssignments)

export type ExerciseInput = z.infer<typeof exerciseInputSchema>

type ExerciseBase = ExerciseInput & {
  id: string
}

export interface DefaultExercise extends ExerciseBase {
  source: "default"
  isCustomized?: boolean
}

export interface CustomExercise extends ExerciseBase {
  source: "custom"
  normalizedName: string
}

export type Exercise = DefaultExercise | CustomExercise
export type DefaultExerciseOverride = Omit<DefaultExercise, "isCustomized"> & {
  isCustomized: true
}

export const muscleGroupLabel = Object.fromEntries(
  muscleGroups.map(option => [option.value, option.label])
) as Record<MuscleGroup, string>
export const muscleLabel = Object.fromEntries(
  muscles.map(option => [option.value, option.label])
) as Record<Muscle, string>
export const exerciseDifficultyLabel = Object.fromEntries(
  difficulties.map(option => [option.value, option.label])
) as Record<ExerciseDifficulty, string>
