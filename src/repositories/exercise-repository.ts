import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  setDoc,
  where,
} from "firebase/firestore"
import { normalizeExerciseName } from "@/lib/exercises/normalize"
import type { CustomExercise, ExerciseInput, Muscle } from "@/lib/exercises/types"
import { db } from "@/lib/firebase"
import { muscles } from "@/lib/options-select"

export class DuplicateExerciseNameError extends Error {}

function exercisesCollection(uid: string) {
  return collection(db, "users", uid, "exercises")
}

function exerciseOverridesCollection(uid: string) {
  return collection(db, "users", uid, "exerciseOverrides")
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

function exerciseFields(data: Record<string, unknown>): ExerciseInput {
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

function parseExercise(id: string, data: Record<string, unknown>): CustomExercise {
  return {
    ...exerciseFields(data),
    id,
    source: "custom",
    normalizedName:
      typeof data.normalizedName === "string"
        ? data.normalizedName
        : normalizeExerciseName(String(data.name ?? "")),
  }
}

async function hasDuplicateExerciseName(
  uid: string,
  name: string,
  ignoredExerciseId?: string
) {
  const normalizedName = normalizeExerciseName(name)
  const snapshot = await getDocs(
    query(
      exercisesCollection(uid),
      where("normalizedName", "==", normalizedName),
      limit(2)
    )
  )
  return snapshot.docs.some(item => item.id !== ignoredExerciseId)
}

function cleanInput(input: ExerciseInput) {
  const cleanList = (items: string[]) => [
    ...new Set(items.map(item => item.trim()).filter(Boolean)),
  ]
  return {
    name: input.name.trim().replace(/\s+/g, " "),
    muscleGroup: input.muscleGroup,
    primaryMuscles: cleanList(input.primaryMuscles),
    secondaryMuscles: cleanList(input.secondaryMuscles),
    difficulty: input.difficulty,
    movementPattern: input.movementPattern.trim(),
    startingPosition: input.startingPosition.trim(),
    movementExecution: input.movementExecution.trim(),
    importantCautions: input.importantCautions.trim(),
  }
}

export async function listCustomExercisesRepository(uid: string) {
  const snapshot = await getDocs(exercisesCollection(uid))
  return snapshot.docs
    .map(item => parseExercise(item.id, item.data()))
    .sort((left, right) => left.name.localeCompare(right.name, "pt-BR"))
}

export async function listDefaultExerciseOverridesRepository(uid: string) {
  const snapshot = await getDocs(exerciseOverridesCollection(uid))
  return snapshot.docs.map(item => ({
    ...exerciseFields(item.data()),
    id: item.id,
    source: "default" as const,
    isCustomized: true as const,
  }))
}

export async function createCustomExerciseRepository(uid: string, input: ExerciseInput) {
  const clean = cleanInput(input)
  if (await hasDuplicateExerciseName(uid, clean.name)) {
    throw new DuplicateExerciseNameError()
  }
  const reference = await addDoc(exercisesCollection(uid), {
    ...clean,
    normalizedName: normalizeExerciseName(clean.name),
  })
  const snapshot = await getDoc(reference)
  return parseExercise(snapshot.id, snapshot.data() ?? {})
}

export async function updateCustomExerciseRepository(
  uid: string,
  exerciseId: string,
  input: ExerciseInput
) {
  const clean = cleanInput(input)
  if (await hasDuplicateExerciseName(uid, clean.name, exerciseId)) {
    throw new DuplicateExerciseNameError()
  }
  const reference = doc(exercisesCollection(uid), exerciseId)
  await setDoc(reference, {
    ...clean,
    normalizedName: normalizeExerciseName(clean.name),
  })
  const snapshot = await getDoc(reference)
  return parseExercise(snapshot.id, snapshot.data() ?? {})
}

export async function saveDefaultExerciseOverrideRepository(
  uid: string,
  exerciseId: string,
  input: ExerciseInput
) {
  const clean = cleanInput(input)
  const reference = doc(exerciseOverridesCollection(uid), exerciseId)
  await setDoc(reference, clean)
  const saved = await getDoc(reference)
  return {
    ...exerciseFields(saved.data() ?? {}),
    id: saved.id,
    source: "default" as const,
    isCustomized: true as const,
  }
}

export async function deleteCustomExerciseRepository(uid: string, exerciseId: string) {
  await deleteDoc(doc(exercisesCollection(uid), exerciseId))
}
