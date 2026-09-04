"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useWorkout } from "@/contexts/workout-context"
import { WorkoutForm } from "./workout-form"

export function WorkoutCreateOrEdit() {
  const {
    exercises,
    exercisesByReference,
    formWorkout: workout,
    handleSaveWorkout: onSubmit,
    setFormWorkout: onClose,
  } = useWorkout()

  return (
    <Dialog
      onOpenChange={open => !open && onClose(undefined)}
      open={workout !== undefined}
    >
      <DialogContent className="no-scrollbar max-h-[calc(100svh-1rem)] w-[calc(100%-1rem)] max-w-[calc(100%-1rem)] overflow-x-hidden overflow-y-auto p-4 sm:max-w-4xl sm:p-6">
        <DialogHeader>
          <DialogTitle>{workout?.id ? "Editar ficha" : "Nova ficha"}</DialogTitle>
          <DialogDescription>
            Revise os dias e exercícios antes de salvar
          </DialogDescription>
        </DialogHeader>

        <WorkoutForm
          exercises={exercises}
          exercisesByReference={exercisesByReference}
          onCancel={() => onClose(undefined)}
          onSubmit={onSubmit}
          workout={workout}
        />
      </DialogContent>
    </Dialog>
  )
}
