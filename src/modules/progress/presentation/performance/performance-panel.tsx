"use client"

import { useEffect, useMemo, useState } from "react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import type { WorkoutSession } from "@/modules/sessions/domain/session"
import { useProgressUseCases } from "../progress-use-cases-context"

export function PerformancePanel() {
  const progressUseCases = useProgressUseCases()
  const [sessions, setSessions] = useState<WorkoutSession[]>([])
  const [selected, setSelected] = useState("")
  const [error, setError] = useState("")
  useEffect(() => {
    void progressUseCases
      .listPerformanceSessions()
      .then(value => {
        setSessions(value)
        setSelected(progressUseCases.exerciseOptions(value)[0]?.key ?? "")
      })
      .catch(failure =>
        setError(failure instanceof Error ? failure.message : "Não foi possível carregar")
      )
  }, [progressUseCases])
  const options = useMemo(
    () => progressUseCases.exerciseOptions(sessions),
    [progressUseCases, sessions]
  )
  const data = useMemo(
    () => progressUseCases.performanceForExercise(sessions, selected),
    [progressUseCases, sessions, selected]
  )
  const config = {
    load: { label: "Carga", color: "var(--chart-1)" },
    volume: { label: "Volume externo", color: "var(--chart-2)" },
  } satisfies ChartConfig
  if (error)
    return (
      <p className="text-destructive" role="alert">
        {error}
      </p>
    )
  if (!options.length)
    return (
      <p className="text-sm text-muted-foreground">
        Nenhuma série de trabalho concluída encontrada
      </p>
    )
  return (
    <div className="space-y-6">
      {data.latest && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Metric label="Última carga" value={`${data.latest.load} kg`} />
          <Metric
            label="Melhor série"
            value={`${data.latest.best.load} kg × ${data.latest.best.performedRepetitions}`}
          />
          <Metric label="Maior carga" value={`${data.maxLoad} kg`} />
          <Metric label="Sessões concluídas" value={String(data.sessions)} />
        </div>
      )}
      <Card>
        <CardHeader>
          <CardTitle>Desempenho do exercício</CardTitle>
          <CardDescription>Acompanhe carga e volume nas séries concluídas</CardDescription>
          <CardAction className="col-span-full col-start-1 row-span-1 row-start-3 w-full sm:col-span-1 sm:col-start-2 sm:row-span-2 sm:row-start-1 sm:w-72">
            <select
              aria-label="Exercício"
              className="h-11 w-full border bg-background px-3 text-sm"
              onChange={event => setSelected(event.target.value)}
              value={selected}
            >
              {options.map(option => (
                <option key={option.key} value={option.key}>
                  {option.name} ·{" "}
                  {option.source === "custom" ? "Personalizado" : "Biblioteca"}
                </option>
              ))}
            </select>
          </CardAction>
        </CardHeader>
        <CardContent className="space-y-6">
          <ChartContainer className="h-72 w-full" config={config}>
            <LineChart accessibilityLayer data={data.rows}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickFormatter={value => new Date(value).toLocaleDateString("pt-BR")}
              />
              <YAxis />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={label =>
                      new Date(Number(label)).toLocaleDateString("pt-BR")
                    }
                  />
                }
              />
              <Line dataKey="load" dot stroke="var(--color-load)" />
              <Line dataKey="volume" dot stroke="var(--color-volume)" />
            </LineChart>
          </ChartContainer>
          <ul className="space-y-2">
            {data.rows.map(row => (
              <li className="border p-3 text-sm" key={row.date}>
                {new Date(row.date).toLocaleDateString("pt-BR")} · {row.target} · carga{" "}
                {row.load} kg · volume {row.volume.toLocaleString("pt-BR")} kg
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
function Metric({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-2xl tracking-normal normal-case">{value}</CardTitle>
      </CardHeader>
    </Card>
  )
}
