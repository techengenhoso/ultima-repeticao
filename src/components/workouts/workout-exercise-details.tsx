import { ChevronDownIcon } from "lucide-react"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { type Exercise, muscleGroupLabel } from "@/modules/exercises/domain/exercise"
import type { WorkoutExercise } from "@/modules/workouts/domain/workout"
import { WorkoutExerciseMetric } from "./workout-exercise-metric"

interface Props {
  exercise: WorkoutExercise
  exercisesByReference: Map<string, Exercise>
  index: number
}

export function WorkoutExerciseDetails({ exercise, exercisesByReference, index }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const current = exercisesByReference.get(
    `${exercise.exerciseReference.source}:${exercise.exerciseReference.exerciseId}`
  )

  return (
    <Collapsible onOpenChange={setIsOpen} open={isOpen}>
      <Item className="min-w-0 gap-0 overflow-hidden p-0" size="sm" variant="outline">
        <ItemHeader className={`gap-3 bg-muted/50 px-3 py-3 ${isOpen ? "border-b" : ""}`}>
          <CollapsibleTrigger asChild>
            <button
              aria-label={`${isOpen ? "Ocultar" : "Exibir"} detalhes do exercício ${current?.name ?? exercise.exerciseSnapshot.name}`}
              className="group flex min-w-0 flex-1 items-center gap-3 text-left outline-none focus-visible:ring-2 focus-visible:ring-ring"
              type="button"
            >
              <ItemMedia className="size-8 bg-primary text-xs font-bold text-primary-foreground">
                {index + 1}
              </ItemMedia>
              <ItemContent className="min-w-0">
                <ItemTitle className="line-clamp-none wrap-break-word">
                  {current?.name ?? exercise.exerciseSnapshot.name}
                </ItemTitle>
                <ItemDescription>
                  {
                    muscleGroupLabel[
                      current?.muscleGroup ?? exercise.exerciseSnapshot.muscleGroup
                    ]
                  }{" "}
                  ·{" "}
                  {exercise.exerciseReference.source === "default"
                    ? "Padrão"
                    : "Personalizado"}
                </ItemDescription>
                {!current && (
                  <Badge className="mt-2 self-start" variant="secondary">
                    Indisponível
                  </Badge>
                )}
              </ItemContent>
              <ChevronDownIcon
                aria-hidden="true"
                className="ml-auto size-4 shrink-0 transition-transform group-aria-expanded:rotate-180"
              />
            </button>
          </CollapsibleTrigger>
        </ItemHeader>

        <CollapsibleContent className="basis-full">
          <div className="grid min-w-0 gap-4 px-4 py-4 sm:grid-cols-2 *:min-w-0">
            <WorkoutExerciseMetric label="Séries" value={exercise.sets.toString()} />
            <WorkoutExerciseMetric
              label="Repetições"
              value={exercise.repetitions.toString()}
            />
            <WorkoutExerciseMetric
              label="Carga"
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
          </div>
        </CollapsibleContent>
      </Item>
    </Collapsible>
  )
}
