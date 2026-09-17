"use client"

import { TimerIcon } from "lucide-react"
import { useEffect, useState } from "react"

export function RestTimer({
  endsAt,
  onCompleted,
}: {
  endsAt: number | null
  onCompleted: () => void
}) {
  const [remaining, setRemaining] = useState(0)

  useEffect(() => {
    if (!endsAt) {
      setRemaining(0)
      return
    }
    const tick = () => {
      const value = Math.max(0, Math.ceil((endsAt - Date.now()) / 1000))
      setRemaining(value)
      if (!value) onCompleted()
    }
    tick()
    const interval = setInterval(tick, 500)
    return () => clearInterval(interval)
  }, [endsAt, onCompleted])

  if (!endsAt || remaining === 0) return null

  const formattedRemaining = `${Math.floor(remaining / 60)}:${String(
    remaining % 60
  ).padStart(2, "0")}`

  return (
    <output
      aria-live="polite"
      className="flex w-fit items-center gap-2 border border-primary/40 bg-primary/10 px-3 py-2 text-primary"
    >
      <TimerIcon aria-hidden="true" className="size-4" />
      <span className="text-xs font-semibold tracking-[0.12em] uppercase">Descanso</span>
      <span className="font-semibold tabular-nums" role="timer">
        {formattedRemaining}
      </span>
    </output>
  )
}
