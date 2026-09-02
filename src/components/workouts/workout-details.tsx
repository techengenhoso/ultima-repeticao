"use client"

import { ChevronDownIcon } from "lucide-react"
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
      <DialogContent className="no-scrollbar max-h-[calc(100svh-1rem)] overflow-y-auto sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="pr-10 normal-case tracking-normal">
            {workout?.name}
          </DialogTitle>
          <DialogDescription>
            {workout?.isActive ? "Ficha ativa" : "Ficha inativa"}
            {workout
              ? ` · ${workout.days.length} ${workout.days.length === 1 ? "dia" : "dias"}`
              : ""}
          </DialogDescription>
        </DialogHeader>
        {workout && (
          <div className="space-y-6">
            <div className="space-y-1 text-sm text-muted-foreground">
              {workout.description && <p>{workout.description}</p>}
              <p>
                Última atualização em{" "}
                {new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" }).format(
                  workout.updatedAt.toDate()
                )}
              </p>
            </div>
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
                      <Card className="gap-0 border-l-2 border-l-primary py-0" size="sm">
                        <CardHeader className="border-b bg-muted/40 py-4 [.border-b]:pb-4">
                          <CollapsibleTrigger className="group flex w-full items-center gap-3 text-left">
                            <span className="flex size-9 shrink-0 items-center justify-center bg-primary text-sm font-bold text-primary-foreground">
                              {dayIndex + 1}
                            </span>
                            <span className="min-w-0 flex-1">
                              <CardTitle className="text-base">Dia de treino</CardTitle>
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
                                Nome e músculos trabalhados neste treino
                              </p>
                            </div>
                            <div className="grid gap-5 md:grid-cols-2">
                              <WorkoutDetailField label="Nome do dia">
                                {day.name}
                              </WorkoutDetailField>
                              <WorkoutDetailField label="Grupos musculares">
                                <WorkoutBadgeList
                                  emptyLabel="Nenhum grupo muscular"
                                  labels={day.muscleGroups.map(
                                    group => muscleGroupLabel[group]
                                  )}
                                />
                              </WorkoutDetailField>
                            </div>
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
                            <div className="border-t pt-5">
                              <h3 className="font-semibold">Exercícios do treino</h3>
                              <p className="text-xs text-muted-foreground">
                                Sequência, séries, repetições e carga inicial
                              </p>
                            </div>
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
