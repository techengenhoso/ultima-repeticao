import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { WorkoutPerformanceData } from "./performance-types"

export function WorkoutPerformanceIndicators({ data }: { data: WorkoutPerformanceData }) {
  const summary = data.lastThirtyDays
  const indicators = [
    {
      label: "Treinos concluídos",
      value: String(summary.completedSessions),
    },
    {
      label: "Treinos cancelados",
      value: String(summary.cancelledSessions),
    },
    {
      label: "Exercícios diferentes",
      value: String(summary.exercises),
    },
    {
      label: "Séries concluídas",
      value: String(summary.sets),
    },
    {
      label: "Repetições concluídas",
      value: String(summary.repetitions),
    },
    {
      label: "Volume movimentado",
      value: `${summary.volume.toLocaleString("pt-BR")} kg`,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumo dos últimos 30 dias</CardTitle>
        <CardDescription>
          Acompanhe os resultados dos seus treinos recentes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {indicators.map(indicator => (
            <div className="rounded-2xl bg-muted/60 p-4" key={indicator.label}>
              <dt className="text-sm text-muted-foreground">{indicator.label}</dt>
              <dd className="mt-1 text-2xl font-semibold tracking-tight">
                {indicator.value}
              </dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  )
}
