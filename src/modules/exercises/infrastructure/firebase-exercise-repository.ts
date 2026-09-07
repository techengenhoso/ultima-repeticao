import {
  DuplicateExerciseNameError,
  type ExerciseRepository,
} from "@/modules/exercises/application/ports/exercise-repository"
import {
  createCustomExerciseRepository,
  deleteCustomExerciseRepository,
  DuplicateExerciseNameError as FirebaseDuplicateExerciseNameError,
  listCustomExercisesRepository,
  listDefaultExerciseOverridesRepository,
  saveDefaultExerciseOverrideRepository,
  updateCustomExerciseRepository,
} from "./firebase-exercise-data-source"

export const firebaseExerciseRepository: ExerciseRepository = {
  listCustom: listCustomExercisesRepository,
  listDefaultOverrides: listDefaultExerciseOverridesRepository,
  async createCustom(uid, input) {
    try {
      return await createCustomExerciseRepository(uid, input)
    } catch (error) {
      if (error instanceof FirebaseDuplicateExerciseNameError)
        throw new DuplicateExerciseNameError()
      throw error
    }
  },
  async updateCustom(uid, id, input) {
    try {
      return await updateCustomExerciseRepository(uid, id, input)
    } catch (error) {
      if (error instanceof FirebaseDuplicateExerciseNameError)
        throw new DuplicateExerciseNameError()
      throw error
    }
  },
  saveDefaultOverride: saveDefaultExerciseOverrideRepository,
  deleteCustom: deleteCustomExerciseRepository,
}
