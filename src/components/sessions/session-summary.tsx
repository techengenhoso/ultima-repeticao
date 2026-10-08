"use client"

import { CheckIcon, CircleAlertIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import {
  effortRatingLabel,
  type IncrementSettings,
  type LoadSuggestion,
  type WorkoutSession,
} from "@/modules/sessions/domain/session"
import { useSessionGateway } from "@/modules/sessions/presentation/session-gateway-context"
import { SessionProgression } from "./session-progression"

type SuggestionResult = {
  latestSessionId: string | null
  suggestion: LoadSuggestion
}

const defaultIncrementSettings: IncrementSettings = {
  percentage: 2.5,
  roundingStep: 0.5,
}

export function SessionSummary({
  session,
  onUpdated,
}: {
  session: WorkoutSession
  onUpdated: (session: WorkoutSession) => void
}) {
  const gateway = useSessionGateway()
  const [selected, setSelected] = useState<number | null>(null)
  const [prefetchedSuggestions, setPrefetchedSuggestions] = useState<
    Record<number, SuggestionResult>
  >({})
  const [prefetching, setPrefetching] = useState(false)
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

  useEffect(() => {
    const exercises = session.exercises
      .map((exercise, index) => ({ exercise, index }))
      .filter(
        ({ exercise }) =>
          isCompleted &&
          !exercise.decision &&
          exercise.sets.filter(set => set.completed && !set.warmup).length ===
            exercise.targetSets
      )
    let current = true
    setPrefetchedSuggestions({})
    setPrefetching(exercises.length > 0)

    void Promise.all(
      exercises.map(async ({ exercise, index }) => {
        try {
          const result = await gateway.suggest({
            action: "suggest",
            id: session.id,
            exerciseIndex: index,
            settings: exercise.incrementSettings ?? defaultIncrementSettings,
          })
          return [index, result] as const
        } catch {
          return null
        }
      })
    ).then(results => {
      if (!current) return
      setPrefetchedSuggestions(
        Object.fromEntries(
          results.filter(
            (result): result is readonly [number, SuggestionResult] => result !== null
          )
        )
      )
      setPrefetching(false)
    })

    return () => {
      current = false
    }
  }, [gateway, isCompleted, session])

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardDescription className="text-xs font-semibold tracking-[0.16em] uppercase">
            {isCompleted ? "Treino concluído" : "Treino cancelado"}
          </CardDescription>

          <CardTitle className="mt-1 text-xl" id="session-summary-title">
            {isCompleted
              ? "Seu desempenho foi registrado"
              : "Treino encerrado antes da conclusão"}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-5">
          <Progress className="h-2" value={(completedSets / plannedSets) * 100} />

          <ItemGroup className="grid gap-3 sm:grid-cols-2">
            <Item variant="muted">
              <ItemContent>
                <ItemDescription>Exercícios concluídos</ItemDescription>

                <ItemTitle className="mt-1 text-lg tabular-nums">
                  {completedExercises} de {session.exercises.length}
                </ItemTitle>
              </ItemContent>
            </Item>

            <Item variant="muted">
              <ItemContent>
                <ItemDescription>Séries de trabalho</ItemDescription>

                <ItemTitle className="mt-1 text-lg tabular-nums">
                  {completedSets} de {plannedSets}
                </ItemTitle>
              </ItemContent>
            </Item>
          </ItemGroup>
        </CardContent>
      </Card>

      {session.exercises.map((exercise, index) => {
        const completed = exercise.sets.filter(set => set.completed && !set.warmup).length
        const isExerciseCompleted = completed === exercise.targetSets

        return (
          <Card
            key={`${exercise.exerciseReference.source}:${exercise.exerciseReference.exerciseId}:${index}`}
          >
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                <CardDescription className="text-xs font-semibold tracking-[0.16em] uppercase">
                  Exercício {String(index + 1).padStart(2, "0")}
                </CardDescription>

                <Badge variant={isExerciseCompleted ? "default" : "secondary"}>
                  {isExerciseCompleted ? "Concluído" : "Incompleto"}
                </Badge>
              </div>

              <CardTitle className="mt-1 wrap-break-word text-lg">
                {exercise.exerciseSnapshot.name}
              </CardTitle>

              <CardDescription className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="font-medium text-foreground">
                  {completed} de {exercise.targetSets} séries concluídas
                </span>

                <span>
                  {exercise.targetSets} séries de {exercise.targetRepetitions} repetições
                </span>
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <Progress
                className="h-1.5"
                value={(completed / exercise.targetSets) * 100}
              />

              <ItemGroup aria-label={`Séries de ${exercise.exerciseSnapshot.name}`}>
                {exercise.sets.map(set => (
                  <Item key={set.setNumber} variant="muted">
                    <ItemMedia variant="icon">
                      {set.completed ? (
                        <CheckIcon aria-hidden="true" className="text-primary" />
                      ) : (
                        <CircleAlertIcon
                          aria-hidden="true"
                          className="text-muted-foreground"
                        />
                      )}
                    </ItemMedia>

                    <ItemContent className="flex-row flex-wrap items-center gap-x-3 gap-y-1">
                      <ItemTitle>
                        Série {set.setNumber}
                        {set.warmup ? " · Aquecimento" : ""}
                      </ItemTitle>

                      <ItemDescription className="w-fit">
                        {set.completed
                          ? `${set.load} kg × ${set.performedRepetitions} repetições · ${set.effortRating ? effortRatingLabel[set.effortRating] : "Não avaliada"}`
                          : "Não concluída"}
                      </ItemDescription>
                    </ItemContent>
                  </Item>
                ))}
              </ItemGroup>

              {isCompleted && isExerciseCompleted && (
                <div className="flex">
                  {prefetching && !prefetchedSuggestions[index] && !exercise.decision ? (
                    <Skeleton className="h-8 w-full sm:ml-auto sm:w-28" />
                  ) : (
                    <Button
                      className="w-full sm:ml-auto sm:w-auto"
                      onClick={() => setSelected(index)}
                      size="sm"
                      type="button"
                    >
                      {exercise.decision ? "Ver evolução" : "Evoluir série"}
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}

      <Dialog onOpenChange={open => !open && setSelected(null)} open={selected !== null}>
        <DialogContent className="grid max-h-[calc(100dvh-2rem)] grid-rows-[auto_minmax(0,1fr)] sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Progressão do exercício</DialogTitle>

            <DialogDescription>
              {selectedExercise?.exerciseSnapshot.name}
            </DialogDescription>
          </DialogHeader>

          {selectedExercise && selected !== null && (
            <ScrollArea className="min-h-0 overscroll-contain [&_[data-slot=scroll-area-viewport]]:max-h-[inherit]">
              <SessionProgression
                index={selected}
                onClose={() => setSelected(null)}
                onUpdated={onUpdated}
                prefetchedSuggestion={prefetchedSuggestions[selected]}
                session={session}
              />
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
