"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import { useSessionDraftStore } from "./session-draft-store-context"

export function useSessionRestTimer(uid: string, id: string) {
  const draftStore = useSessionDraftStore()
  const [endsAt, setEndsAt] = useState<number | null>(null)
  const [seconds, setSeconds] = useState(90)
  const [open, setOpen] = useState(false)
  const endsAtRef = useRef<number | null>(null)

  useEffect(() => {
    const savedEndsAt = draftStore.getRestTimer(uid, id)
    endsAtRef.current = savedEndsAt
    setEndsAt(savedEndsAt)
    setOpen(false)
  }, [draftStore, id, uid])

  const persistEndsAt = useCallback(
    (value: number) => {
      endsAtRef.current = value
      setEndsAt(value)
      try {
        draftStore.saveRestTimer(uid, id, value)
      } catch {
        toast.error("O descanso continua, mas não foi possível salvá-lo neste dispositivo")
      }
    },
    [draftStore, id, uid]
  )

  const clear = useCallback(() => {
    endsAtRef.current = null
    setEndsAt(null)
    setOpen(false)
    try {
      draftStore.removeRestTimer(uid, id)
    } catch {
      toast.error("Não foi possível remover o descanso salvo neste dispositivo")
    }
  }, [draftStore, id, uid])

  function prepare(duration?: number) {
    setSeconds(duration ?? 90)
  }

  function start(duration?: number) {
    const restSeconds = duration ?? seconds
    setSeconds(restSeconds)
    persistEndsAt(Date.now() + restSeconds * 1000)
    setOpen(true)
  }

  function adjust(delta: -15 | 15) {
    const currentEndsAt = endsAtRef.current
    if (currentEndsAt === null || currentEndsAt <= Date.now()) return
    persistEndsAt(Math.max(Date.now(), currentEndsAt + delta * 1000))
  }

  return { endsAt, open, setOpen, prepare, start, adjust, clear }
}
