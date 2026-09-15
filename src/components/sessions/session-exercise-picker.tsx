"use client"

import { ArrowRightIcon, CheckIcon } from "lucide-react"
import type { z } from "zod"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { sessionExerciseSchema } from "@/modules/sessions/domain/session"

type SessionExerciseValue = z.input<typeof sessionExerciseSchema>
type ExerciseCardState = "completed" | "inProgress" | "pending"

const exerciseCardStates = {
  completed: {
    button: "border-primary/50 bg-primary/5 hover:bg-primary/5",
    badge: "bg-primary text-primary-foreground",
    label: "Concluído",
    labelStyle: "text-primary",
    progress: "[&>span]:bg-primary",
    action: "Revisar séries",
  },
  inProgress: {
    button: "border-primary/50 bg-primary/10 hover:bg-primary/10",
    badge: "bg-primary/15 text-primary",
    label: "Em execução",
    labelStyle: "text-primary",
    progress: "[&>span]:bg-primary",
    action: "Continuar registrando",
  },
  pending: {
    button: "border-border bg-card hover:bg-card",
    badge: "bg-muted text-muted-foreground",
    label: "Pendente",
    labelStyle: "text-muted-foreground",
    progress: "",
    action: "Registrar séries",
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
      aria-label={`${state.action}: ${exercise.exerciseSnapshot.name}`}
      className={cn(
        "h-auto min-h-40 w-full justify-start p-4 text-left normal-case tracking-normal whitespace-normal",
        state.button
      )}
      onClick={() => onSelect(index)}
      type="button"
      variant="card"
    >
      <div className="flex min-w-0 flex-1 flex-col gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <span
            aria-hidden="true"
            className={cn(
              "flex size-10 shrink-0 items-center justify-center text-sm font-semibold tabular-nums",
              state.badge
            )}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
              <p
                className={cn(
                  "text-xs font-semibold tracking-wider uppercase",
                  state.labelStyle
                )}
              >
                {state.label}
              </p>
              <p className="text-xs tabular-nums text-muted-foreground">
                {completed} de {exercise.targetSets} séries
              </p>
            </div>
            <h3 className="mt-1 wrap-break-word text-base font-semibold">
              {exercise.exerciseSnapshot.name}
            </h3>
          </div>
        </div>
        <div className="space-y-2 border-t border-border pt-3">
          <Progress
            className={cn("h-1.5", state.progress)}
            value={(completed / exercise.targetSets) * 100}
          />
          <span className="flex items-center justify-between gap-3 text-xs font-semibold tracking-wider uppercase text-primary">
            <span>{state.action}</span>
            {state.label === "Concluído" ? (
              <CheckIcon aria-hidden="true" />
            ) : (
              <ArrowRightIcon aria-hidden="true" />
            )}
          </span>
        </div>
      </div>
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

  return (
    <section aria-labelledby="session-exercises-title" className="space-y-5">
      <div className="border bg-card p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">
              Progresso do treino
            </p>
            <h2 className="mt-1 text-xl font-semibold" id="session-exercises-title">
              Escolha o próximo exercício
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Registre as séries e acompanhe seu avanço
            </p>
          </div>
          <p className="border bg-muted px-3 py-2 text-sm font-semibold tabular-nums">
            {completedExercises}/{exercises.length} concluídos
          </p>
        </div>
        <Progress
          className="mt-5 h-2"
          value={(completedExercises / exercises.length) * 100}
        />
      </div>

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
