import { TriangleAlertIcon } from "lucide-react"
import type { Exercise } from "@/lib/exercises/types"
import { muscleGroupLabel } from "@/lib/exercises/types"
import type { WorkoutExercise } from "@/lib/workouts/types"
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
    <article className="border bg-background">
      <header className="flex items-center gap-3 border-b bg-muted/30 p-3">
        <span className="flex size-8 shrink-0 items-center justify-center bg-primary text-xs font-bold text-primary-foreground">
          {index + 1}
        </span>
        <div className="min-w-0">
          <p className="wrap-break-word font-semibold">
            {current?.name ?? exercise.exerciseSnapshot.name}
          </p>
          <p className="text-xs text-muted-foreground">
            {
              muscleGroupLabel[
                current?.muscleGroup ?? exercise.exerciseSnapshot.muscleGroup
              ]
            }{" "}
            ·{" "}
            {exercise.exerciseReference.source === "default" ? "Padrão" : "Personalizado"}
          </p>
          {!current && (
            <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              <TriangleAlertIcon aria-hidden="true" className="size-3" />
              Exercício indisponível · exibindo dados salvos
            </p>
          )}
        </div>
      </header>
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
      </div>
    </article>
  )
}
