import { difficulties, muscleGroups, muscles, origins } from "../options-select"

export type MuscleGroup = (typeof muscleGroups)[number]["value"]
export type Muscle = (typeof muscles)[number]["value"]
export type ExerciseSource = (typeof origins)[number]["value"]
export type ExerciseDifficulty = (typeof difficulties)[number]["value"]

interface ExerciseBase {
  id: string
  name: string
  muscleGroup: MuscleGroup
  primaryMuscles: Muscle[]
  secondaryMuscles: Muscle[]
  difficulty: ExerciseDifficulty
  movementPattern: string
  startingPosition: string
  movementExecution: string
  importantCautions: string
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

export type ExerciseInput = Omit<CustomExercise, "id" | "source" | "normalizedName">

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
