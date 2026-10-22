"use client"

import { XIcon } from "lucide-react"
import { useState } from "react"
import { ConfirmationDialog } from "@/components/confirmation-dialog"
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
    exerciseProgressions,
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
        onOpenChange={open => !open && requestDiscard()}
        open={workout !== undefined}
      >
        <DialogContent
          className="max-h-[calc(100dvh-2rem)] grid-rows-[auto_minmax(0,1fr)] overflow-hidden sm:max-w-xl"
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
          <DialogHeader className="pr-12">
            <DialogTitle>{workout?.id ? "Editar ficha" : "Nova ficha"}</DialogTitle>
            <DialogDescription>
              Revise os dias e exercícios antes de salvar
            </DialogDescription>
          </DialogHeader>

          <WorkoutForm
            exerciseProgressions={exerciseProgressions}
            exercises={exercises}
            exercisesByReference={exercisesByReference}
            onCancel={requestDiscard}
            onSubmit={onSubmit}
            workout={workout}
          />
        </DialogContent>
      </Dialog>
      <ConfirmationDialog
        cancelLabel="Continuar editando"
        confirmLabel="Descartar"
        description="Ao fechar os dados preenchidos nesta ficha não serão salvos. Esta ação não poderá ser desfeita"
        onConfirm={discardWorkout}
        onOpenChange={setIsDiscarding}
        open={isDiscarding}
        title="Descartar alterações"
      />
    </>
  )
}
