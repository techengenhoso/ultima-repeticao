import { difficulties, muscleGroups, muscles } from "@/lib/options-select"
import type { ExerciseDifficulty, ExerciseInput, Muscle, MuscleGroup } from "./exercise"

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
    [normalizeStoredValue(muscle.value), muscle.value],
    [normalizeStoredValue(muscle.label), muscle.value],
  ])
)

const muscleGroupValueByStoredValue = new Map<string, MuscleGroup>(
  muscleGroups.flatMap(group => [
    [normalizeStoredValue(group.value), group.value],
    [normalizeStoredValue(group.label), group.value],
  ])
)

const difficultyValueByStoredValue = new Map<string, ExerciseDifficulty>(
  difficulties.flatMap(difficulty => [
    [normalizeStoredValue(difficulty.value), difficulty.value],
    [normalizeStoredValue(difficulty.label), difficulty.value],
  ])
)

const legacyMuscleGroupValueByStoredValue = new Map<string, MuscleGroup>([
  ["full_body", "fullBody"],
  ["lower_back", "lowerBack"],
])

const legacyDifficultyValueByStoredValue = new Map<string, ExerciseDifficulty>([
  ["beginner", "easy"],
  ["intermediate", "moderate"],
  ["advanced", "hard"],
])

function normalizeStoredValue(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLocaleLowerCase("pt-BR")
}

function optionValue<T>(value: unknown, options: Map<string, T>) {
  return typeof value === "string" ? options.get(normalizeStoredValue(value)) : undefined
}

function exerciseDifficultyValue(value: unknown) {
  return (
    optionValue(value, difficultyValueByStoredValue) ??
    optionValue(value, legacyDifficultyValueByStoredValue)
  )
}

function muscleList(value: unknown) {
  const items = Array.isArray(value)
    ? value
    : typeof value === "string"
      ? value.split(";")
      : []
  return items.flatMap(item => {
    if (typeof item !== "string") return []
    const muscle = muscleValueByStoredValue.get(normalizeStoredValue(item))
    return muscle ? [muscle] : []
  })
}

export function normalizeExerciseFields(data: Record<string, unknown>): ExerciseInput {
  const muscleGroup =
    optionValue(data.muscleGroup, muscleGroupValueByStoredValue) ??
    optionValue(data.muscleGroup, legacyMuscleGroupValueByStoredValue)
  const difficulty = exerciseDifficultyValue(data.difficulty ?? data.level)
  return {
    name: typeof data.name === "string" ? data.name : "Exercício sem nome",
    muscleGroup: muscleGroup ?? (data.muscleGroup as ExerciseInput["muscleGroup"]),
    primaryMuscles: muscleList(data.primaryMuscles ?? data.primaryMuscle),
    secondaryMuscles: muscleList(data.secondaryMuscles),
    difficulty: difficulty ?? (data.difficulty as ExerciseInput["difficulty"]),
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
