import type { MethodologyInput } from "../methodology/types"

export type WorkoutGenerationInput = MethodologyInput & {
  name: string
  preferredExercises: string[]
  avoidedExercises: string[]
  excludedMovementPatterns: string[]
  healthNotes: string
  additionalNotes: string
  safetyFlags: string[]
  safetyConfirmed: boolean
}
