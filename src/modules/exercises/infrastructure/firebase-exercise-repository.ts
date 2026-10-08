import type { ExerciseRepository } from "@/modules/exercises/application/ports/exercise-repository"
import {
  createCustomExerciseRepository,
  deleteCustomExerciseRepository,
  deleteDefaultExerciseOverrideRepository,
  listCustomExercisesRepository,
  listDefaultExerciseOverridesRepository,
  saveDefaultExerciseOverrideRepository,
  updateCustomExerciseRepository,
} from "./firebase-exercise-data-source"

export const firebaseExerciseRepository: ExerciseRepository = {
  listCustom: listCustomExercisesRepository,
  listDefaultOverrides: listDefaultExerciseOverridesRepository,
  createCustom: createCustomExerciseRepository,
  updateCustom: updateCustomExerciseRepository,
  saveDefaultOverride: saveDefaultExerciseOverrideRepository,
  deleteCustom: deleteCustomExerciseRepository,
  deleteDefaultOverride: deleteDefaultExerciseOverrideRepository,
}
