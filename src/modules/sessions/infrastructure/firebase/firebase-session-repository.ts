import "server-only"
import { getAdminFirestore } from "@/modules/shared/infrastructure/firebase-admin"
import type { SessionRepository } from "../../application/ports/session-repository"
import { SessionConcurrencyError } from "../../application/session-use-cases"
import {
  referenceKey,
  type SessionExercise,
  type WorkoutSession,
} from "../../domain/session"
import {
  decodeFirebaseSession,
  encodeFirebaseSession,
} from "../mappers/firebase-session-mapper"

const sessions = (uid: string) =>
  getAdminFirestore().collection("users").doc(uid).collection("workoutSessions")

export class FirebaseSessionRepository implements SessionRepository {
  async find(uid: string, id: string) {
    const snapshot = await sessions(uid).doc(id).get()
    return snapshot.exists
      ? decodeFirebaseSession(snapshot.id, snapshot.data() ?? {})
      : null
  }

  async findInProgress(uid: string) {
    const snapshot = await sessions(uid)
      .where("status", "==", "inProgress")
      .orderBy("startedAt", "desc")
      .limit(1)
      .get()
    const current = snapshot.docs[0]
    return current ? decodeFirebaseSession(current.id, current.data()) : null
  }

  async list(uid: string, cursor?: string) {
    let query = sessions(uid).orderBy("startedAt", "desc").limit(20)
    if (cursor) {
      const page = await sessions(uid).doc(cursor).get()
      if (!page.exists) throw new Error("Página de histórico inválida")
      query = query.startAfter(page)
    }
    const snapshot = await query.get()
    return {
      sessions: snapshot.docs.map(item => decodeFirebaseSession(item.id, item.data())),
      nextCursor: snapshot.size === 20 ? (snapshot.docs.at(-1)?.id ?? null) : null,
    }
  }

  async listCompletedForExercise(uid: string, exercise: SessionExercise) {
    const snapshot = await sessions(uid)
      .where("exerciseKeys", "array-contains", referenceKey(exercise.exerciseReference))
      .where("status", "==", "completed")
      .orderBy("startedAt", "desc")
      .limit(20)
      .get()
    return snapshot.docs.map(item => decodeFirebaseSession(item.id, item.data()))
  }

  async createIfAbsent(uid: string, session: WorkoutSession) {
    const reference = sessions(uid).doc(session.id)
    return getAdminFirestore().runTransaction(async transaction => {
      const current = await transaction.get(reference)
      if (current.exists) return decodeFirebaseSession(current.id, current.data() ?? {})
      transaction.create(reference, encodeFirebaseSession(session))
      return session
    })
  }

  async updateIfVersion(uid: string, session: WorkoutSession, expectedVersion: number) {
    const reference = sessions(uid).doc(session.id)
    await getAdminFirestore().runTransaction(async transaction => {
      const current = await transaction.get(reference)
      if (!current.exists) throw new SessionConcurrencyError()
      const stored = decodeFirebaseSession(current.id, current.data() ?? {})
      if (stored.version !== expectedVersion) throw new SessionConcurrencyError()
      transaction.set(reference, encodeFirebaseSession(session))
    })
  }

  async listCompleted(uid: string) {
    const snapshot = await sessions(uid)
      .where("status", "==", "completed")
      .orderBy("startedAt", "desc")
      .limit(100)
      .get()
    return snapshot.docs.map(item => decodeFirebaseSession(item.id, item.data()))
  }
}
