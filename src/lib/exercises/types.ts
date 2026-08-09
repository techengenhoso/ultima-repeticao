import type { Timestamp } from "firebase/firestore"

export const muscleGroups = [
  { value: "adductors", label: "Adutores" },
  { value: "forearms", label: "Antebraços" },
  { value: "biceps", label: "Bíceps" },
  { value: "core", label: "Core" },
  { value: "full_body", label: "Corpo inteiro" },
  { value: "back", label: "Costas" },
  { value: "glutes", label: "Glúteos" },
  { value: "lower_back", label: "Lombar" },
  { value: "shoulders", label: "Ombros" },
  { value: "calves", label: "Panturrilhas" },
  { value: "chest", label: "Peito" },
  { value: "hamstrings", label: "Posteriores de coxa" },
  { value: "quadriceps", label: "Quadríceps" },
  { value: "triceps", label: "Tríceps" },
]

export const sourceGroups = [
  { value: "system", label: "Padrão" },
  { value: "custom", label: "Meus exercícios" },
]

export const exerciseLevels = [
  { value: "beginner", label: "Iniciante" },
  { value: "intermediate", label: "Intermediário" },
  { value: "advanced", label: "Avançado" },
]

export type MuscleGroup = (typeof muscleGroups)[number]["value"]
export type SourceGroup = (typeof sourceGroups)[number]["value"]
export type ExerciseLevel = (typeof exerciseLevels)[number]["value"]

interface ExerciseBase {
  id: string
  name: string
  muscleGroup: MuscleGroup
  primaryMuscles: string[]
  secondaryMuscles: string[]
  level: ExerciseLevel
  movementPattern: string
  startingPosition: string
  movementExecution: string
  importantCautions: string
}

export interface SystemExercise extends ExerciseBase {
  source: "system"
  isCustomized?: boolean
}

export interface CustomExercise extends ExerciseBase {
  source: "custom"
  normalizedName: string
  createdAt: Timestamp
  updatedAt: Timestamp
}

export type Exercise = SystemExercise | CustomExercise

export type ExerciseInput = Omit<
  CustomExercise,
  "id" | "source" | "normalizedName" | "createdAt" | "updatedAt"
>

export type SystemExerciseOverride = Omit<SystemExercise, "isCustomized"> & {
  isCustomized: true
  createdAt: Timestamp
  updatedAt: Timestamp
}

export const muscleGroupLabel = Object.fromEntries(
  muscleGroups.map(option => [option.value, option.label])
) as Record<MuscleGroup, string>

export const exerciseLevelLabel = Object.fromEntries(
  exerciseLevels.map(option => [option.value, option.label])
) as Record<ExerciseLevel, string>
