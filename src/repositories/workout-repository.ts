import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore"
import { db } from "@/lib/firebase"
import { workoutDocumentSchema } from "@/lib/workouts/schemas"
import type { Workout, WorkoutInput } from "@/lib/workouts/types"

function workoutsCollection(uid: string) {
  return collection(db, "users", uid, "workoutPlans")
}

function parseWorkout(id: string, data: unknown): Workout | null {
  const parsed = workoutDocumentSchema.safeParse(data)
  return parsed.success ? { id, ...parsed.data } : null
}

async function readWorkout(uid: string, id: string) {
  const snapshot = await getDoc(doc(workoutsCollection(uid), id))
  const workout = snapshot.exists() ? parseWorkout(snapshot.id, snapshot.data()) : null
  if (!workout) throw new Error("Ficha inválida ou não encontrada")
  return workout
}

function cleanInput(input: WorkoutInput) {
  return {
    ...input,
    name: input.name.trim().replace(/\s+/g, " "),
    description: input.description?.trim().replace(/\s+/g, " ") || null,
    days: input.days.map((day, order) => ({
      ...day,
      name: day.name.trim().replace(/\s+/g, " "),
      order,
      exercises: day.exercises.map((exercise, exerciseOrder) => ({
        ...exercise,
        order: exerciseOrder,
        repetitions: exercise.repetitions.trim().replace(/\s+/g, " "),
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
        Number(right.isActive) - Number(left.isActive) ||
        right.updatedAt.toMillis() - left.updatedAt.toMillis()
    )
}

export async function createWorkoutRepository(uid: string, input: WorkoutInput) {
  const reference = await addDoc(workoutsCollection(uid), {
    ...cleanInput(input),
    isActive: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
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
  batch.set(reference, {
    ...cleanInput(input),
    isActive: existing.isActive,
    createdAt: existing.createdAt,
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
