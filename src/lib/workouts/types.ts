import type { Timestamp } from "firebase/firestore"
import type { MuscleGroup } from "@/lib/exercises/types"

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
  createdAt: Timestamp
  updatedAt: Timestamp
}

export type WorkoutInput = Pick<Workout, "name" | "description" | "days">

export type WorkoutFormValues = Omit<WorkoutInput, "description"> & {
  description: string
}
