import type { WorkoutSession } from "../../domain/session"

export class SessionDraftVerificationError extends Error {}

export interface SessionDraftSigner {
  sign(uid: string, session: WorkoutSession): string
  verify(uid: string, token: string): WorkoutSession
}
