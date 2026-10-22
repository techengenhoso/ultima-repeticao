"use client"

import { cn } from "cn"
import type { z } from "zod"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { sessionExerciseSchema } from "@/modules/sessions/domain/session"

type SessionExerciseValue = z.input<typeof sessionExerciseSchema>

type ExerciseCardState = "completed" | "inProgress" | "pending"

const exerciseCardStates = {
  completed: {
    card: "ring-primary/30",
    label: "Concluído",
    labelStyle: "text-primary",
    progress: "[&>span]:bg-primary",
  },
  inProgress: {
    card: "ring-primary/20",
    label: "Em execução",
    labelStyle: "text-primary",
    progress: "[&>span]:bg-primary",
  },
  pending: {
    card: "",
    label: "Pendente",
    labelStyle: "text-muted-foreground",
    progress: "",
  },
} as const

const completedWorkSets = (exercise: SessionExerciseValue) =>
  exercise.sets.filter(set => !set.warmup && set.completed).length

function getExerciseCardState(completed: number, targetSets: number): ExerciseCardState {
  if (completed === targetSets) return "completed"
  return completed > 0 ? "inProgress" : "pending"
}

export function hasCompletedAllWorkSets(exercise: SessionExerciseValue) {
  return completedWorkSets(exercise) === exercise.targetSets
}

function SessionExerciseCard({
  exercise,
  index,
  onSelect,
}: {
  exercise: SessionExerciseValue
  index: number
  onSelect: (index: number) => void
}) {
  const completed = completedWorkSets(exercise)
  const cardState = getExerciseCardState(completed, exercise.targetSets)
  const state = exerciseCardStates[cardState]

  return (
    <Card className={cn("gap-0 py-0", state.card)}>
      <Button
        className="h-auto min-h-28 w-full justify-start rounded-4xl p-4 text-left normal-case tracking-normal whitespace-normal"
        onClick={() => onSelect(index)}
        type="button"
        variant="ghost"
      >
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <div className="flex min-w-0 items-start gap-3">
            <Badge
              aria-hidden="true"
              className="size-10 rounded-3xl p-0 text-sm tabular-nums"
              variant="secondary"
            >
              {String(index + 1).padStart(2, "0")}
            </Badge>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                <Badge
                  className={cn(
                    "p-0 text-xs font-semibold tracking-wider uppercase",
                    state.labelStyle
                  )}
                  variant="ghost"
                >
                  {state.label}
                </Badge>

                <Badge
                  className="p-0 text-xs tabular-nums text-muted-foreground"
                  variant="ghost"
                >
                  {completed} de {exercise.targetSets} séries
                </Badge>
              </div>

              <h3 className="wrap-break-word text-base font-semibold">
                {exercise.exerciseSnapshot.name}
              </h3>
            </div>
          </div>

          <Progress
            className={cn("h-1.5", state.progress)}
            value={(completed / exercise.targetSets) * 100}
          />
        </div>
      </Button>
    </Card>
  )
}

export function SessionExercisePicker({
  exercises,
  onSelect,
}: {
  exercises: SessionExerciseValue[]
  onSelect: (index: number) => void
}) {
  const completedExercises = exercises.filter(hasCompletedAllWorkSets).length

  return (
    <section aria-labelledby="session-exercises-title" className="space-y-5">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                Progresso do treino
              </p>
              <CardTitle className="mt-1 text-xl" id="session-exercises-title">
                Escolha o próximo exercício
              </CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Registre as séries e acompanhe seu avanço
              </p>
            </div>
            <Badge className="h-auto px-3 py-2 text-sm tabular-nums" variant="secondary">
              {completedExercises}/{exercises.length} concluídos
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Progress
            className="h-2"
            value={(completedExercises / exercises.length) * 100}
          />
        </CardContent>
      </Card>

      <div className="grid gap-3 lg:grid-cols-2">
        {exercises.map((exercise, index) => (
          <SessionExerciseCard
            exercise={exercise}
            index={index}
            key={`${exercise.exerciseReference.source}:${exercise.exerciseReference.exerciseId}:${index}`}
            onSelect={onSelect}
          />
        ))}
      </div>
    </section>
  )
}
