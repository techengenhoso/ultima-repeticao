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
import { useExercise } from "@/contexts/exercise-context"

export function ExerciseDelete() {
  const {
    confirmDelete: onConfirm,
    deleting: exercise,
    isDeleting,
    setDeleting: onClose,
  } = useExercise()

  return (
    <AlertDialog
      onOpenChange={open => !open && !isDeleting && onClose(null)}
      open={!!exercise}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir exercício</AlertDialogTitle>

          <AlertDialogDescription>
            O exercício “{exercise?.name}” será excluído permanentemente. Esta ação não
            poderá ser desfeita!
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
