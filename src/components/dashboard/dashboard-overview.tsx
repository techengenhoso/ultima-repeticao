"use client"

import {
  ArrowRightIcon,
  CalendarCheckIcon,
  CalendarClockIcon,
  CalendarDaysIcon,
  CircleAlertIcon,
  ClipboardListIcon,
  DumbbellIcon,
  FlameIcon,
  ScaleIcon,
} from "lucide-react"
import Link from "next/link"
import { useCallback, useEffect, useMemo, useState } from "react"
import { PageHeader } from "@/components/page-header"
import { StartSessionButton } from "@/components/sessions/start-session-button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "@/components/ui/item"
import { Skeleton } from "@/components/ui/skeleton"
import { useUser } from "@/contexts/user-context"
import { muscleGroupLabel } from "@/modules/exercises/domain/exercise"
import type { DashboardSummary } from "@/modules/progress/domain/dashboard-summary"
import { useProgressUseCases } from "@/modules/progress/presentation/progress-use-cases-context"
import type { Workout } from "@/modules/workouts/domain/workout"
import { useWorkoutUseCases } from "@/modules/workouts/presentation/workout-use-cases-context"

type DashboardData = {
  summary: DashboardSummary
  workouts: Workout[]
}

const numberFormat = new Intl.NumberFormat("pt-BR")

function formatActivityDate(value: number) {
  const date = new Date(value)
  const weekday = new Intl.DateTimeFormat("pt-BR", { weekday: "short" })
    .format(date)
    .replace(".", "")
  const formattedDate = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
  })
    .format(date)
    .replace(".", "")

  return `${weekday.charAt(0).toLocaleUpperCase("pt-BR")}${weekday.slice(1)} · ${formattedDate}`
}

function sessionStatus(status: DashboardSummary["recentActivities"][number]["status"]) {
  return status === "completed" ? "Concluído" : "Cancelado"
}

function DashboardLoading() {
  return (
    <output aria-label="Carregando painel" className="block space-y-6">
      <Card>
        <CardContent className="flex items-center gap-4">
          <Skeleton className="size-14 rounded-2xl" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-7 w-3/5" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {["plans", "workouts", "completed", "month", "week", "streak"].map(item => (
          <Card key={item}>
            <CardContent className="space-y-3">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-4 w-4/5" />
            </CardContent>
          </Card>
        ))}
      </div>
    </output>
  )
}

function NextWorkout({ workouts }: { workouts: Workout[] }) {
  const activeWorkout = workouts.find(workout => workout.isActive)
  const nextDay = activeWorkout?.days.toSorted(
    (left, right) => left.order - right.order
  )[0]
  const muscleGroups = nextDay?.muscleGroups.map(group => muscleGroupLabel[group]) ?? []

  if (!activeWorkout || !nextDay)
    return (
      <Card>
        <CardContent className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <ClipboardListIcon aria-hidden="true" className="size-7" />
            </span>

            <div className="min-w-0">
              <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">
                Treino de hoje
              </p>
              <h2 className="mt-1 text-xl font-bold">Crie sua primeira ficha</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Organize seus dias e exercícios para começar a registrar sua rotina
              </p>
            </div>
          </div>

          <Button asChild className="w-full sm:w-auto" size="lg">
            <Link href="/workouts">
              Criar ficha
              <ArrowRightIcon aria-hidden="true" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    )

  return (
    <Card>
      <CardContent className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <DumbbellIcon aria-hidden="true" className="size-7" />
          </span>

          <div className="min-w-0">
            <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">
              Treino de hoje
            </p>
            <div className="mt-1 flex min-w-0 items-baseline gap-2">
              <h2 className="truncate text-xl font-bold">{nextDay.name}</h2>
              <span className="shrink-0 text-sm font-medium text-muted-foreground">
                {nextDay.exercises.length}{" "}
                {nextDay.exercises.length === 1 ? "exercício" : "exercícios"}
              </span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {activeWorkout.name}
              {muscleGroups.length ? ` · ${muscleGroups.join(", ")}` : ""}
            </p>
          </div>
        </div>

        <StartSessionButton
          className="w-full sm:w-auto"
          dayId={nextDay.id}
          planId={activeWorkout.id}
          size="lg"
        />
      </CardContent>
    </Card>
  )
}

function SummaryCards({ summary }: { summary: DashboardSummary }) {
  const cards = [
    {
      icon: FlameIcon,
      label: "Meta semanal",
      value: summary.weeklyGoal
        ? `${numberFormat.format(summary.weeklyGoal.completedSessions)} de ${numberFormat.format(summary.weeklyGoal.targetSessions)}`
        : 0,
    },
    {
      icon: ClipboardListIcon,
      label: "Fichas cadastradas",
      value: numberFormat.format(summary.registeredWorkoutPlans),
    },
    {
      icon: DumbbellIcon,
      label: "Treinos cadastrados",
      value: numberFormat.format(summary.registeredWorkoutDays),
    },
    {
      icon: CalendarCheckIcon,
      label: "Treinos concluídos",
      value: numberFormat.format(summary.completedSessions),
    },
    {
      icon: CalendarClockIcon,
      label: "Treinos neste mês",
      value: numberFormat.format(summary.completedSessionsThisMonth),
    },
    {
      icon: CalendarDaysIcon,
      label: "Treinos nesta semana",
      value: numberFormat.format(summary.completedSessionsThisWeek),
    },
  ]

  return (
    <section aria-labelledby="summary-title">
      <h2 className="sr-only" id="summary-title">
        Resumo dos treinos
      </h2>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {cards.map(({ icon: Icon, label, value }) => (
          <Card key={label}>
            <CardHeader>
              <CardDescription>{label}</CardDescription>
              <CardTitle className="text-2xl font-bold tracking-tight sm:text-3xl">
                {value}
              </CardTitle>
              <CardAction className="self-center">
                <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon aria-hidden="true" className="size-5" />
                </span>
              </CardAction>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  )
}

function RecentActivities({ summary }: { summary: DashboardSummary }) {
  return (
    <section aria-labelledby="recent-activities-title">
      <Card>
        <CardHeader>
          <CardTitle id="recent-activities-title">Atividades recentes</CardTitle>
          <CardDescription>Seus últimos treinos registrados</CardDescription>
        </CardHeader>

        <CardContent>
          {summary.recentActivities.length ? (
            <ItemGroup>
              {summary.recentActivities.map(session => {
                const date = session.completedAt ?? session.startedAt
                const completed = session.status === "completed"
                const muscleGroups = [
                  ...new Set(
                    session.exercises.map(
                      exercise => muscleGroupLabel[exercise.exerciseSnapshot.muscleGroup]
                    )
                  ),
                ]

                return (
                  <Item asChild key={session.id} variant="muted">
                    <Link href={`/history/sessions/${encodeURIComponent(session.id)}`}>
                      <ItemContent>
                        <ItemTitle>{session.workoutDayName}</ItemTitle>
                        <ItemDescription>
                          {session.workoutPlanName} · {formatActivityDate(date)}
                          <br />
                          {muscleGroups.join(", ")}
                        </ItemDescription>
                      </ItemContent>
                      <Badge variant={completed ? "default" : "secondary"}>
                        {sessionStatus(session.status)}
                      </Badge>
                    </Link>
                  </Item>
                )
              })}
            </ItemGroup>
          ) : (
            <Empty className="border-0 py-8">
              <EmptyMedia variant="icon">
                <ScaleIcon aria-hidden="true" />
              </EmptyMedia>
              <EmptyHeader>
                <EmptyTitle>Nenhuma atividade registrada</EmptyTitle>
                <EmptyDescription>
                  Quando você concluir um treino, ele será exibido nesta área
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button asChild variant="secondary">
                  <Link href="/workouts">Ver fichas</Link>
                </Button>
              </EmptyContent>
            </Empty>
          )}
        </CardContent>
      </Card>
    </section>
  )
}

export function DashboardOverview() {
  const { user } = useUser()
  const progressUseCases = useProgressUseCases()
  const workoutUseCases = useWorkoutUseCases()
  const [data, setData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const loadDashboard = useCallback(async () => {
    setIsLoading(true)
    setHasError(false)

    try {
      const [sessions, workouts] = await Promise.all([
        progressUseCases.listPerformanceSessions(),
        workoutUseCases.list(user.uid),
      ])
      setData({
        summary: progressUseCases.dashboardSummary(sessions, workouts),
        workouts,
      })
    } catch {
      setHasError(true)
    } finally {
      setIsLoading(false)
    }
  }, [progressUseCases, user.uid, workoutUseCases])

  useEffect(() => {
    void loadDashboard()
  }, [loadDashboard])

  const title = useMemo(
    () => `Olá, ${user.displayName?.trim() || "Usuário"}`,
    [user.displayName]
  )

  return (
    <div className="space-y-6 sm:space-y-8">
      <PageHeader
        description="Acompanhe sua rotina e mantenha o foco no próximo treino"
        title={title}
      />

      {isLoading && <DashboardLoading />}

      {!isLoading && hasError && (
        <Alert variant="destructive">
          <CircleAlertIcon aria-hidden="true" />
          <AlertTitle>Não foi possível carregar seu painel</AlertTitle>
          <AlertDescription>Verifique sua conexão e tente novamente</AlertDescription>
          <Button onClick={() => void loadDashboard()} size="sm" variant="outline">
            Tentar novamente
          </Button>
        </Alert>
      )}

      {!isLoading && !hasError && data && (
        <>
          <NextWorkout workouts={data.workouts} />
          <SummaryCards summary={data.summary} />
          <RecentActivities summary={data.summary} />
        </>
      )}
    </div>
  )
}
