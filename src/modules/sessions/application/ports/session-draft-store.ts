import type { PreparedSession } from "../../domain/session"

export interface SessionDraftStore {
  current(uid: string): PreparedSession | null
  get(uid: string, id: string): PreparedSession | null
  getRestTimer(uid: string, id: string): number | null
  save(uid: string, draft: PreparedSession): void
  saveRestTimer(uid: string, id: string, endsAt: number): void
  remove(uid: string, id: string): void
  removeRestTimer(uid: string, id: string): void
}
