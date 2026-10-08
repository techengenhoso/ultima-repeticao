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
import { db } from "@/infrastructure/firebase/client"
import { DuplicateExerciseNameError } from "@/modules/exercises/application/ports/exercise-repository"
import {
  type CustomExercise,
  customExerciseDocumentSchema,
  type ExerciseInput,
  exerciseInputSchema,
} from "@/modules/exercises/domain/exercise"
import { normalizeExerciseName } from "@/modules/exercises/domain/normalization"

function exercisesCollection(uid: string) {
  return collection(db, "users", uid, "exercises")
}

function exerciseOverridesCollection(uid: string) {
  return collection(db, "users", uid, "exerciseOverrides")
}

function parseExercise(id: string, data: unknown): CustomExercise {
  const parsed = customExerciseDocumentSchema.parse(data)
  return {
    ...parsed,
    id,
    source: "custom",
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

function cleanInput(input: ExerciseInput): ExerciseInput {
  const cleanList = (items: string[]) => [
    ...new Set(items.map(item => item.trim()).filter(Boolean)),
  ]
  return exerciseInputSchema.parse({
    name: input.name.trim().replace(/\s+/g, " "),
    muscleGroup: input.muscleGroup,
    primaryMuscles: cleanList(input.primaryMuscles),
    secondaryMuscles: cleanList(input.secondaryMuscles),
    difficulty: input.difficulty,
    movementPattern: input.movementPattern.trim(),
    startingPosition: input.startingPosition.trim(),
    movementExecution: input.movementExecution.trim(),
    importantCautions: input.importantCautions.trim(),
  })
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
    ...exerciseInputSchema.parse(item.data()),
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
    ...exerciseInputSchema.parse(saved.data()),
    id: saved.id,
    source: "default" as const,
    isCustomized: true as const,
  }
}

export async function deleteCustomExerciseRepository(uid: string, exerciseId: string) {
  await deleteDoc(doc(exercisesCollection(uid), exerciseId))
}

export async function deleteDefaultExerciseOverrideRepository(
  uid: string,
  exerciseId: string
) {
  await deleteDoc(doc(exerciseOverridesCollection(uid), exerciseId))
}
