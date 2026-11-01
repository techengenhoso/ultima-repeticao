"use client"

import {
  CalendarCheckIcon,
  CalendarClockIcon,
  CalendarDaysIcon,
  CircleAlertIcon,
  ClipboardListIcon,
  DumbbellIcon,
  FlameIcon,
} from "lucide-react"
import Link from "next/link"
import { useCallback, useEffect, useMemo, useState } from "react"
import { PageHeader } from "@/components/page-header"
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
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty"
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
import type { WorkoutSession } from "@/modules/sessions/domain/session"
import { useSessionDraftStore } from "@/modules/sessions/presentation/session-draft-store-context"
import { useSessionGateway } from "@/modules/sessions/presentation/session-gateway-context"
import type { Workout } from "@/modules/workouts/domain/workout"
import { useWorkoutUseCases } from "@/modules/workouts/presentation/workout-use-cases-context"
import { NextWorkout } from "./next-workout"

type DashboardData = {
  ongoingSession: WorkoutSession | null
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

      <div className="grid auto-rows-fr gap-4 sm:grid-cols-2 lg:grid-cols-3">
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

      <div className="grid auto-rows-fr gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(({ icon: Icon, label, value }) => (
          <Card className="min-w-0" key={label}>
            <CardHeader className="flex-1 has-data-[slot=card-description]:grid-rows-[1fr_auto]">
              <CardDescription>{label}</CardDescription>
              <CardTitle className="min-w-0 text-2xl font-bold tracking-tight wrap-break-word sm:text-3xl">
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
            <Empty className="bg-muted/50">
              <EmptyHeader>
                <EmptyTitle>Nenhuma atividade registrada</EmptyTitle>
                <EmptyDescription>
                  Quando você concluir um treino, ele será exibido nesta área
                </EmptyDescription>
              </EmptyHeader>
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
  const sessionGateway = useSessionGateway()
  const draftStore = useSessionDraftStore()
  const [data, setData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const loadDashboard = useCallback(async () => {
    setIsLoading(true)
    setHasError(false)

    try {
      const draft = draftStore.current(user.uid)?.session
      const [sessions, workouts, ongoingSession] = await Promise.all([
        progressUseCases.listPerformanceSessions(),
        workoutUseCases.list(user.uid),
        draft?.userId === user.uid && draft.status === "inProgress"
          ? draft
          : sessionGateway.findInProgress(),
      ])
      if (
        ongoingSession &&
        (ongoingSession.userId !== user.uid || ongoingSession.status !== "inProgress")
      )
        throw new Error("Treino em andamento indisponível")

      setData({
        ongoingSession,
        summary: progressUseCases.dashboardSummary(sessions, workouts),
        workouts,
      })
    } catch {
      setHasError(true)
    } finally {
      setIsLoading(false)
    }
  }, [draftStore, progressUseCases, sessionGateway, user.uid, workoutUseCases])

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
          <NextWorkout ongoingSession={data.ongoingSession} workouts={data.workouts} />
          <SummaryCards summary={data.summary} />
          <RecentActivities summary={data.summary} />
        </>
      )}
    </div>
  )
}
