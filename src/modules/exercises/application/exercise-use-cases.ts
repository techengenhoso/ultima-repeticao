import type { DefaultExercise, Exercise, ExerciseInput } from "../domain/exercise"
import {
  type ExerciseFilters,
  filterExercises,
  mergeExercises,
} from "../domain/exercise-library"
import type { ExerciseRepository } from "./ports/exercise-repository"

export interface ExerciseUseCases {
  list(uid: string): Promise<Exercise[]>
  filter(exercises: Exercise[], filters: ExerciseFilters): Exercise[]
  save(
    uid: string,
    exercise: Exercise | null | undefined,
    input: ExerciseInput
  ): Promise<Exercise>
  remove(uid: string, exerciseId: string): Promise<void>
}

export function createExerciseUseCases(
  repository: ExerciseRepository,
  defaultExercises: DefaultExercise[]
): ExerciseUseCases {
  return {
    async list(uid) {
      const [custom, overrides] = await Promise.all([
        repository.listCustom(uid),
        repository.listDefaultOverrides(uid),
      ])
      return mergeExercises(defaultExercises, custom, overrides)
    },
    filter: (exercises, filters) => filterExercises(exercises, filters),
    async save(uid, exercise, input) {
      if (exercise?.source === "default")
        return repository.saveDefaultOverride(uid, exercise.id, input)
      if (exercise) return repository.updateCustom(uid, exercise.id, input)
      return repository.createCustom(uid, input)
    },
    remove: (uid, exerciseId) => repository.deleteCustom(uid, exerciseId),
  }
}
