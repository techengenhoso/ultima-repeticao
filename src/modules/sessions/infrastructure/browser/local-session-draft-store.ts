import type { SessionDraftStore } from "../../application/ports/session-draft-store"
import { type PreparedSession, preparedSessionSchema } from "../../domain/session"

const storagePrefix = "ultima-repeticao:workout-session-draft:"
const restTimerStoragePrefix = "ultima-repeticao:workout-session-rest-timer:"

function storageKey(uid: string) {
  return `${storagePrefix}${uid}`
}

function restTimerStorageKey(uid: string, id: string) {
  return `${restTimerStoragePrefix}${uid}:${id}`
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

function readRestTimer(uid: string, id: string): number | null {
  if (typeof window === "undefined") return null
  const key = restTimerStorageKey(uid, id)
  const value = Number(window.localStorage.getItem(key))
  if (Number.isSafeInteger(value) && value > Date.now()) return value
  window.localStorage.removeItem(key)
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
  getRestTimer(uid: string, id: string) {
    try {
      return readRestTimer(uid, id)
    } catch {
      return null
    }
  },
  save(uid: string, draft: PreparedSession) {
    if (typeof window === "undefined") return
    window.localStorage.setItem(
      storageKey(uid),
      JSON.stringify(preparedSessionSchema.parse(draft))
    )
  },
  saveRestTimer(uid: string, id: string, endsAt: number) {
    if (typeof window === "undefined") return
    window.localStorage.setItem(restTimerStorageKey(uid, id), String(endsAt))
  },
  remove(uid: string, id: string) {
    const draft = this.get(uid, id)
    if (draft) window.localStorage.removeItem(storageKey(uid))
  },
  removeRestTimer(uid: string, id: string) {
    if (typeof window === "undefined") return
    window.localStorage.removeItem(restTimerStorageKey(uid, id))
  },
}
