"use client"

import { useRouter } from "next/navigation"
import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { useSessionGateway } from "@/modules/sessions/presentation/session-gateway-context"

export function StartSessionButton({ planId, dayId }: { planId: string; dayId: string }) {
  const gateway = useSessionGateway()
  const router = useRouter()
  const id = useRef<string | null>(null)
  const active = useRef(false)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState("")
  async function start() {
    if (active.current) return
    active.current = true
    setPending(true)
    setError("")
    id.current ??= crypto.randomUUID()
    try {
      const session = await gateway.mutate({
        action: "start",
        id: id.current,
        workoutPlanId: planId,
        workoutDayId: dayId,
      })
      router.push(`/sessions/${encodeURIComponent(session.id)}`)
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "Não foi possível iniciar")
      active.current = false
      setPending(false)
    }
  }
  return (
    <div className="space-y-2">
      <Button
        className="w-full sm:w-auto"
        disabled={pending}
        onClick={() => void start()}
        type="button"
      >
        {pending ? "Preparando sessão" : "Iniciar este treino"}
      </Button>
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
