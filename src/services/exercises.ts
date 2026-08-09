import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore"
import { normalizeExerciseName } from "@/lib/exercises/normalize"
import type {
  CustomExercise,
  ExerciseInput,
  SystemExerciseOverride,
} from "@/lib/exercises/types"
import { db } from "@/lib/firebase"

export class DuplicateExerciseNameError extends Error {}

function exercisesCollection(uid: string) {
  return collection(db, "users", uid, "exercises")
}

function exerciseOverridesCollection(uid: string) {
  return collection(db, "users", uid, "exerciseOverrides")
}

function stringList(value: unknown) {
  if (Array.isArray(value)) return value.filter(item => typeof item === "string")
  if (typeof value === "string") {
    return value
      .split(";")
      .map(item => item.trim())
      .filter(Boolean)
  }
  return []
}

function exerciseFields(data: Record<string, unknown>): ExerciseInput {
  return {
    name: typeof data.name === "string" ? data.name : "Exercício sem nome",
    muscleGroup: data.muscleGroup as ExerciseInput["muscleGroup"],
    primaryMuscles: stringList(data.primaryMuscles ?? data.primaryMuscle),
    secondaryMuscles: stringList(data.secondaryMuscles),
    level: data.level as ExerciseInput["level"],
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
    createdAt: data.createdAt as CustomExercise["createdAt"],
    updatedAt: data.updatedAt as CustomExercise["updatedAt"],
  }
}

export async function listCustomExercises(uid: string) {
  const snapshot = await getDocs(exercisesCollection(uid))
  return snapshot.docs
    .map(item => parseExercise(item.id, item.data()))
    .sort((left, right) => left.name.localeCompare(right.name, "pt-BR"))
}

export async function listSystemExerciseOverrides(uid: string) {
  const snapshot = await getDocs(exerciseOverridesCollection(uid))
  return snapshot.docs.map(item => ({
    ...exerciseFields(item.data()),
    id: item.id,
    source: "system" as const,
    isCustomized: true as const,
    createdAt: item.data().createdAt as SystemExerciseOverride["createdAt"],
    updatedAt: item.data().updatedAt as SystemExerciseOverride["updatedAt"],
  }))
}

export async function hasDuplicateExerciseName(
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
    level: input.level,
    movementPattern: input.movementPattern.trim(),
    startingPosition: input.startingPosition.trim(),
    movementExecution: input.movementExecution.trim(),
    importantCautions: input.importantCautions.trim(),
  }
}

export async function createCustomExercise(uid: string, input: ExerciseInput) {
  const clean = cleanInput(input)
  if (await hasDuplicateExerciseName(uid, clean.name)) {
    throw new DuplicateExerciseNameError()
  }
  const reference = await addDoc(exercisesCollection(uid), {
    ...clean,
    normalizedName: normalizeExerciseName(clean.name),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  const snapshot = await getDoc(reference)
  return parseExercise(snapshot.id, snapshot.data() ?? {})
}

export async function updateCustomExercise(
  uid: string,
  exerciseId: string,
  input: ExerciseInput
) {
  const clean = cleanInput(input)
  if (await hasDuplicateExerciseName(uid, clean.name, exerciseId)) {
    throw new DuplicateExerciseNameError()
  }
  const reference = doc(exercisesCollection(uid), exerciseId)
  const current = await getDoc(reference)
  await setDoc(reference, {
    ...clean,
    normalizedName: normalizeExerciseName(clean.name),
    createdAt: current.data()?.createdAt ?? serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  const snapshot = await getDoc(reference)
  return parseExercise(snapshot.id, snapshot.data() ?? {})
}

export async function saveSystemExerciseOverride(
  uid: string,
  exerciseId: string,
  input: ExerciseInput
) {
  const clean = cleanInput(input)
  const reference = doc(exerciseOverridesCollection(uid), exerciseId)
  const snapshot = await getDoc(reference)
  await setDoc(reference, {
    ...clean,
    createdAt: snapshot.data()?.createdAt ?? serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  const saved = await getDoc(reference)
  return {
    ...exerciseFields(saved.data() ?? {}),
    id: saved.id,
    source: "system" as const,
    isCustomized: true as const,
    createdAt: saved.data()?.createdAt as SystemExerciseOverride["createdAt"],
    updatedAt: saved.data()?.updatedAt as SystemExerciseOverride["updatedAt"],
  }
}

export async function deleteCustomExercise(uid: string, exerciseId: string) {
  await deleteDoc(doc(exercisesCollection(uid), exerciseId))
}
