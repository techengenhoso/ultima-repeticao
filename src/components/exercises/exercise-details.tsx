import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { type Exercise, exerciseLevelLabel, muscleGroupLabel } from "@/lib/exercises/types"
import { DetailSection } from "./exercise-detail-section"

interface Props {
  exercise: Exercise | null
  onClose: () => void
}

export function ExerciseDetails({ exercise, onClose }: Props) {
  return (
    <Dialog onOpenChange={open => !open && onClose()} open={!!exercise}>
      <DialogContent className="max-h-[calc(100vh-2rem)] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="pr-10 normal-case tracking-normal">
            {exercise?.name}
          </DialogTitle>

          <DialogDescription>
            {exercise?.source === "system"
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

              <DetailSection title="Nível" value={exerciseLevelLabel[exercise.level]} />

              <DetailSection
                title="Músculos principais"
                value={exercise.primaryMuscles.join(", ")}
              />

              <DetailSection
                title="Padrão de movimento"
                value={exercise.movementPattern}
              />
            </div>

            <DetailSection
              title="Músculos secundários"
              value={exercise.secondaryMuscles.join(", ")}
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
