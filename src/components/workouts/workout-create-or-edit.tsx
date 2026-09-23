"use client"

import { XIcon } from "lucide-react"
import { useState } from "react"
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
  const [isDiscarding, setIsDiscarding] = useState(false)
  const {
    exercises,
    exercisesByReference,
    formWorkout: workout,
    handleSaveWorkout: onSubmit,
    setFormWorkout: onClose,
  } = useWorkout()
  const requestDiscard = () => setIsDiscarding(true)

  const discardWorkout = () => {
    setIsDiscarding(false)
    onClose(undefined)
  }

  return (
    <>
      <Dialog
        onOpenChange={open => !open && onClose(undefined)}
        open={workout !== undefined}
      >
        <DialogContent
          className="max-h-[calc(100svh-1rem)] w-[calc(100%-1rem)] max-w-[calc(100%-1rem)] overflow-x-hidden overflow-y-auto p-4 sm:max-w-4xl sm:p-6"
          showCloseButton={false}
        >
          <Button
            aria-label="Descartar alterações"
            className="absolute top-3 right-3"
            onClick={requestDiscard}
            size="icon-sm"
            type="button"
            variant="ghost"
          >
            <XIcon aria-hidden="true" />
          </Button>
          <DialogHeader>
            <DialogTitle>{workout?.id ? "Editar ficha" : "Nova ficha"}</DialogTitle>
            <DialogDescription>
              Revise os dias e exercícios antes de salvar
            </DialogDescription>
          </DialogHeader>

          <WorkoutForm
            exercises={exercises}
            exercisesByReference={exercisesByReference}
            onCancel={requestDiscard}
            onSubmit={onSubmit}
            workout={workout}
          />
        </DialogContent>
      </Dialog>
      <AlertDialog onOpenChange={setIsDiscarding} open={isDiscarding}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Descartar alterações</AlertDialogTitle>
            <AlertDialogDescription>
              Os dados preenchidos nesta ficha não serão salvos. Esta ação não poderá ser
              desfeita
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel variant="secondary">Continuar editando</AlertDialogCancel>

            <Button onClick={discardWorkout} variant="destructive">
              Descartar
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
