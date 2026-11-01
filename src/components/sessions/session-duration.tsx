"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"

export function SessionDuration({ startedAt }: { startedAt: number }) {
  const [elapsedSeconds, setElapsedSeconds] = useState<number | null>(null)

  useEffect(() => {
    const updateElapsed = () => {
      setElapsedSeconds(Math.max(0, Math.floor((Date.now() - startedAt) / 1000)))
    }

    updateElapsed()
    const interval = window.setInterval(updateElapsed, 1000)
    window.addEventListener("focus", updateElapsed)
    document.addEventListener("visibilitychange", updateElapsed)

    return () => {
      window.clearInterval(interval)
      window.removeEventListener("focus", updateElapsed)
      document.removeEventListener("visibilitychange", updateElapsed)
    }
  }, [startedAt])

  const minutesAndSeconds =
    elapsedSeconds === null
      ? "--:--"
      : [Math.floor((elapsedSeconds % 3600) / 60), elapsedSeconds % 60]
          .map(value => String(value).padStart(2, "0"))
          .join(":")
  const formattedElapsed =
    elapsedSeconds !== null && elapsedSeconds >= 3600
      ? `${Math.floor(elapsedSeconds / 3600)}:${minutesAndSeconds}`
      : minutesAndSeconds

  return (
    <Badge
      aria-label="Duração do treino"
      aria-live="off"
      className="h-auto px-3 py-2 text-sm tabular-nums"
      role="timer"
      variant="secondary"
    >
      {formattedElapsed}
    </Badge>
  )
}
