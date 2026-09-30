import { InfoIcon } from "lucide-react"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import type { PerformanceData } from "./performance-types"

const formatDate = (value: number) =>
  new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value))

export function PerformanceIndicators({ data }: { data: PerformanceData }) {
  if (!data.latest || !data.best) return null

  const indicators = [
    {
      description: "Data mais recente em que você concluiu este exercício",
      label: "Última execução",
      value: formatDate(data.latest.date),
    },
    {
      description: "Série com a maior carga. Em empate, vence a que teve mais repetições",
      label: "Melhor série",
      value: `${data.best.load} kg × ${data.best.performedRepetitions}`,
    },
    {
      description: "Maior total de carga movimentada em uma execução deste exercício",
      label: "Maior volume",
      value: `${data.maxVolume.toLocaleString("pt-BR")} kg`,
    },
    {
      description: "Quantidade de treinos concluídos que tiveram este exercício",
      label: "Execuções",
      value: String(data.sessions),
    },
  ]

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {indicators.map(indicator => (
        <Card className="gap-2 py-5" key={indicator.label}>
          <CardHeader>
            <div className="flex items-center gap-1">
              <CardDescription>{indicator.label}</CardDescription>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    aria-label={`Entenda ${indicator.label.toLocaleLowerCase("pt-BR")}`}
                    className="rounded-sm text-muted-foreground outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                    type="button"
                  >
                    <InfoIcon aria-hidden="true" className="size-3.5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="max-w-56">
                  {indicator.description}
                </TooltipContent>
              </Tooltip>
            </div>

            <CardTitle className="text-2xl tracking-normal normal-case">
              {indicator.value}
            </CardTitle>
          </CardHeader>
        </Card>
      ))}
    </div>
  )
}
