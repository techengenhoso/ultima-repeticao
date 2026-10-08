"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useExercise } from "@/contexts/exercise-context"

export function ExerciseRestore() {
  const {
    confirmRestore: onConfirm,
    isRestoring,
    restoring: exercise,
    setRestoring: onClose,
  } = useExercise()

  return (
    <AlertDialog
      onOpenChange={open => !open && !isRestoring && onClose(null)}
      open={Boolean(exercise)}
    >
      <AlertDialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto">
        <AlertDialogHeader className="sm:group-data-[size=default]/alert-dialog-content:place-items-center sm:group-data-[size=default]/alert-dialog-content:text-center">
          <AlertDialogTitle>Restaurar exercício padrão</AlertDialogTitle>

          <AlertDialogDescription>
            Suas personalizações de “{exercise?.name}” serão removidas e a versão padrão
            será restaurada
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="w-full gap-3 sm:justify-stretch sm:*:flex-1">
          <AlertDialogCancel disabled={isRestoring} variant="secondary">
            Cancelar
          </AlertDialogCancel>

          <AlertDialogAction
            disabled={isRestoring}
            onClick={() => void onConfirm()}
            variant="destructive"
          >
            Restaurar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
