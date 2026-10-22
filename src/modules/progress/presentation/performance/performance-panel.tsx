"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { Skeletons } from "@/components/skeleton"
import { Button } from "@/components/ui/button"
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty"
import type { WorkoutSession } from "@/modules/sessions/domain/session"
import { useSessionGateway } from "@/modules/sessions/presentation/session-gateway-context"
import { useProgressUseCases } from "../progress-use-cases-context"
import { PerformanceChart } from "./performance-chart"
import { PerformanceExerciseSelector } from "./performance-exercise-selector"
import { PerformanceHistory } from "./performance-history"
import { PerformanceIndicators } from "./performance-indicators"
import type { PerformanceData } from "./performance-types"
import { ProgressionHistory } from "./progression-history"

export function PerformancePanel() {
  const progressUseCases = useProgressUseCases()
  const sessionGateway = useSessionGateway()
  const [sessions, setSessions] = useState<WorkoutSession[]>([])
  const [selected, setSelected] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const items = await progressUseCases.listPerformanceSessions()
      setSessions(items)
      setSelected("")
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
  const options = useMemo(
    () => progressUseCases.exerciseOptions(sessions),
    [progressUseCases, sessions]
  )
  const data = useMemo(
    () => progressUseCases.performanceForExercise(sessions, selected),
    [progressUseCases, sessions, selected]
  )

  async function removeProgression(item: PerformanceData["rows"][number]) {
    const session = await sessionGateway.mutate({
      action: "removeDecision",
      id: item.sessionId,
      version: item.sessionVersion,
      exerciseIndex: item.exerciseIndex,
    })
    setSessions(current => current.map(item => (item.id === session.id ? session : item)))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold">Desempenho dos exercícios</h2>
          <p className="text-sm text-muted-foreground">
            Analise as séries concluídas e as evoluções registradas
          </p>
        </div>

        {!loading && !error && options.length > 0 && (
          <PerformanceExerciseSelector
            onSelect={setSelected}
            options={options}
            selected={selected}
          />
        )}
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
      ) : !options.length ? (
        <Empty className="border">
          <EmptyHeader>
            <EmptyTitle>Nenhum exercício registrado</EmptyTitle>

            <EmptyDescription>
              Conclua um exercício para acompanhar seu desempenho
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : !selected ? (
        <Empty className="border">
          <EmptyHeader>
            <EmptyTitle>Selecione um exercício</EmptyTitle>
            <EmptyDescription>
              Escolha um exercício para visualizar suas execuções
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <>
          {data.latest && <PerformanceIndicators data={data} />}
          {data.rows.length > 0 && <PerformanceChart data={data} />}
          {data.rows.length > 0 && (
            <PerformanceHistory items={data.rows} key={`${selected}-performance`} />
          )}
          {data.rows.length > 0 && (
            <ProgressionHistory
              items={data.rows}
              key={`${selected}-progression`}
              onRemove={removeProgression}
            />
          )}
        </>
      )}
    </div>
  )
}
