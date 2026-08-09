"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { Exercise, ExerciseInput } from "@/lib/exercises/types"
import { ExerciseForm } from "./exercise-form"

interface Props {
  exercise: Exercise | null | undefined
  onClose: () => void
  onSubmit: (values: ExerciseInput) => Promise<void>
}

export function ExerciseCreateOrEdit({ exercise, onClose, onSubmit }: Props) {
  return (
    <Dialog onOpenChange={open => !open && onClose()} open={exercise !== undefined}>
      <DialogContent className="no-scrollbar max-h-[calc(100vh-2rem)] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{exercise ? "Editar exercício" : "Novo exercício"}</DialogTitle>

          <DialogDescription>Preencha os dados do seu exercício</DialogDescription>
        </DialogHeader>

        <ExerciseForm exercise={exercise} onCancel={onClose} onSubmit={onSubmit} />
      </DialogContent>
    </Dialog>
  )
}
