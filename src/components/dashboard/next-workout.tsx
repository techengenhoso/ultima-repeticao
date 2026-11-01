"use client"

import { ArrowRightIcon, ClipboardListIcon, DumbbellIcon } from "lucide-react"
import Link from "next/link"
import type { ReactNode } from "react"
import { StartSessionButton } from "@/components/sessions/start-session-button"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { muscleGroupLabel } from "@/modules/exercises/domain/exercise"
import type { WorkoutSession } from "@/modules/sessions/domain/session"
import type { Workout } from "@/modules/workouts/domain/workout"

function WorkoutCallout({
  action,
  description,
  emphasized = false,
  exerciseCount,
  label = "Treino de hoje",
  title,
}: {
  action: ReactNode
  description: string
  emphasized?: boolean
  exerciseCount?: number
  label?: string
  title: string
}) {
  const Icon = emphasized ? DumbbellIcon : ClipboardListIcon

  return (
    <Card>
      <CardContent className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <span
            className={`flex size-14 shrink-0 items-center justify-center rounded-2xl ${emphasized ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"}`}
          >
            <Icon aria-hidden="true" className="size-7" />
          </span>

          <div className="min-w-0">
            <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">
              {label}
            </p>
            <div className="mt-1 flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-1">
              <h2 className="min-w-0 text-xl font-bold wrap-break-word">{title}</h2>
              {exerciseCount !== undefined && (
                <span className="shrink-0 text-sm font-medium text-muted-foreground">
                  {exerciseCount} {exerciseCount === 1 ? "exercício" : "exercícios"}
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-muted-foreground wrap-break-word">
              {description}
            </p>
          </div>
        </div>

        {action}
      </CardContent>
    </Card>
  )
}

export function NextWorkout({
  ongoingSession,
  workouts,
}: {
  ongoingSession: WorkoutSession | null
  workouts: Workout[]
}) {
  if (ongoingSession)
    return (
      <WorkoutCallout
        action={
          <Button asChild className="w-full sm:w-auto" size="lg">
            <Link href={`/workouts/sessions/${encodeURIComponent(ongoingSession.id)}`}>
              Retornar ao treino
              <ArrowRightIcon aria-hidden="true" />
            </Link>
          </Button>
        }
        description={ongoingSession.workoutPlanName}
        emphasized
        label="Treino em andamento"
        title={ongoingSession.workoutDayName}
      />
    )

  const activeWorkout = workouts.find(workout => workout.isActive)
  const nextDay = activeWorkout?.days.toSorted(
    (left, right) => left.order - right.order
  )[0]

  if (!activeWorkout || !nextDay) {
    const hasWorkouts = workouts.length > 0
    return (
      <WorkoutCallout
        action={
          <Button asChild className="w-full sm:w-auto" size="lg">
            <Link href="/workouts">
              {hasWorkouts ? "Ir para treinos" : "Criar ficha"}
              <ArrowRightIcon aria-hidden="true" />
            </Link>
          </Button>
        }
        description={
          hasWorkouts
            ? "Escolha uma das suas fichas em Treinos e defina como ativa para começar"
            : "Organize seus dias e exercícios para começar a registrar sua rotina"
        }
        title={hasWorkouts ? "Ative uma ficha" : "Crie sua primeira ficha"}
      />
    )
  }

  const muscleGroups = nextDay.muscleGroups.map(group => muscleGroupLabel[group])

  return (
    <WorkoutCallout
      action={
        <StartSessionButton
          className="w-full sm:w-auto"
          dayId={nextDay.id}
          planId={activeWorkout.id}
          size="lg"
        />
      }
      description={`${activeWorkout.name}${muscleGroups.length ? ` · ${muscleGroups.join(", ")}` : ""}`}
      emphasized
      exerciseCount={nextDay.exercises.length}
      title={nextDay.name}
    />
  )
}
