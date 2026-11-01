"use client"

import { Drawer } from "@base-ui/react/drawer"
import { ChevronDownIcon } from "lucide-react"
import { type RefObject, useRef } from "react"
import { Button } from "@/components/ui/button"

export function RestTimerDrawer({
  completionFocusRef,
  formattedRemaining,
  notificationPermission,
  onAdjust,
  onOpenChange,
  onRequestNotificationPermission,
  open,
}: {
  completionFocusRef?: RefObject<HTMLElement | null>
  formattedRemaining: string
  notificationPermission: NotificationPermission | "unsupported"
  onAdjust: (seconds: -15 | 15) => void
  onOpenChange: (open: boolean) => void
  onRequestNotificationPermission: () => void
  open: boolean
}) {
  const triggerRef = useRef<HTMLButtonElement>(null)
  const minimizeRef = useRef<HTMLButtonElement>(null)

  return (
    <Drawer.Root onOpenChange={onOpenChange} open={open} swipeDirection="down">
      <Drawer.Trigger
        aria-label={`Abrir descanso, ${formattedRemaining} restantes`}
        ref={triggerRef}
        render={
          <Button className="h-auto gap-2 px-3 py-2 text-sm tabular-nums" type="button" />
        }
      >
        <span aria-live="off" role="timer">
          {formattedRemaining}
        </span>
      </Drawer.Trigger>

      <Drawer.Portal>
        <div className="fixed inset-0 z-50">
          <Drawer.Backdrop className="absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0 motion-reduce:transition-none" />

          <Drawer.Viewport className="absolute inset-0 flex items-end px-2">
            <Drawer.Popup
              className="max-h-[calc(100dvh-1rem)] w-full overflow-y-auto rounded-t-4xl border border-border bg-popover text-popover-foreground shadow-xl outline-none transition-transform duration-200 transform-[translateY(var(--drawer-swipe-movement-y,0px))] data-ending-style:translate-y-full data-starting-style:translate-y-full data-swiping:transition-none motion-reduce:transition-none"
              finalFocus={() => triggerRef.current ?? completionFocusRef?.current ?? true}
              initialFocus={minimizeRef}
            >
              <div
                aria-hidden="true"
                className="mx-auto mt-3 h-1 w-24 rounded-full bg-muted-foreground/30"
              />

              <Drawer.Content className="mx-auto w-full max-w-md space-y-6 px-4 pt-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-6">
                <div className="space-y-1.5 text-center">
                  <Drawer.Title className="text-lg font-semibold">Descanso</Drawer.Title>

                  <Drawer.Description className="text-sm text-muted-foreground">
                    Ajuste o tempo antes da próxima série
                  </Drawer.Description>
                </div>

                <div
                  aria-label="Tempo restante de descanso"
                  aria-live="off"
                  className="text-center text-6xl font-semibold tracking-tight tabular-nums sm:text-7xl"
                  role="timer"
                >
                  {formattedRemaining}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    aria-label="Diminuir descanso em 15 segundos"
                    className="min-h-11"
                    onClick={() => onAdjust(-15)}
                    type="button"
                    variant="secondary"
                  >
                    -15 s
                  </Button>

                  <Button
                    aria-label="Aumentar descanso em 15 segundos"
                    className="min-h-11"
                    onClick={() => onAdjust(15)}
                    type="button"
                    variant="secondary"
                  >
                    +15 s
                  </Button>
                </div>

                <div className="flex flex-col gap-2">
                  <Drawer.Close
                    ref={minimizeRef}
                    render={<Button className="min-h-11 w-full" type="button" />}
                  >
                    <ChevronDownIcon aria-hidden="true" />
                    Minimizar descanso
                  </Drawer.Close>

                  {notificationPermission === "default" && (
                    <Button
                      onClick={onRequestNotificationPermission}
                      type="button"
                      variant="ghost"
                    >
                      Ativar alertas
                    </Button>
                  )}
                </div>
              </Drawer.Content>
            </Drawer.Popup>
          </Drawer.Viewport>
        </div>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
