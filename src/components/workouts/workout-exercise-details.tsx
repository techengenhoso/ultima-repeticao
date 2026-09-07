import { ChevronDownIcon, TriangleAlertIcon } from "lucide-react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { type Exercise, muscleGroupLabel } from "@/modules/exercises/domain/exercise"
import type { WorkoutExercise } from "@/modules/workouts/domain/workout"
import { WorkoutExerciseMetric } from "./workout-exercise-metric"

interface Props {
  exercise: WorkoutExercise
  exercisesByReference: Map<string, Exercise>
  index: number
}

export function WorkoutExerciseDetails({ exercise, exercisesByReference, index }: Props) {
  const current = exercisesByReference.get(
    `${exercise.exerciseReference.source}:${exercise.exerciseReference.exerciseId}`
  )

  return (
    <Collapsible defaultOpen>
      <article className="border bg-background">
        <header className="flex items-center gap-3 border-b bg-muted/30 p-3">
          <CollapsibleTrigger className="group flex min-w-0 flex-1 items-center gap-3 text-left">
            <span className="flex size-8 shrink-0 items-center justify-center bg-primary text-xs font-bold text-primary-foreground">
              {index + 1}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block wrap-break-word font-semibold">
                {current?.name ?? exercise.exerciseSnapshot.name}
              </span>
              <span className="block text-xs text-muted-foreground">
                {
                  muscleGroupLabel[
                    current?.muscleGroup ?? exercise.exerciseSnapshot.muscleGroup
                  ]
                }{" "}
                ·{" "}
                {exercise.exerciseReference.source === "default"
                  ? "Padrão"
                  : "Personalizado"}
              </span>
              {!current && (
                <span className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                  <TriangleAlertIcon aria-hidden="true" className="size-3" />
                  Exercício indisponível · exibindo dados salvos
                </span>
              )}
            </span>
            <ChevronDownIcon
              aria-hidden="true"
              className="size-4 shrink-0 text-muted-foreground transition-transform group-aria-expanded:rotate-180"
            />
          </CollapsibleTrigger>
        </header>
        <CollapsibleContent>
          <div className="grid gap-4 p-4 sm:grid-cols-3">
            <WorkoutExerciseMetric label="Séries" value={exercise.sets.toString()} />
            <WorkoutExerciseMetric
              label="Repetições"
              value={exercise.repetitions.toString()}
            />
            <WorkoutExerciseMetric
              label="Carga inicial"
              value={`${exercise.initialLoad.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })} kg`}
            />
            <WorkoutExerciseMetric
              label="Descanso"
              value={
                exercise.restSeconds === undefined
                  ? "Não informado"
                  : `${exercise.restSeconds} s`
              }
            />
            <WorkoutExerciseMetric
              label="RIR desejado"
              value={exercise.targetRir?.toString() ?? "Não informado"}
            />
          </div>
        </CollapsibleContent>
      </article>
    </Collapsible>
  )
}
