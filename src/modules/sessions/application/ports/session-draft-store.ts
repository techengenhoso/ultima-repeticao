import type { PreparedSession } from "../../domain/session"

export interface SessionDraftStore {
  current(uid: string): PreparedSession | null
  get(uid: string, id: string): PreparedSession | null
  save(uid: string, draft: PreparedSession): void
  remove(uid: string, id: string): void
}
