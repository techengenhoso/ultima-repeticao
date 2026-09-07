import { statuses } from "@/lib/options-select"
import type { MuscleGroup } from "@/modules/exercises/domain/exercise"

export type Status = (typeof statuses)[number]["value"]

export interface WorkoutExerciseReference {
  source: "default" | "custom"
  exerciseId: string
}

export interface WorkoutExerciseSnapshot {
  name: string
  muscleGroup: MuscleGroup
}

export interface WorkoutExercise {
  id: string
  order: number
  exerciseReference: WorkoutExerciseReference
  exerciseSnapshot: WorkoutExerciseSnapshot
  sets: number
  repetitions: string
  initialLoad: number
  restSeconds?: number
  targetRir?: number
}

export interface WorkoutDay {
  id: string
  name: string
  order: number
  muscleGroups: MuscleGroup[]
  exercises: WorkoutExercise[]
}

export interface Workout {
  id: string
  name: string
  description: string | null
  isActive: boolean
  days: WorkoutDay[]
  /** Instante de criação em milissegundos UTC, independente da persistência. */
  createdAt: number
  /** Instante da última atualização em milissegundos UTC, independente da persistência. */
  updatedAt: number
}

export type WorkoutInput = Pick<Workout, "name" | "description" | "days">

export type WorkoutFormValues = Omit<WorkoutInput, "description"> & {
  description: string
}
