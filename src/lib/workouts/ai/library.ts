import "server-only"
import { mergeExercises } from "@/lib/exercises/catalog"
import { normalizeExerciseFields, normalizeExerciseName } from "@/lib/exercises/normalize"
import type {
  CustomExercise,
  DefaultExerciseOverride,
  Exercise,
} from "@/lib/exercises/types"
import { getAdminFirestore } from "@/lib/server/firebase-admin"
import { defaultExercises } from "@/seeds/default-exercises"
import { filterAvailableExercises } from "./available-exercises"
import { WorkoutAiError } from "./http"
import type { AiWorkoutInput } from "./schemas"

export async function readUserExerciseLibrary(uid: string) {
  const root = getAdminFirestore().collection("users").doc(uid)
  const [customDocs, overrideDocs] = await Promise.all([
    root.collection("exercises").limit(501).get(),
    root.collection("exerciseOverrides").limit(501).get(),
  ])
  if (customDocs.size > 500 || overrideDocs.size > 500)
    throw new WorkoutAiError(
      422,
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

export function prepareAvailableExercises(library: Exercise[], input: AiWorkoutInput) {
  const available = filterAvailableExercises(library, input)
  const availableKeys = new Set(available.map(item => `${item.source}:${item.exerciseId}`))
  if (input.preferredExercises.some(key => !availableKeys.has(key)))
    throw new WorkoutAiError(
      422,
      "Um exercício preferido está indisponível ou não é compatível com o nível e as restrições selecionadas"
    )
  const knownPatterns = new Set(
    library.map(item => normalizeExerciseName(item.movementPattern))
  )
  if (
    input.excludedMovementPatterns.some(
      pattern => !knownPatterns.has(normalizeExerciseName(pattern))
    )
  )
    throw new WorkoutAiError(422, "Atualize a seleção de movimentos da sua biblioteca")
  if (!available.length)
    throw new WorkoutAiError(
      422,
      "Nenhum exercício compatível foi encontrado, revise as preferências"
    )
  return available
}
export type AvailableExercise = ReturnType<typeof prepareAvailableExercises>[number]
