"use client"

import { useState } from "react"
import { Area, AreaChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { WorkoutPerformanceData } from "./performance-types"

type WorkoutPerformanceMetric = "sets" | "volume"

const metrics: Record<WorkoutPerformanceMetric, { description: string; label: string }> = {
  sets: {
    description: "Séries de trabalho concluídas em cada treino",
    label: "Séries concluídas",
  },
  volume: {
    description: "Soma de carga e repetições concluídas em cada treino",
    label: "Volume externo",
  },
}

const formatSessionDate = (value: number) =>
  new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  }).format(new Date(value))

const formatTooltipDate = (value: number) =>
  new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "medium",
    timeStyle: "short",
  })
    .format(new Date(value))
    .replaceAll(".", "")
    .replace(", ", " às ")

const formatMetricValue = (metric: WorkoutPerformanceMetric, value: number | string) =>
  metric === "volume"
    ? `${Number(value).toLocaleString("pt-BR")} kg`
    : `${Number(value).toLocaleString("pt-BR")} séries`

export function WorkoutPerformanceChart({ data }: { data: WorkoutPerformanceData }) {
  const [metric, setMetric] = useState<WorkoutPerformanceMetric>("sets")
  const metricInfo = metrics[metric]
  const chartData = data.rows.slice(-5).map(row => ({
    date: formatSessionDate(row.date),
    sessionId: row.id,
    timestamp: row.date,
    value: row[metric],
  }))
  const dateBySessionId = new Map(chartData.map(item => [item.sessionId, item.date]))
  const config = {
    value: { label: metricInfo.label, color: "var(--chart-1)" },
  } satisfies ChartConfig

  return (
    <Card>
      <CardHeader>
        <CardTitle>Evolução dos treinos</CardTitle>
        <CardDescription className="col-span-full col-start-1 row-start-2 sm:col-span-1">
          {metricInfo.description}
        </CardDescription>
        <CardAction className="col-span-full col-start-1 row-span-1 row-start-3 w-full sm:col-span-1 sm:col-start-2 sm:row-span-2 sm:row-start-1 sm:w-auto">
          <Tabs
            className="w-full sm:w-auto"
            onValueChange={value => {
              if (value === "sets" || value === "volume") setMetric(value)
            }}
            value={metric}
          >
            <TabsList aria-label="Métrica do gráfico" className="w-full sm:w-fit">
              <TabsTrigger className="flex-1 sm:flex-none" value="sets">
                Séries
              </TabsTrigger>
              <TabsTrigger className="flex-1 sm:flex-none" value="volume">
                Volume externo
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardAction>
      </CardHeader>

      <CardContent>
        <ChartContainer className="h-72 w-full sm:h-80" config={config}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{ bottom: 4, left: 4, right: 12, top: 28 }}
          >
            <defs>
              <linearGradient
                id="workout-performance-chart-fill"
                x1="0"
                x2="0"
                y1="0"
                y2="1"
              >
                <stop offset="0%" stopColor="var(--color-value)" stopOpacity={0.35} />
                <stop offset="100%" stopColor="var(--color-value)" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              axisLine={false}
              dataKey="sessionId"
              minTickGap={16}
              tickFormatter={value => dateBySessionId.get(String(value)) ?? ""}
              tickLine={false}
              tickMargin={10}
            />
            <YAxis axisLine={false} tickLine={false} tickMargin={8} width={48} />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={item => formatMetricValue(metric, Number(item))}
                  labelFormatter={(_, payload) => {
                    const timestamp = payload[0]?.payload?.timestamp
                    return typeof timestamp === "number"
                      ? formatTooltipDate(timestamp)
                      : ""
                  }}
                />
              }
              cursor={{ stroke: "var(--color-value)", strokeDasharray: "3 3" }}
            />
            <Area
              activeDot={{
                fill: "var(--background)",
                r: 5,
                stroke: "var(--color-value)",
                strokeWidth: 3,
              }}
              dataKey="value"
              dot={{
                fill: "var(--color-value)",
                r: 3,
                stroke: "var(--background)",
                strokeWidth: 2,
              }}
              fill="url(#workout-performance-chart-fill)"
              name="value"
              stroke="var(--color-value)"
              strokeWidth={2}
              type="monotone"
            >
              <LabelList
                content={({ value, x, y }) => {
                  if (value === undefined || x === undefined || y === undefined)
                    return null

                  return (
                    <text
                      fill="var(--color-value)"
                      textAnchor="middle"
                      x={x}
                      y={typeof y === "number" ? y - 8 : y}
                    >
                      {formatMetricValue(metric, Number(value))}
                    </text>
                  )
                }}
                dataKey="value"
                position="top"
              />
            </Area>
          </AreaChart>
        </ChartContainer>
        <p className="sr-only">
          {metricInfo.label}:{" "}
          {chartData
            .map(item => `${item.date} ${formatMetricValue(metric, item.value)}`)
            .join(", ")}
        </p>
      </CardContent>
    </Card>
  )
}
