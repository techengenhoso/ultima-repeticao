"use client"

import type { ReactNode } from "react"
import { StartSessionButton } from "@/components/sessions/start-session-button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Item, ItemContent, ItemDescription, ItemGroup } from "@/components/ui/item"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useWorkout } from "@/contexts/workout-context"
import { muscleGroupLabel, muscleLabel } from "@/modules/exercises/domain/exercise"
import { WorkoutBadgeList } from "./workout-badge-list"
import { WorkoutExerciseDetails } from "./workout-exercise-details"

function WorkoutDayDetail({ children, label }: { children: ReactNode; label: string }) {
  return (
    <Item className="items-start" size="sm" variant="muted">
      <ItemContent className="min-w-0">
        <ItemDescription className="leading-tight">{label}</ItemDescription>
        <div className="mt-1">{children}</div>
      </ItemContent>
    </Item>
  )
}

export function WorkoutDetails() {
  const {
    activateWorkout,
    deactivateWorkout,
    details: workout,
    exercisesByReference,
    isActivating,
    setDetails: onClose,
  } = useWorkout()
  const days = workout
    ? [...workout.days].sort((left, right) => left.order - right.order)
    : []

  return (
    <Dialog onOpenChange={open => !open && onClose(null)} open={!!workout}>
      <DialogContent className="max-h-[calc(100dvh-2rem)] grid-rows-[auto_minmax(0,1fr)_auto] overflow-hidden sm:max-w-xl">
        <DialogHeader className="pr-12">
          <DialogTitle>{workout?.name}</DialogTitle>

          <DialogDescription>
            {workout && (
              <>
                {workout.days.length} {workout.days.length === 1 ? "dia" : "dias"} de
                treino
                {workout.description && ` · ${workout.description}`}
                {" · Última atualização em "}
                {new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" }).format(
                  new Date(workout.updatedAt)
                )}
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        {workout && (
          <ScrollArea className="h-full min-h-0">
            <Accordion collapsible type="single">
              {days.map((day, dayIndex) => {
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
                  <AccordionItem className="data-open:bg-card" key={day.id} value={day.id}>
                    <AccordionTrigger className="items-center bg-muted/50 px-4 py-4 hover:bg-muted hover:no-underline aria-expanded:bg-muted">
                      <span className="flex min-w-0 items-center gap-3">
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground">
                          {dayIndex + 1}
                        </span>
                        <span className="flex min-w-0 flex-col gap-0.5">
                          <span>{day.name}</span>
                          <span className="text-xs font-normal text-muted-foreground">
                            {day.exercises.length}{" "}
                            {day.exercises.length === 1 ? "exercício" : "exercícios"}
                          </span>
                        </span>
                      </span>
                    </AccordionTrigger>

                    <AccordionContent className="h-auto pt-4">
                      <div className="space-y-5">
                        <StartSessionButton dayId={day.id} planId={workout.id} />

                        <ItemGroup>
                          <WorkoutDayDetail label="Grupos musculares">
                            <WorkoutBadgeList
                              emptyLabel="Nenhum grupo muscular"
                              labels={day.muscleGroups.map(
                                group => muscleGroupLabel[group]
                              )}
                            />
                          </WorkoutDayDetail>

                          <WorkoutDayDetail label="Músculos principais">
                            <WorkoutBadgeList
                              emptyLabel="Nenhum músculo principal"
                              labels={primaryMuscles.map(muscle => muscleLabel[muscle])}
                            />
                          </WorkoutDayDetail>

                          <WorkoutDayDetail label="Músculos secundários">
                            <WorkoutBadgeList
                              emptyLabel="Nenhum músculo secundário"
                              labels={secondaryMuscles.map(muscle => muscleLabel[muscle])}
                            />
                          </WorkoutDayDetail>
                        </ItemGroup>

                        <div className="space-y-3">
                          {[...day.exercises]
                            .sort((left, right) => left.order - right.order)
                            .map((exercise, exerciseIndex) => (
                              <WorkoutExerciseDetails
                                exercise={exercise}
                                exercisesByReference={exercisesByReference}
                                index={exerciseIndex}
                                key={exercise.id}
                              />
                            ))}
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )
              })}
            </Accordion>
          </ScrollArea>
        )}

        {workout && (
          <DialogFooter className="shrink-0 sm:justify-end">
            <Button
              disabled={isActivating}
              onClick={() =>
                workout.isActive ? deactivateWorkout(workout) : activateWorkout(workout)
              }
              size="sm"
              type="button"
              variant="secondary"
            >
              {workout.isActive ? "Desativar ficha" : "Ativar ficha"}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}
