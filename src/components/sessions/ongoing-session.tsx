"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import type { WorkoutSession } from "@/modules/sessions/domain/session"
import { useSessionGateway } from "@/modules/sessions/presentation/session-gateway-context"

function isHiddenPath(pathname: string) {
  return (
    pathname === "/" ||
    ["/history", "/workouts/sessions"].some(prefix => pathname.startsWith(prefix))
  )
}

export function OngoingSession() {
  const gateway = useSessionGateway()
  const pathname = usePathname()
  const [session, setSession] = useState<WorkoutSession | null>(null)
  const [pending, setPending] = useState(true)
  const isHidden = isHiddenPath(pathname)

  const load = useCallback(async () => {
    setPending(true)
    setSession(null)

    try {
      setSession(await gateway.findInProgress())
    } catch {
      toast.error("Não foi possível verificar seu treino em andamento", {
        position: "top-left",
      })
    } finally {
      setPending(false)
    }
  }, [gateway])

  useEffect(() => {
    if (!isHidden) void load()
  }, [isHidden, load])

  if (isHidden || pending || !session) return null

  return (
    <Button asChild className="w-full sm:w-auto">
      <Link href={`/workouts/sessions/${encodeURIComponent(session.id)}`}>
        Retornar ao treino
      </Link>
    </Button>
  )
}
