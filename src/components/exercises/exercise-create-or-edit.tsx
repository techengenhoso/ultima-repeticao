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
      <DialogContent className="max-h-[calc(100dvh-2rem)] sm:max-w-xl">
        <DialogHeader className="pr-12">
          <DialogTitle>{exercise ? "Editar exercício" : "Novo exercício"}</DialogTitle>
          <DialogDescription>
            {exercise
              ? "Atualize os dados do seu exercício"
              : "Preencha os dados do seu exercício"}
          </DialogDescription>
        </DialogHeader>

        <ExerciseForm
          exercise={exercise}
          key={exercise?.id ?? "new-exercise"}
          onCancel={() => onClose(undefined)}
          onSubmit={onSubmit}
        />
      </DialogContent>
    </Dialog>
  )
}
