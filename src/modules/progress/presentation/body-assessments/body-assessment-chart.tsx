"use client"

import { ScaleIcon } from "lucide-react"
import { useState } from "react"
import { CartesianGrid, LabelList, Line, LineChart, XAxis, YAxis } from "recharts"
import { SelectField } from "@/components/select-field"
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
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty"
import type { BodyAssessment } from "@/modules/body-assessments/domain/body-assessment"
import { type Metric, metricHistory } from "@/modules/body-assessments/domain/calculations"
import {
  type AssessmentGroup,
  assessmentFields,
  fieldFor,
  metricLabel,
} from "@/modules/body-assessments/presentation/fields"

const choices: Metric[] = [
  { group: "bodyIndex", key: "weight" },
  { group: "bodyIndex", key: "bodyFatPercentage" },
  { group: "bodyIndex", key: "muscleMass" },
  { group: "bodyIndex", key: "leanBodyMass" },
  ...assessmentFields
    .filter(field => field.group !== "bodyIndex")
    .map(field => ({ group: field.group, key: field.key })),
]
const chartDate = (value: string) => {
  const [year, month, day] = value.split("-")
  return `${day}/${month}/${year?.slice(-2)}`
}
const fullDate = (value: string) =>
  new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium", timeZone: "UTC" })
    .format(new Date(`${value}T00:00:00Z`))
    .replaceAll(".", "")
export function BodyAssessmentChart({ assessments }: { assessments: BodyAssessment[] }) {
  const [selected, setSelected] = useState<Metric | null>(null)
  const data = selected ? metricHistory(assessments, selected).slice(-5) : []
  const field = selected ? fieldFor(selected.group, selected.key) : undefined
  const config = {
    value: { label: field?.label, color: "var(--chart-1)" },
  } satisfies ChartConfig
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gráfico corporal</CardTitle>
        <CardDescription>Escolha uma métrica para analisar</CardDescription>
        <CardAction className="col-span-full col-start-1 row-span-1 row-start-3 w-full sm:col-span-1 sm:col-start-2 sm:row-span-2 sm:row-start-1 sm:w-64">
          <SelectField
            aria-label="Métrica do gráfico"
            className="w-full"
            icon={<ScaleIcon aria-hidden="true" />}
            id="body-chart-metric"
            onChange={value => {
              if (!value) return setSelected(null)
              const [group, key] = value.split(".")
              setSelected({ group: group as AssessmentGroup, key })
            }}
            options={choices.map(metric => ({
              label: metricLabel(metric),
              value: `${metric.group}.${metric.key}`,
            }))}
            value={selected ? `${selected.group}.${selected.key}` : ""}
          />
        </CardAction>
      </CardHeader>
      <CardContent>
        {selected && data.length ? (
          <>
            <ChartContainer className="h-64 w-full" config={config}>
              <LineChart
                accessibilityLayer
                data={data}
                margin={{ bottom: 4, left: 4, right: 12, top: 28 }}
              >
                <CartesianGrid vertical={false} />
                <XAxis dataKey="date" minTickGap={16} tickFormatter={chartDate} />
                <YAxis width={48} />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={item =>
                        `${Number(item).toLocaleString("pt-BR")} ${field?.unit ?? ""}`
                      }
                      labelFormatter={label => fullDate(String(label))}
                    />
                  }
                />
                <Line
                  dataKey="value"
                  dot
                  name="value"
                  stroke="var(--color-value)"
                  type="monotone"
                >
                  <LabelList
                    dataKey="value"
                    fill="var(--color-value)"
                    formatter={item =>
                      `${Number(item).toLocaleString("pt-BR")} ${field?.unit ?? ""}`
                    }
                    position="top"
                  />
                </Line>
              </LineChart>
            </ChartContainer>
            <p className="sr-only">
              {field?.label}:{" "}
              {data
                .map(item => `${fullDate(item.date)} ${item.value} ${field?.unit ?? ""}`)
                .join(", ")}
            </p>
          </>
        ) : (
          <Empty className="border">
            <EmptyHeader>
              <EmptyTitle>
                {selected ? "Nenhum resultado encontrado" : "Selecione uma métrica"}
              </EmptyTitle>
              <EmptyDescription>
                {selected
                  ? "Não há valores cadastrados para a métrica selecionada"
                  : "Nenhuma métrica foi selecionada"}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </CardContent>
    </Card>
  )
}
