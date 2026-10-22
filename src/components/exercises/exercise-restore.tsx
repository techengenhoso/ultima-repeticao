"use client"

import { ConfirmationDialog } from "@/components/confirmation-dialog"
import { useExercise } from "@/contexts/exercise-context"

export function ExerciseRestore() {
  const {
    confirmRestore: onConfirm,
    isRestoring,
    restoring: exercise,
    setRestoring: onClose,
  } = useExercise()

  return (
    <ConfirmationDialog
      closeOnConfirm
      confirmLabel="Restaurar"
      description={
        <>
          Suas personalizações de “{exercise?.name}” serão removidas e a versão padrão será
          restaurada
        </>
      }
      isPending={isRestoring}
      onConfirm={() => void onConfirm()}
      onOpenChange={open => !open && !isRestoring && onClose(null)}
      open={Boolean(exercise)}
      title="Restaurar exercício padrão"
    />
  )
}
