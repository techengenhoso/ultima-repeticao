"use client"

import { ConfirmationDialog } from "@/components/confirmation-dialog"
import { useExercise } from "@/contexts/exercise-context"

export function ExerciseDelete() {
  const {
    confirmDelete: onConfirm,
    deleting: exercise,
    isDeleting,
    setDeleting: onClose,
  } = useExercise()

  return (
    <ConfirmationDialog
      closeOnConfirm
      confirmLabel="Excluir"
      description="Este exercício será excluído permanentemente sem possibilidade de recuperação"
      isPending={isDeleting}
      onConfirm={() => void onConfirm()}
      onOpenChange={open => !open && !isDeleting && onClose(null)}
      open={!!exercise}
      title="Exclusão permanente"
    />
  )
}
