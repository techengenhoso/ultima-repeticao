"use client"

import type { z } from "zod"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { sessionExerciseSchema } from "@/modules/sessions/domain/session"

type SessionExerciseValue = z.input<typeof sessionExerciseSchema>
type ExerciseCardState = "completed" | "inProgress" | "pending"

const exerciseCardStates = {
  completed: {
    button: "border-primary/50 bg-primary/5 hover:bg-primary/10",
    indicator: "bg-primary",
    label: "Concluído",
    labelStyle: "bg-primary text-primary-foreground",
    progress: "flex-1",
  },
  inProgress: {
    button: "border-primary/50 bg-primary/10 hover:bg-primary/15",
    indicator: "bg-primary",
    label: "Em execução",
    labelStyle: "bg-primary text-primary-foreground",
    progress: "flex-1 [&>span]:bg-primary",
  },
  pending: {
    button: "border-primary/25 bg-card hover:border-primary/50 hover:bg-primary/5",
    indicator: "bg-primary/40",
    label: "Pendente",
    labelStyle: "bg-muted text-muted-foreground",
    progress: "flex-1",
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
  const state = exerciseCardStates[getExerciseCardState(completed, exercise.targetSets)]
  return (
    <Button
      aria-label={`Abrir ${exercise.exerciseSnapshot.name}`}
      className={cn(
        "h-auto min-h-0 items-stretch justify-start p-0 text-left normal-case tracking-normal whitespace-normal",
        state.button
      )}
      onClick={() => onSelect(index)}
      type="button"
      variant="outline"
    >
      <span className="grid min-w-0 flex-1 grid-cols-[0.25rem_minmax(0,1fr)]">
        <span aria-hidden="true" className={state.indicator} />
        <span className="flex min-w-0 flex-col gap-1.5 px-3 py-2.5">
          <span className="flex items-center justify-between gap-3">
            <span className="min-w-0 wrap-break-word text-sm font-semibold">
              <span className="mr-2 text-primary">
                {String(index + 1).padStart(2, "0")}
              </span>
              {exercise.exerciseSnapshot.name}
            </span>
            <span
              className={cn(
                "shrink-0 px-1.5 py-0.5 text-[0.625rem] font-semibold tracking-wider uppercase",
                state.labelStyle
              )}
            >
              {state.label}
            </span>
          </span>
          <span className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="shrink-0 tabular-nums">
              {completed}/{exercise.targetSets} séries
            </span>
            <Progress
              className={state.progress}
              value={(completed / exercise.targetSets) * 100}
            />
          </span>
        </span>
      </span>
    </Button>
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
  const allCompleted = completedExercises === exercises.length
  return (
    <section aria-labelledby="session-exercises-title" className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold" id="session-exercises-title">
            Exercícios da sessão
          </h2>
          <p className="text-sm text-muted-foreground">
            Escolha um exercício para registrar suas séries
          </p>
        </div>
        <p className="text-sm tabular-nums text-muted-foreground">
          {completedExercises}/{exercises.length} concluídos
        </p>
      </div>
      {allCompleted && (
        <p className="border border-border bg-muted/40 px-3 py-2 text-sm">
          Todos os exercícios foram concluídos · Você já pode finalizar o treino
        </p>
      )}
      <div className="grid gap-2 sm:grid-cols-2">
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
