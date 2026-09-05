import type { ExerciseInput, Muscle } from "@/lib/exercises/types"
import { muscles } from "@/lib/options-select"

export function normalizeExerciseName(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .replace(/\s+/g, " ")
    .toLocaleLowerCase("pt-BR")
}

const muscleValueByStoredValue = new Map<string, Muscle>(
  muscles.flatMap(muscle => [
    [muscle.value.toLocaleLowerCase("pt-BR"), muscle.value],
    [muscle.label.toLocaleLowerCase("pt-BR"), muscle.value],
  ])
)

function muscleList(value: unknown) {
  const items = Array.isArray(value)
    ? value
    : typeof value === "string"
      ? value.split(";")
      : []

  return items.flatMap(item => {
    if (typeof item !== "string") return []
    const muscle = muscleValueByStoredValue.get(item.trim().toLocaleLowerCase("pt-BR"))
    return muscle ? [muscle] : []
  })
}

export function normalizeExerciseFields(data: Record<string, unknown>): ExerciseInput {
  const legacyDifficulties = {
    beginner: "easy",
    intermediate: "moderate",
    advanced: "hard",
  } as const
  const difficulty =
    data.difficulty ?? legacyDifficulties[data.level as keyof typeof legacyDifficulties]

  return {
    name: typeof data.name === "string" ? data.name : "Exercício sem nome",
    muscleGroup: data.muscleGroup as ExerciseInput["muscleGroup"],
    primaryMuscles: muscleList(data.primaryMuscles ?? data.primaryMuscle),
    secondaryMuscles: muscleList(data.secondaryMuscles),
    difficulty: difficulty as ExerciseInput["difficulty"],
    movementPattern:
      typeof data.movementPattern === "string" ? data.movementPattern : "Não informado",
    startingPosition:
      typeof data.startingPosition === "string" ? data.startingPosition : "Não informado",
    movementExecution:
      typeof data.movementExecution === "string"
        ? data.movementExecution
        : "Não informado",
    importantCautions:
      typeof data.importantCautions === "string"
        ? data.importantCautions
        : "Não informado",
  }
}
