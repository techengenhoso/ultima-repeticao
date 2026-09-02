"use client"

import { LoaderCircleIcon } from "lucide-react"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { useWorkout } from "@/contexts/workout-context"

export function WorkoutDelete() {
  const {
    confirmDelete: onConfirm,
    deleting: workout,
    isDeleting,
    setDeleting: onClose,
  } = useWorkout()
  return (
    <AlertDialog
      onOpenChange={open => !open && !isDeleting && onClose(null)}
      open={!!workout}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir ficha</AlertDialogTitle>
          <AlertDialogDescription>
            A ficha “{workout?.name}” será excluída permanentemente. Esta ação não poderá
            ser desfeita
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
          <Button disabled={isDeleting} onClick={onConfirm} variant="destructive">
            {isDeleting && <LoaderCircleIcon className="animate-spin" />}
            {isDeleting ? "Excluindo" : "Excluir"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
