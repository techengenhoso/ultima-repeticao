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
import type { PerformanceData } from "./performance-types"

type PerformanceMetric = "load" | "volume"

const metrics: Record<PerformanceMetric, { description: string; label: string }> = {
  load: {
    description: "Maior carga registrada em cada execução",
    label: "Maior carga",
  },
  volume: {
    description: "Soma de carga e repetições concluídas em cada execução",
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

export function PerformanceChart({ data }: { data: PerformanceData }) {
  const [metric, setMetric] = useState<PerformanceMetric>("load")
  const metricInfo = metrics[metric]
  const chartData = data.rows.slice(-5).map((row, index) => ({
    date: formatSessionDate(row.date),
    executionId: `${row.sessionId}-${index}`,
    timestamp: row.date,
    value: row[metric],
  }))
  const dateByExecutionId = new Map(chartData.map(item => [item.executionId, item.date]))
  const formatMetricValue = (value: number | string) =>
    `${Number(value).toLocaleString("pt-BR")} kg`
  const config = {
    value: { label: metricInfo.label, color: "var(--chart-1)" },
  } satisfies ChartConfig

  return (
    <Card>
      <CardHeader>
        <CardTitle>Evolução do exercício</CardTitle>
        <CardDescription>{metricInfo.description}</CardDescription>
        <CardAction className="col-span-full col-start-1 row-span-1 row-start-3 w-full sm:col-span-1 sm:col-start-2 sm:row-span-2 sm:row-start-1 sm:w-auto">
          <Tabs
            onValueChange={value => {
              if (value === "load" || value === "volume") setMetric(value)
            }}
            value={metric}
          >
            <TabsList aria-label="Métrica do gráfico">
              <TabsTrigger value="load">Carga</TabsTrigger>
              <TabsTrigger value="volume">Volume externo</TabsTrigger>
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
              <linearGradient id="performance-chart-fill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="var(--color-value)" stopOpacity={0.35} />
                <stop offset="100%" stopColor="var(--color-value)" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              axisLine={false}
              dataKey="executionId"
              minTickGap={16}
              tickFormatter={value => dateByExecutionId.get(String(value)) ?? ""}
              tickLine={false}
              tickMargin={10}
            />
            <YAxis axisLine={false} tickLine={false} tickMargin={8} width={48} />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={item => formatMetricValue(Number(item))}
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
              fill="url(#performance-chart-fill)"
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
                      {formatMetricValue(Number(value))}
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
            .map(item => `${item.date} ${formatMetricValue(item.value)}`)
            .join(", ")}
        </p>
      </CardContent>
    </Card>
  )
}
