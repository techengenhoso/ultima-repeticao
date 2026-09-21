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

const preventOutsideDismissal = (event: { preventDefault: () => void }) =>
  event.preventDefault()

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
      <DialogContent
        className="flex max-h-[calc(100dvh-2rem)] min-w-0 flex-col gap-4 overflow-hidden px-4 py-8 sm:max-w-xl sm:px-6 sm:py-8"
        onPointerDownOutside={preventOutsideDismissal}
      >
        <DialogHeader>
          <DialogTitle>{exercise ? "Editar exercício" : "Novo exercício"}</DialogTitle>
          <DialogDescription>Preencha os dados do seu exercício</DialogDescription>
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
