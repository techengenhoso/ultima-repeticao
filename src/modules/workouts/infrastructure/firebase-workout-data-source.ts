import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  runTransaction,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore"
import { auth, db } from "@/infrastructure/firebase/client"
import { workoutFormSchema } from "@/modules/workouts/domain/schemas"
import type { Workout, WorkoutInput } from "@/modules/workouts/domain/workout"
import { workoutDocumentSchema } from "./workout-document-schema"

function workoutsCollection(uid: string) {
  return collection(db, "users", uid, "workoutPlans")
}

function parseWorkout(id: string, data: unknown): Workout | null {
  const parsed = workoutDocumentSchema.safeParse(data)
  return parsed.success
    ? {
        id,
        ...parsed.data,
        createdAt: parsed.data.createdAt.toMillis(),
        updatedAt: parsed.data.updatedAt.toMillis(),
      }
    : null
}

async function readWorkout(uid: string, id: string) {
  const snapshot = await getDoc(doc(workoutsCollection(uid), id))
  const workout = snapshot.exists() ? parseWorkout(snapshot.id, snapshot.data()) : null
  if (!workout) throw new Error("Ficha inválida ou não encontrada")
  return workout
}

function cleanInput(raw: WorkoutInput) {
  const input = workoutFormSchema.parse({ ...raw, description: raw.description ?? "" })
  return {
    ...input,
    name: input.name.trim().replace(/\s+/g, " "),
    description: input.description?.trim().replace(/\s+/g, " ") || null,
    days: input.days.map((day, order) => ({
      ...day,
      name: day.name.trim().replace(/\s+/g, " "),
      order,
      exercises: day.exercises.map((exercise, exerciseOrder) => ({
        ...Object.fromEntries(
          Object.entries(exercise).filter(([, value]) => value !== undefined)
        ),
        order: exerciseOrder,
      })),
    })),
  }
}

export async function listWorkoutsRepository(uid: string) {
  const snapshot = await getDocs(workoutsCollection(uid))
  return snapshot.docs
    .flatMap(item => {
      const workout = parseWorkout(item.id, item.data())
      return workout ? [workout] : []
    })
    .sort(
      (left, right) =>
        Number(right.isActive) - Number(left.isActive) || right.updatedAt - left.updatedAt
    )
}

export async function createWorkoutRepository(
  uid: string,
  input: WorkoutInput,
  creationId?: string
) {
  if (!auth.currentUser || auth.currentUser.uid !== uid)
    throw new Error("Entre novamente para salvar")
  const reference = creationId
    ? doc(workoutsCollection(uid), creationId)
    : doc(workoutsCollection(uid))
  const data = cleanInput(input)
  // O mesmo identificador permite repetir uma tentativa sem criar outra ficha
  // se a escrita tiver sido concluída e apenas a leitura da resposta falhar.
  await runTransaction(db, async transaction => {
    const existing = await transaction.get(reference)
    if (existing.exists()) {
      const previous = parseWorkout(existing.id, existing.data())
      if (!previous) throw new Error("Ficha inválida")
      if (JSON.stringify(cleanInput(previous)) !== JSON.stringify(data))
        transaction.update(reference, { ...data, updatedAt: serverTimestamp() })
      return
    }
    transaction.set(reference, {
      ...data,
      isActive: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
  })
  return readWorkout(uid, reference.id)
}

export async function updateWorkoutRepository(
  uid: string,
  id: string,
  input: WorkoutInput
) {
  const reference = doc(workoutsCollection(uid), id)
  const existing = await readWorkout(uid, id)
  const batch = writeBatch(db)
  batch.update(reference, {
    ...cleanInput(input),
    isActive: existing.isActive,
    updatedAt: serverTimestamp(),
  })
  await batch.commit()
  return readWorkout(uid, id)
}

export async function deleteWorkoutRepository(uid: string, id: string) {
  await deleteDoc(doc(workoutsCollection(uid), id))
}

export async function activateWorkoutRepository(uid: string, id: string) {
  const snapshot = await getDocs(workoutsCollection(uid))
  const target = snapshot.docs.find(item => item.id === id)
  if (!target) throw new Error("Ficha não encontrada")
  const batch = writeBatch(db)
  snapshot.docs.forEach(item => {
    if (item.id === id || item.data().isActive === true) {
      batch.update(item.ref, {
        isActive: item.id === id,
        updatedAt: item.id === id ? serverTimestamp() : item.data().updatedAt,
      })
    }
  })
  await batch.commit()
}

export async function deactivateWorkoutRepository(uid: string, id: string) {
  const reference = doc(workoutsCollection(uid), id)
  const batch = writeBatch(db)
  batch.update(reference, {
    isActive: false,
    updatedAt: serverTimestamp(),
  })
  await batch.commit()
}
