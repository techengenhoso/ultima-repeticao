"use client"

import { CheckIcon, CircleAlertIcon, TrendingUpIcon } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import type { WorkoutSession } from "@/modules/sessions/domain/session"
import { SessionProgression } from "./session-progression"

export function SessionSummary({
  session,
  onUpdated,
}: {
  session: WorkoutSession
  onUpdated: (session: WorkoutSession) => void
}) {
  const [selected, setSelected] = useState<number | null>(null)
  const completedSets = session.exercises
    .flatMap(exercise => exercise.sets)
    .filter(set => set.completed && !set.warmup).length
  const plannedSets = session.exercises.reduce(
    (total, exercise) => total + exercise.targetSets,
    0
  )
  const completedExercises = session.exercises.filter(
    exercise =>
      exercise.sets.filter(set => !set.warmup && set.completed).length ===
      exercise.targetSets
  ).length
  const isCompleted = session.status === "completed"
  const selectedExercise = selected === null ? null : session.exercises[selected]

  return (
    <div className="space-y-5">
      <section
        aria-labelledby="session-summary-title"
        className="border bg-card p-4 sm:p-5"
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">
              {isCompleted ? "Treino concluído" : "Treino cancelado"}
            </p>
            <h2 className="mt-1 text-xl font-semibold" id="session-summary-title">
              {isCompleted
                ? "Seu desempenho foi registrado"
                : "Treino encerrado antes da conclusão"}
            </h2>
          </div>
          <p className="border bg-muted px-4 py-3 text-base font-semibold tabular-nums">
            {completedSets}/{plannedSets} séries
          </p>
        </div>
        <Progress className="mt-5 h-2" value={(completedSets / plannedSets) * 100} />
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="border bg-muted/30 p-3">
            <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Exercícios concluídos
            </p>
            <p className="mt-1 text-lg font-semibold tabular-nums">
              {completedExercises} de {session.exercises.length}
            </p>
          </div>
          <div className="border bg-muted/30 p-3">
            <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Séries de trabalho
            </p>
            <p className="mt-1 text-lg font-semibold tabular-nums">
              {completedSets} de {plannedSets}
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="session-exercises-title" className="space-y-3">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <p className="text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">
              Desempenho por exercício
            </p>
            <h2 className="mt-1 text-lg font-semibold" id="session-exercises-title">
              Séries registradas
            </h2>
          </div>
          <p className="text-xs text-muted-foreground">
            {session.exercises.length}{" "}
            {session.exercises.length === 1 ? "exercício" : "exercícios"}
          </p>
        </div>
        <div className="space-y-3">
          {session.exercises.map((exercise, index) => {
            const completed = exercise.sets.filter(
              set => set.completed && !set.warmup
            ).length
            const isExerciseCompleted = completed === exercise.targetSets

            return (
              <section
                className="min-w-0 space-y-4 border bg-card p-4 sm:p-5"
                key={`${exercise.exerciseReference.source}:${exercise.exerciseReference.exerciseId}:${index}`}
              >
                <header>
                  <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                    <p className="text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                      Exercício {String(index + 1).padStart(2, "0")}
                    </p>
                    <p
                      className={`text-xs font-semibold tracking-wider uppercase ${
                        isExerciseCompleted ? "text-primary" : "text-muted-foreground"
                      }`}
                    >
                      {isExerciseCompleted ? "Concluído" : "Incompleto"}
                    </p>
                  </div>
                  <h3 className="mt-1 wrap-break-word text-lg font-semibold">
                    {exercise.exerciseSnapshot.name}
                  </h3>
                  <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">
                      {completed} de {exercise.targetSets} séries concluídas
                    </span>
                    <span>
                      {exercise.targetSets} séries de {exercise.targetRepetitions}{" "}
                      repetições
                    </span>
                    {exercise.targetRir !== undefined && (
                      <span>RIR alvo {exercise.targetRir}</span>
                    )}
                  </div>
                </header>
                <Progress
                  className="h-1.5"
                  value={(completed / exercise.targetSets) * 100}
                />
                <ol
                  aria-label={`Séries de ${exercise.exerciseSnapshot.name}`}
                  className="divide-y border-y"
                >
                  {exercise.sets.map(set => (
                    <li
                      className="flex min-w-0 items-center gap-3 py-3 text-sm"
                      key={set.setNumber}
                    >
                      {set.completed ? (
                        <CheckIcon
                          aria-hidden="true"
                          className="size-4 shrink-0 text-primary"
                        />
                      ) : (
                        <CircleAlertIcon
                          aria-hidden="true"
                          className="size-4 shrink-0 text-muted-foreground"
                        />
                      )}
                      <span className="shrink-0 font-medium">
                        Série {set.setNumber}
                        {set.warmup ? " · Aquecimento" : ""}
                      </span>
                      <span className="min-w-0 text-muted-foreground sm:ml-auto sm:text-right">
                        {set.completed
                          ? `${set.load} kg × ${set.performedRepetitions} repetições · RIR ${set.perceivedRir ?? "não informado"}`
                          : "Não concluída"}
                      </span>
                    </li>
                  ))}
                </ol>
                {exercise.painReported && (
                  <p className="border-l-2 border-destructive bg-destructive/10 px-3 py-2 text-sm text-destructive">
                    Dor relatada · Progressão bloqueada
                  </p>
                )}
                {exercise.decision && (
                  <p className="border bg-muted/30 px-3 py-2 text-sm">
                    Próxima carga escolhida: {exercise.decision.load} kg ·{" "}
                    {new Date(exercise.decision.decidedAt).toLocaleString("pt-BR")}
                  </p>
                )}
                {isCompleted && isExerciseCompleted && (
                  <div className="flex">
                    <Button
                      className="w-full sm:ml-auto sm:w-auto"
                      onClick={() => setSelected(index)}
                      size="sm"
                      type="button"
                      variant="default"
                    >
                      <TrendingUpIcon aria-hidden="true" />
                      Ver evolução e carga
                    </Button>
                  </div>
                )}
              </section>
            )
          })}
        </div>
      </section>
      <Dialog onOpenChange={open => !open && setSelected(null)} open={selected !== null}>
        <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-2xl">
          <DialogHeader className="pr-12">
            <DialogTitle>Evolução e próxima carga</DialogTitle>
            <DialogDescription>
              {selectedExercise?.exerciseSnapshot.name}
            </DialogDescription>
          </DialogHeader>
          {selectedExercise && selected !== null && (
            <SessionProgression index={selected} onUpdated={onUpdated} session={session} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
