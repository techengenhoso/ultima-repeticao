"use client"

import { ChevronDownIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useWorkout } from "@/contexts/workout-context"
import { muscleGroupLabel, muscleLabel } from "@/lib/exercises/types"
import { WorkoutBadgeList } from "./workout-badge-list"
import { WorkoutDetailField } from "./workout-detail-field"
import { WorkoutExerciseDetails } from "./workout-exercise-details"

export function WorkoutDetails() {
  const { details: workout, exercisesByReference, setDetails: onClose } = useWorkout()

  return (
    <Dialog onOpenChange={open => !open && onClose(null)} open={!!workout}>
      <DialogContent className="flex max-h-[calc(100svh-1rem)] flex-col overflow-hidden sm:max-w-4xl">
        <DialogHeader>
          <div className="flex items-start justify-between gap-3 pr-14">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <DialogTitle className="normal-case tracking-normal">
                {workout?.name}
              </DialogTitle>
              {workout && (
                <span className="text-sm text-muted-foreground">
                  {workout.days.length} {workout.days.length === 1 ? "dia" : "dias"}
                </span>
              )}
            </div>
            <Badge variant={workout?.isActive ? "default" : "secondary"}>
              {workout?.isActive ? "Ativa" : "Inativa"}
            </Badge>
          </div>
          <DialogDescription className="mt-4">
            {workout?.description && `${workout.description} · `}
            {workout && (
              <>
                Última atualização em{" "}
                {new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" }).format(
                  workout.updatedAt.toDate()
                )}
              </>
            )}
          </DialogDescription>
        </DialogHeader>
        {workout && (
          <div className="no-scrollbar min-h-0 space-y-6 overflow-y-auto">
            <div className="space-y-4">
              {[...workout.days]
                .sort((a, b) => a.order - b.order)
                .map((day, dayIndex) => {
                  const currentExercises = day.exercises.flatMap(exercise => {
                    const current = exercisesByReference.get(
                      `${exercise.exerciseReference.source}:${exercise.exerciseReference.exerciseId}`
                    )
                    return current ? [current] : []
                  })
                  const primaryMuscles = [
                    ...new Set(
                      currentExercises.flatMap(exercise => exercise.primaryMuscles)
                    ),
                  ]
                  const secondaryMuscles = [
                    ...new Set(
                      currentExercises.flatMap(exercise => exercise.secondaryMuscles)
                    ),
                  ]

                  return (
                    <Collapsible defaultOpen key={day.id}>
                      <Card
                        className="gap-0 border border-border border-l-2 border-l-primary py-0"
                        size="sm"
                      >
                        <CardHeader className="border-b bg-muted/40 py-4 [.border-b]:pb-4">
                          <CollapsibleTrigger className="group flex w-full items-center gap-3 text-left">
                            <span className="flex size-9 shrink-0 items-center justify-center bg-primary text-sm font-bold text-primary-foreground">
                              {dayIndex + 1}
                            </span>
                            <span className="min-w-0 flex-1">
                              <CardTitle className="text-base">{day.name}</CardTitle>
                              <span className="block text-xs text-muted-foreground">
                                {day.exercises.length}{" "}
                                {day.exercises.length === 1 ? "exercício" : "exercícios"}
                              </span>
                            </span>
                            <ChevronDownIcon
                              aria-hidden="true"
                              className="size-4 shrink-0 text-muted-foreground transition-transform group-aria-expanded:rotate-180"
                            />
                          </CollapsibleTrigger>
                        </CardHeader>
                        <CollapsibleContent>
                          <CardContent className="space-y-6 py-5">
                            <div>
                              <h3 className="font-semibold">Configuração do dia</h3>
                              <p className="text-xs text-muted-foreground">
                                Músculos trabalhados neste treino
                              </p>
                            </div>
                            <WorkoutDetailField label="Grupos musculares">
                              <WorkoutBadgeList
                                emptyLabel="Nenhum grupo muscular"
                                labels={day.muscleGroups.map(
                                  group => muscleGroupLabel[group]
                                )}
                              />
                            </WorkoutDetailField>
                            <div className="space-y-5">
                              <WorkoutDetailField label="Músculos principais">
                                <WorkoutBadgeList
                                  emptyLabel="Nenhum músculo principal"
                                  labels={primaryMuscles.map(
                                    muscle => muscleLabel[muscle]
                                  )}
                                />
                              </WorkoutDetailField>

                              <WorkoutDetailField label="Músculos secundários">
                                <WorkoutBadgeList
                                  emptyLabel="Nenhum músculo secundário"
                                  labels={secondaryMuscles.map(
                                    muscle => muscleLabel[muscle]
                                  )}
                                />
                              </WorkoutDetailField>
                            </div>

                            <Collapsible defaultOpen>
                              <div className="-mx-(--card-spacing) border-t px-(--card-spacing) pt-5">
                                <CollapsibleTrigger className="group flex w-full items-center gap-3 text-left">
                                  <ChevronDownIcon
                                    aria-hidden="true"
                                    className="size-4 shrink-0 text-muted-foreground transition-transform group-aria-expanded:rotate-180"
                                  />
                                  <span className="min-w-0">
                                    <span className="block font-semibold">
                                      Exercícios do treino
                                    </span>
                                    <span className="block text-xs text-muted-foreground">
                                      Sequência, séries, repetições e carga inicial
                                    </span>
                                  </span>
                                </CollapsibleTrigger>
                              </div>
                              <CollapsibleContent className="pt-5">
                                <div className="space-y-3">
                                  {[...day.exercises]
                                    .sort((a, b) => a.order - b.order)
                                    .map((exercise, exerciseIndex) => (
                                      <WorkoutExerciseDetails
                                        exercise={exercise}
                                        exercisesByReference={exercisesByReference}
                                        index={exerciseIndex}
                                        key={exercise.id}
                                      />
                                    ))}
                                </div>
                              </CollapsibleContent>
                            </Collapsible>
                          </CardContent>
                        </CollapsibleContent>
                      </Card>
                    </Collapsible>
                  )
                })}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
