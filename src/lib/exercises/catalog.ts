import { normalizeExerciseName } from "@/lib/exercises/normalize"
import type {
  CustomExercise,
  Exercise,
  MuscleGroup,
  SourceGroup,
  SystemExercise,
  SystemExerciseOverride,
} from "@/lib/exercises/types"

export interface ExerciseFilters {
  search: string
  muscle: "" | MuscleGroup
  source: "" | SourceGroup
}

export const emptyExerciseFilters: ExerciseFilters = {
  search: "",
  muscle: "",
  source: "",
}

export function mergeExercises(
  systemExercises: SystemExercise[],
  customExercises: CustomExercise[],
  systemOverrides: SystemExerciseOverride[]
) {
  const overridesById = new Map(systemOverrides.map(item => [item.id, item]))

  return [
    ...systemExercises.map(exercise => overridesById.get(exercise.id) ?? exercise),
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
      (!filters.source || exercise.source === filters.source)
  )
}
