"use client"

import { ConfirmationDialog } from "@/components/confirmation-dialog"
import { useWorkout } from "@/contexts/workout-context"

export function WorkoutDelete() {
  const {
    confirmDelete: onConfirm,
    deleting: workout,
    isDeleting,
    setDeleting: onClose,
  } = useWorkout()
  return (
    <ConfirmationDialog
      confirmLabel="Excluir"
      description={
        <>
          A ficha “{workout?.name}” será excluída permanentemente. Esta ação não poderá ser
          desfeita
        </>
      }
      isPending={isDeleting}
      onConfirm={onConfirm}
      onOpenChange={open => !open && !isDeleting && onClose(null)}
      open={!!workout}
      pendingLabel="Excluindo"
      title="Excluir ficha"
    />
  )
}
