"use client"

import { LoaderCircleIcon } from "lucide-react"
import type { ComponentProps, ReactNode } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

type ConfirmationDialogProps = {
  cancelLabel?: string
  children?: ReactNode
  closeOnConfirm?: boolean
  confirmForm?: string
  confirmLabel: string
  confirmType?: "button" | "submit"
  confirmVariant?: ComponentProps<typeof Button>["variant"]
  description: ReactNode
  isPending?: boolean
  onConfirm?: () => void
  onOpenChange: (open: boolean) => void
  open: boolean
  pendingLabel?: string
  title: ReactNode
  trigger?: ReactNode
}

export function ConfirmationDialog({
  cancelLabel = "Cancelar",
  children,
  closeOnConfirm = false,
  confirmForm,
  confirmLabel,
  confirmType = "button",
  confirmVariant = "destructive",
  description,
  isPending = false,
  onConfirm,
  onOpenChange,
  open,
  pendingLabel,
  title,
  trigger,
}: ConfirmationDialogProps) {
  const actionLabel = isPending && pendingLabel ? pendingLabel : confirmLabel

  return (
    <AlertDialog onOpenChange={onOpenChange} open={open}>
      {trigger && <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>}
      <AlertDialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto">
        <AlertDialogHeader className="sm:group-data-[size=default]/alert-dialog-content:place-items-center sm:group-data-[size=default]/alert-dialog-content:text-center">
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        {children}

        <AlertDialogFooter className="w-full gap-3 sm:justify-stretch sm:*:flex-1">
          <AlertDialogCancel disabled={isPending} variant="secondary">
            {cancelLabel}
          </AlertDialogCancel>

          {closeOnConfirm ? (
            <AlertDialogAction
              disabled={isPending}
              onClick={onConfirm}
              variant={confirmVariant}
            >
              {actionLabel}
            </AlertDialogAction>
          ) : (
            <Button
              disabled={isPending}
              form={confirmForm}
              onClick={onConfirm}
              type={confirmType}
              variant={confirmVariant}
            >
              {isPending && pendingLabel && <LoaderCircleIcon className="animate-spin" />}
              {actionLabel}
            </Button>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
