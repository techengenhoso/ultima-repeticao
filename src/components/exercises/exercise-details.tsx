"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useExercise } from "@/contexts/exercise-context"
import {
  exerciseDifficultyLabel,
  muscleGroupLabel,
  muscleLabel,
} from "@/lib/exercises/types"
import { DetailSection } from "./exercise-detail-section"

export function ExerciseDetails() {
  const { details: exercise, setDetails: onClose } = useExercise()

  return (
    <Dialog onOpenChange={open => !open && onClose(null)} open={!!exercise}>
      <DialogContent className="max-h-[calc(100vh-2rem)] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="pr-10 normal-case tracking-normal">
            {exercise?.name}
          </DialogTitle>

          <DialogDescription>
            {exercise?.source === "default"
              ? "Exercício padrão"
              : "Exercício personalizado"}
          </DialogDescription>
        </DialogHeader>

        {exercise && (
          <dl className="space-y-5">
            <div className="grid gap-5 lg:grid-cols-2">
              <DetailSection
                title="Grupo principal"
                value={muscleGroupLabel[exercise.muscleGroup]}
              />

              <DetailSection
                title="Dificuldade"
                value={exerciseDifficultyLabel[exercise.difficulty]}
              />

              <DetailSection
                title="Músculos principais"
                value={exercise.primaryMuscles
                  .map(muscle => muscleLabel[muscle] ?? muscle)
                  .join(", ")}
              />

              <DetailSection
                title="Padrão de movimento"
                value={exercise.movementPattern}
              />
            </div>

            <DetailSection
              title="Músculos secundários"
              value={exercise.secondaryMuscles
                .map(muscle => muscleLabel[muscle] ?? muscle)
                .join(", ")}
            />

            <DetailSection title="Posição inicial" value={exercise.startingPosition} />

            <DetailSection
              title="Execução do movimento"
              value={exercise.movementExecution}
            />

            <DetailSection
              title="Cuidados importantes"
              value={exercise.importantCautions}
            />
          </dl>
        )}
      </DialogContent>
    </Dialog>
  )
}
