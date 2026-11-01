"use client"

import { type RefObject, useCallback, useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import { RestTimerDrawer } from "./rest-timer-drawer"

const restCompletedNotification = {
  title: "Descanso concluído",
  body: "Hora de iniciar a próxima série",
}

function supportsNotifications() {
  return typeof window !== "undefined" && "Notification" in window
}

export function RestTimer({
  completionFocusRef,
  endsAt,
  onAdjust,
  onCompleted,
  onOpenChange,
  open,
}: {
  completionFocusRef?: RefObject<HTMLElement | null>
  endsAt: number | null
  onAdjust: (seconds: -15 | 15) => void
  onCompleted: () => void
  onOpenChange: (open: boolean) => void
  open: boolean
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

    if (supportsNotifications() && Notification.permission === "granted") {
      try {
        new Notification(restCompletedNotification.title, {
          body: restCompletedNotification.body,
        })
      } catch {
        toast.error("Não foi possível exibir o alerta do sistema")
      }
    }
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
    window.addEventListener("focus", tick)
    document.addEventListener("visibilitychange", tick)
    return () => {
      clearInterval(interval)
      window.removeEventListener("focus", tick)
      document.removeEventListener("visibilitychange", tick)
    }
  }, [endsAt, notifyCompletion, onCompleted])

  if (!endsAt || remaining === 0) return null

  const formattedRemaining = `${String(Math.floor(remaining / 60)).padStart(2, "0")}:${String(
    remaining % 60
  ).padStart(2, "0")}`

  return (
    <RestTimerDrawer
      completionFocusRef={completionFocusRef}
      formattedRemaining={formattedRemaining}
      notificationPermission={notificationPermission}
      onAdjust={onAdjust}
      onOpenChange={onOpenChange}
      onRequestNotificationPermission={() => void requestNotificationPermission()}
      open={open}
    />
  )
}
