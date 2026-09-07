import { Timestamp } from "firebase-admin/firestore"
import {
  referenceKey,
  type SessionExercise,
  sessionSchema,
  type WorkoutSession,
} from "../../domain/session"

const millis = (value: unknown) => (value instanceof Timestamp ? value.toMillis() : value)

export function decodeFirebaseSession(
  id: string,
  raw: FirebaseFirestore.DocumentData
): WorkoutSession {
  const { exerciseKeys: _keys, ...data } = raw
  return sessionSchema.parse({
    ...data,
    id,
    startedAt: millis(data.startedAt),
    completedAt: millis(data.completedAt),
    exercises: data.exercises?.map((exercise: SessionExercise) => ({
      ...exercise,
      ...(exercise.decision
        ? {
            decision: {
              ...exercise.decision,
              decidedAt: millis(exercise.decision.decidedAt),
            },
          }
        : {}),
    })),
  })
}

export function encodeFirebaseSession(session: WorkoutSession) {
  const { id: _id, ...data } = sessionSchema.parse(session)
  const serialized = JSON.parse(JSON.stringify(data)) as Omit<WorkoutSession, "id">
  return {
    ...serialized,
    startedAt: Timestamp.fromMillis(session.startedAt),
    ...(session.completedAt
      ? { completedAt: Timestamp.fromMillis(session.completedAt) }
      : {}),
    exerciseKeys: [
      ...new Set(session.exercises.map(item => referenceKey(item.exerciseReference))),
    ],
    exercises: serialized.exercises.map(item => ({
      ...item,
      ...(item.decision
        ? {
            decision: {
              ...item.decision,
              decidedAt: Timestamp.fromMillis(item.decision.decidedAt),
            },
          }
        : {}),
    })),
  }
}
