import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { BodyAssessment } from "@/modules/body-assessments/domain/body-assessment"
import {
  comparison,
  type Metric,
  sortAssessments,
} from "@/modules/body-assessments/domain/calculations"
import { metricLabel } from "@/modules/body-assessments/presentation/fields"

const metrics: Metric[] = [
  { group: "bodyIndex", key: "weight" },
  { group: "bodyIndex", key: "bodyFatPercentage" },
  { group: "bodyIndex", key: "muscleRatePercentage" },
]
export function BodyAssessmentIndicators({
  assessments,
}: {
  assessments: BodyAssessment[]
}) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {metrics.flatMap(metric => {
        const latest = sortAssessments(assessments).find(
          item => typeof item[metric.group][metric.key as never] === "number"
        )
        const current: unknown = latest?.[metric.group][metric.key as never]
        if (typeof current !== "number") return []
        const change = comparison(assessments, metric)
        return (
          <Card className="gap-2 py-5" key={metric.key}>
            <CardHeader>
              <CardDescription>{metricLabel(metric)}</CardDescription>
              <CardTitle className="text-2xl tracking-normal normal-case">
                {current.toLocaleString("pt-BR")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                {change ? (
                  <>
                    {change.difference > 0 ? "+" : ""}
                    {change.difference.toLocaleString("pt-BR")} desde a avaliação anterior
                  </>
                ) : (
                  "Sem avaliação anterior para comparar"
                )}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
