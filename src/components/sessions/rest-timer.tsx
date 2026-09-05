"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

export function RestTimer({ seconds }: { seconds?: number }) {
  const [end, setEnd] = useState<number | null>(null)
  const [remaining, setRemaining] = useState(0)
  const [message, setMessage] = useState("Temporizador disponível")
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
  if (seconds === undefined)
    return <p className="text-sm text-muted-foreground">Descanso não definido na ficha</p>
  return (
    <div className="flex flex-wrap items-center gap-3">
      <p className="text-sm">Descanso recomendado: {seconds} s</p>
      <Button
        onClick={() => {
          setMessage("Descanso em andamento")
          setRemaining(seconds)
          setEnd(Date.now() + seconds * 1000)
        }}
        size="sm"
        type="button"
        variant="outline"
      >
        Iniciar descanso
      </Button>
      {end && (
        <Button
          onClick={() => {
            setEnd(null)
            setMessage("Descanso interrompido")
          }}
          size="sm"
          type="button"
          variant="ghost"
        >
          Parar
        </Button>
      )}
      <span className="text-sm tabular-nums" role="timer">
        {end ? `${remaining} s` : ""}
      </span>
      <span aria-live="polite" className="text-xs text-muted-foreground">
        {message}
      </span>
    </div>
  )
}
