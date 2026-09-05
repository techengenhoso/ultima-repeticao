import { z } from "zod"
import { normalizeExerciseName } from "@/lib/exercises/normalize"
import type { Exercise } from "@/lib/exercises/types"
import { difficultiesValues, muscleGroupValues, musclesValues } from "@/lib/values-zod"
import { defaultExercises } from "@/seeds/default-exercises"
import { classifyMovement } from "./movement-classification"
import type { AiWorkoutInput } from "./schemas"

const libraryExerciseSchema = z.object({
  id: z.string().min(1).max(150),
  source: z.enum(["default", "custom"]),
  name: z.string().trim().min(1).max(100),
  muscleGroup: z.enum(muscleGroupValues),
  primaryMuscles: z.array(z.enum(musclesValues)).min(1).max(20),
  secondaryMuscles: z.array(z.enum(musclesValues)).max(20),
  difficulty: z.enum(difficultiesValues),
  movementPattern: z.string().trim().min(1).max(150),
  importantCautions: z.string().trim().min(1).max(1000),
})

export function filterAvailableExercises(library: Exercise[], input: AiWorkoutInput) {
  const difficultyRank = { easy: 0, moderate: 1, hard: 2 }
  const maxDifficulty = { beginner: 0, basic: 1, intermediate: 1, advanced: 2, expert: 2 }[
    input.experienceLevel
  ]
  const avoided = new Set(input.avoidedExercises)
  const excludedPatterns = new Set(
    input.excludedMovementPatterns.map(normalizeExerciseName)
  )
  // Exclusão conservadora também dos músculos primários/secundários já catalogados.
  const excludedMuscles = new Set(
    defaultExercises
      .filter(
        exercise =>
          exercise.muscleGroup !== "fullBody" &&
          input.excludedMuscleGroups.includes(exercise.muscleGroup)
      )
      .flatMap(exercise => exercise.primaryMuscles)
  )
  const available = library.flatMap(exercise => {
    const parsed = libraryExerciseSchema.safeParse(exercise)
    if (!parsed.success) return []
    const item = parsed.data
    const kind = classifyMovement(item.movementPattern)
    if (!kind || difficultyRank[item.difficulty] > maxDifficulty) return []
    if (
      avoided.has(`${item.source}:${item.id}`) ||
      input.excludedMuscleGroups.includes(item.muscleGroup) ||
      [...item.primaryMuscles, ...item.secondaryMuscles].some(muscle =>
        excludedMuscles.has(muscle)
      )
    )
      return []
    if (excludedPatterns.has(normalizeExerciseName(item.movementPattern))) return []
    return [
      {
        source: item.source,
        exerciseId: item.id,
        name: item.name,
        muscleGroup: item.muscleGroup,
        primaryMuscles: item.primaryMuscles,
        secondaryMuscles: item.secondaryMuscles,
        difficulty: item.difficulty,
        movementPattern: item.movementPattern,
        importantCautions: item.importantCautions,
        kind,
      },
    ]
  })
  return available
}
export type AvailableExercise = ReturnType<typeof filterAvailableExercises>[number]
