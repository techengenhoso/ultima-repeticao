"use client"

import { LoaderCircleIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import type { ComponentProps } from "react"
import { useRef, useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { useUser } from "@/contexts/user-context"
import { useSessionDraftStore } from "@/modules/sessions/presentation/session-draft-store-context"
import { useSessionGateway } from "@/modules/sessions/presentation/session-gateway-context"

type StartSessionButtonProps = {
  dayId: string
  planId: string
} & Pick<ComponentProps<typeof Button>, "className" | "size" | "variant">

export function StartSessionButton({
  className,
  dayId,
  planId,
  size,
  variant,
}: StartSessionButtonProps) {
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
        toast.error("Há um treino em andamento neste dispositivo, finalize ele")

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
    <Button
      className={className}
      disabled={pending}
      onClick={() => void start()}
      size={size}
      type="button"
      variant={variant}
    >
      {pending && <LoaderCircleIcon aria-hidden="true" className="animate-spin" />}
      {pending ? "Preparando treino" : "Iniciar treino"}
    </Button>
  )
}
