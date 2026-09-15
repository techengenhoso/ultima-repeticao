import type { SessionDraftStore } from "../../application/ports/session-draft-store"
import { type PreparedSession, preparedSessionSchema } from "../../domain/session"

const storagePrefix = "ultima-repeticao:workout-session-draft:"

function storageKey(uid: string) {
  return `${storagePrefix}${uid}`
}

function read(uid: string): PreparedSession | null {
  if (typeof window === "undefined") return null
  const value = window.localStorage.getItem(storageKey(uid))
  if (!value) return null
  const parsed = preparedSessionSchema.safeParse(JSON.parse(value))
  if (parsed.success) return parsed.data
  window.localStorage.removeItem(storageKey(uid))
  return null
}

export const localSessionDraftStore: SessionDraftStore = {
  current(uid: string) {
    try {
      return read(uid)
    } catch {
      return null
    }
  },
  get(uid: string, id: string) {
    const draft = this.current(uid)
    return draft?.session.id === id ? draft : null
  },
  save(uid: string, draft: PreparedSession) {
    if (typeof window === "undefined") return
    window.localStorage.setItem(
      storageKey(uid),
      JSON.stringify(preparedSessionSchema.parse(draft))
    )
  },
  remove(uid: string, id: string) {
    const draft = this.get(uid, id)
    if (draft) window.localStorage.removeItem(storageKey(uid))
  },
}
