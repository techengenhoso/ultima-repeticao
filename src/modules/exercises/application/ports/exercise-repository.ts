import type {
  CustomExercise,
  DefaultExerciseOverride,
  ExerciseInput,
} from "../../domain/exercise"

export class DuplicateExerciseNameError extends Error {}

export interface ExerciseRepository {
  listCustom(uid: string): Promise<CustomExercise[]>
  listDefaultOverrides(uid: string): Promise<DefaultExerciseOverride[]>
  createCustom(uid: string, input: ExerciseInput): Promise<CustomExercise>
  updateCustom(uid: string, id: string, input: ExerciseInput): Promise<CustomExercise>
  saveDefaultOverride(
    uid: string,
    id: string,
    input: ExerciseInput
  ): Promise<DefaultExerciseOverride>
  deleteCustom(uid: string, id: string): Promise<void>
}
