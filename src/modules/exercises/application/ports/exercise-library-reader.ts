import type { Exercise } from "../../domain/exercise"

export interface ExerciseLibraryReader {
  list(uid: string): Promise<Exercise[]>
}
