import { normalizeExerciseName } from "@/lib/exercises/normalize"
import type {
  CustomExercise,
  DefaultExercise,
  DefaultExerciseOverride,
  Exercise,
  ExerciseDifficulty,
  ExerciseSource,
  Muscle,
  MuscleGroup,
} from "@/lib/exercises/types"

export interface ExerciseFilters {
  search: string
  muscle: "" | MuscleGroup
  primaryMuscle: "" | Muscle
  secondaryMuscle: "" | Muscle
  difficulty: "" | ExerciseDifficulty
  source: "" | ExerciseSource
}

export const emptyExerciseFilters: ExerciseFilters = {
  search: "",
  muscle: "",
  primaryMuscle: "",
  secondaryMuscle: "",
  difficulty: "",
  source: "",
}

export function mergeExercises(
  defaultExercises: DefaultExercise[],
  customExercises: CustomExercise[],
  defaultOverrides: DefaultExerciseOverride[]
) {
  const overridesById = new Map(defaultOverrides.map(item => [item.id, item]))

  return [
    ...defaultExercises.map(exercise => overridesById.get(exercise.id) ?? exercise),
    ...customExercises,
  ].sort((left, right) => left.name.localeCompare(right.name, "pt-BR"))
}

export function filterExercises(exercises: Exercise[], filters: ExerciseFilters) {
  const normalizedSearch = normalizeExerciseName(filters.search)

  return exercises.filter(
    exercise =>
      (!normalizedSearch ||
        normalizeExerciseName(exercise.name).includes(normalizedSearch)) &&
      (!filters.muscle || exercise.muscleGroup === filters.muscle) &&
      (!filters.primaryMuscle ||
        exercise.primaryMuscles.includes(filters.primaryMuscle)) &&
      (!filters.secondaryMuscle ||
        exercise.secondaryMuscles.includes(filters.secondaryMuscle)) &&
      (!filters.difficulty || exercise.difficulty === filters.difficulty) &&
      (!filters.source || exercise.source === filters.source)
  )
}
