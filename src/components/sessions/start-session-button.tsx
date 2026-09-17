"use client"

import { useRouter } from "next/navigation"
import { useRef, useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { useUser } from "@/contexts/user-context"
import { useSessionDraftStore } from "@/modules/sessions/presentation/session-draft-store-context"
import { useSessionGateway } from "@/modules/sessions/presentation/session-gateway-context"

export function StartSessionButton({ planId, dayId }: { planId: string; dayId: string }) {
  const gateway = useSessionGateway()
  const draftStore = useSessionDraftStore()
  const { user } = useUser()
  const router = useRouter()
  const id = useRef<string | null>(null)
  const active = useRef(false)
  const [pending, setPending] = useState(false)

  async function start() {
    if (active.current) return
    active.current = true
    setPending(true)
    id.current ??= crypto.randomUUID()
    try {
      if (draftStore.current(user.uid)) {
        toast.error(
          "Há um treino em andamento neste dispositivo, retome ou finalize antes"
        )
        active.current = false
        setPending(false)
        return
      }
      const draft = await gateway.prepare({
        action: "start",
        id: id.current,
        workoutPlanId: planId,
        workoutDayId: dayId,
      })
      draftStore.save(user.uid, draft)
      router.push(`/workouts/sessions/${encodeURIComponent(draft.session.id)}`)
    } catch (failure) {
      toast.error(failure instanceof Error ? failure.message : "Não foi possível iniciar")
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
        {pending ? "Preparando treino" : "Iniciar este treino"}
      </Button>
    </div>
  )
}
