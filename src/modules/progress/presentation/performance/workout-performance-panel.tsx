"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { Skeletons } from "@/components/skeleton"
import { Button } from "@/components/ui/button"
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty"
import type { WorkoutSession } from "@/modules/sessions/domain/session"
import { useProgressUseCases } from "../progress-use-cases-context"
import { WorkoutPerformanceOverview } from "./workout-performance-overview"
import { WorkoutSessionCalendar } from "./workout-session-calendar"

export function WorkoutPerformancePanel() {
  const progressUseCases = useProgressUseCases()
  const [sessions, setSessions] = useState<WorkoutSession[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const load = useCallback(async () => {
    setLoading(true)
    try {
      setSessions(await progressUseCases.listPerformanceSessions())
      setError("")
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "Não foi possível carregar")
    } finally {
      setLoading(false)
    }
  }, [progressUseCases])

  useEffect(() => {
    void load()
  }, [load])

  const data = useMemo(
    () => progressUseCases.workoutPerformance(sessions),
    [progressUseCases, sessions]
  )

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">Desempenho dos treinos</h2>
        <p className="text-sm text-muted-foreground">
          Acompanhe a frequência, as séries e o volume dos seus treinos
        </p>
      </div>

      {loading ? (
        <Skeletons />
      ) : error ? (
        <div role="alert">
          <p className="text-destructive">{error} Tivemos um erro</p>
          <Button className="mt-2" onClick={() => void load()} variant="secondary">
            Tentar novamente
          </Button>
        </div>
      ) : !sessions.length ? (
        <Empty className="border">
          <EmptyHeader>
            <EmptyTitle>Nenhum treino registrado</EmptyTitle>
            <EmptyDescription>
              Conclua um treino para acompanhar seu desempenho
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="space-y-6">
          {data.sessions > 0 ? (
            <WorkoutPerformanceOverview data={data} />
          ) : (
            <Empty className="border">
              <EmptyHeader>
                <EmptyTitle>Nenhum treino concluído</EmptyTitle>
                <EmptyDescription>
                  Conclua um treino para visualizar os indicadores e o gráfico
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}
          <WorkoutSessionCalendar sessions={sessions} />
        </div>
      )}
    </div>
  )
}
