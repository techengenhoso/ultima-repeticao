import type { SessionExercise, WorkoutSession } from "../../domain/session"

export interface SessionRepository {
  find(uid: string, id: string): Promise<WorkoutSession | null>
  findInProgress(uid: string): Promise<WorkoutSession | null>
  list(
    uid: string,
    cursor?: string
  ): Promise<{ sessions: WorkoutSession[]; nextCursor: string | null }>
  findLatestCompletedForExercise(
    uid: string,
    exercise: SessionExercise
  ): Promise<WorkoutSession | null>
  createIfAbsent(uid: string, session: WorkoutSession): Promise<WorkoutSession>
  updateIfVersion(
    uid: string,
    session: WorkoutSession,
    expectedVersion: number
  ): Promise<void>
  delete(uid: string, id: string): Promise<void>
  listFinalized(uid: string): Promise<WorkoutSession[]>
}
