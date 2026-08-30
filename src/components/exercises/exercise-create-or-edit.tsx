"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useExercise } from "@/contexts/exercise-context"
import { ExerciseForm } from "./exercise-form"

export function ExerciseCreateOrEdit() {
  const {
    formExercise: exercise,
    handleSaveExercise: onSubmit,
    setFormExercise: onClose,
  } = useExercise()

  return (
    <Dialog
      onOpenChange={open => !open && onClose(undefined)}
      open={exercise !== undefined}
    >
      <DialogContent className="no-scrollbar max-h-[calc(100vh-2rem)] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{exercise ? "Editar exercício" : "Novo exercício"}</DialogTitle>
          <DialogDescription>Preencha os dados do seu exercício</DialogDescription>
        </DialogHeader>

        <ExerciseForm
          exercise={exercise}
          onCancel={() => onClose(undefined)}
          onSubmit={onSubmit}
        />
      </DialogContent>
    </Dialog>
  )
}
