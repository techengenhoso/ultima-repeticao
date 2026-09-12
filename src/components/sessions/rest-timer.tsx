"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

export function RestTimer({
  seconds,
  startSignal,
}: {
  seconds?: number
  startSignal: number
}) {
  const [end, setEnd] = useState<number | null>(null)
  const [remaining, setRemaining] = useState(0)
  const [message, setMessage] = useState("")
  const lastStartSignal = useRef(0)

  useEffect(() => {
    if (
      seconds === undefined ||
      startSignal === 0 ||
      startSignal === lastStartSignal.current
    )
      return
    lastStartSignal.current = startSignal
    setRemaining(seconds)
    setEnd(Date.now() + seconds * 1000)
    setMessage("Descanso em andamento")
  }, [seconds, startSignal])

  useEffect(() => {
    if (!end) return
    const tick = () => {
      const value = Math.max(0, Math.ceil((end - Date.now()) / 1000))
      setRemaining(value)
      if (!value) {
        setEnd(null)
        setMessage("Descanso concluído")
      }
    }
    tick()
    const interval = setInterval(tick, 500)
    return () => clearInterval(interval)
  }, [end])

  if (seconds === undefined) return null

  const active = end !== null
  const displayedSeconds = active ? remaining : seconds
  const formattedRemaining = `${Math.floor(displayedSeconds / 60)}:${String(
    displayedSeconds % 60
  ).padStart(2, "0")}`
  const label = active ? "Descanso em andamento" : message || "Descanso"

  return (
    <output
      aria-live="polite"
      className={cn(
        "flex w-fit items-center gap-3 border px-3 py-2 shadow-sm",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-primary/35 bg-primary/5 text-primary"
      )}
    >
      <span className="text-lg font-bold tabular-nums" role="timer">
        {formattedRemaining}
      </span>
      <span>{label}</span>
    </output>
  )
}
