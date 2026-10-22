"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

const restCompletedNotification = {
  title: "Descanso concluído",
  body: "Hora de iniciar a próxima série",
}

function supportsNotifications() {
  return typeof window !== "undefined" && "Notification" in window
}

export function RestTimer({
  endsAt,
  onCompleted,
}: {
  endsAt: number | null
  onCompleted: () => void
}) {
  const [remaining, setRemaining] = useState(0)
  const [notificationPermission, setNotificationPermission] = useState<
    NotificationPermission | "unsupported"
  >("unsupported")
  const completedEndsAt = useRef<number | null>(null)

  useEffect(() => {
    if (!supportsNotifications()) return
    setNotificationPermission(Notification.permission)
  }, [])

  const notifyCompletion = useCallback(() => {
    toast.success(restCompletedNotification.title, {
      description: restCompletedNotification.body,
    })

    if (supportsNotifications() && Notification.permission === "granted")
      new Notification(restCompletedNotification.title, {
        body: restCompletedNotification.body,
      })
  }, [])

  const requestNotificationPermission = useCallback(async () => {
    if (!supportsNotifications()) return
    try {
      const permission = await Notification.requestPermission()
      setNotificationPermission(permission)
      if (permission === "granted")
        toast.success("Alertas ativados", {
          description: "Você receberá um aviso ao fim do descanso",
        })
    } catch {
      toast.error("Não foi possível ativar os alertas")
    }
  }, [])

  useEffect(() => {
    if (!endsAt) {
      setRemaining(0)
      completedEndsAt.current = null
      return
    }
    const tick = () => {
      const value = Math.max(0, Math.ceil((endsAt - Date.now()) / 1000))
      setRemaining(value)
      if (value || completedEndsAt.current === endsAt) return
      completedEndsAt.current = endsAt
      notifyCompletion()
      onCompleted()
    }
    tick()
    const interval = setInterval(tick, 500)
    return () => clearInterval(interval)
  }, [endsAt, notifyCompletion, onCompleted])

  if (!endsAt || remaining === 0) return null

  const formattedRemaining = `${Math.floor(remaining / 60)}:${String(
    remaining % 60
  ).padStart(2, "0")}`

  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <output
        aria-live="polite"
        className="flex w-fit items-center gap-2 rounded-3xl border border-primary/40 bg-primary/10 px-3 py-2 text-primary"
      >
        <span className="text-xs font-semibold tracking-[0.12em] uppercase">Descanso</span>

        <span className="font-semibold tabular-nums" role="timer">
          {formattedRemaining}
        </span>
      </output>

      {notificationPermission === "default" && (
        <Button
          onClick={() => void requestNotificationPermission()}
          size="lg"
          type="button"
        >
          Ativar alertas
        </Button>
      )}
    </div>
  )
}
