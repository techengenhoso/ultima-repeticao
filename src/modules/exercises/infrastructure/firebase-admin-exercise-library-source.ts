import "server-only"
import type {
  CustomExercise,
  DefaultExerciseOverride,
  Exercise,
} from "@/modules/exercises/domain/exercise"
import { mergeExercises } from "@/modules/exercises/domain/exercise-library"
import { normalizeExerciseFields } from "@/modules/exercises/domain/normalization"
import { getAdminFirestore } from "@/modules/shared/infrastructure/firebase-admin"
import { defaultExercises } from "@/seeds/default-exercises"
import type { ExerciseLibraryReader } from "../application/ports/exercise-library-reader"

export class ExerciseLibraryLimitError extends Error {}

export class FirebaseExerciseLibraryReader implements ExerciseLibraryReader {
  async list(uid: string): Promise<Exercise[]> {
    const root = getAdminFirestore().collection("users").doc(uid)
    const [customDocs, overrideDocs] = await Promise.all([
      root.collection("exercises").limit(501).get(),
      root.collection("exerciseOverrides").limit(501).get(),
    ])
    if (customDocs.size > 500 || overrideDocs.size > 500)
      throw new ExerciseLibraryLimitError(
        "Sua biblioteca excede o tamanho suportado pelo assistente"
      )
    const custom: CustomExercise[] = customDocs.docs.map(item => ({
      ...normalizeExerciseFields(item.data()),
      id: item.id,
      source: "custom",
      normalizedName: "",
    }))
    const overrides: DefaultExerciseOverride[] = overrideDocs.docs.map(item => ({
      ...normalizeExerciseFields(item.data()),
      id: item.id,
      source: "default",
      isCustomized: true,
    }))
    return mergeExercises(defaultExercises, custom, overrides)
  }
}
