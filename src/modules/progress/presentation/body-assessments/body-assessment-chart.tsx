"use client"

import { Combobox as ComboboxPrimitive } from "@base-ui/react"
import { ScaleIcon } from "lucide-react"
import { useState } from "react"
import { CartesianGrid, LabelList, Line, LineChart, XAxis, YAxis } from "recharts"
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
import {
  Combobox,
  ComboboxClear,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxTrigger,
  useComboboxAnchor,
} from "@/components/ui/combobox"
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import type { BodyAssessment } from "@/modules/body-assessments/domain/body-assessment"
import { type Metric, metricHistory } from "@/modules/body-assessments/domain/calculations"
import {
  type AssessmentGroup,
  assessmentFields,
  fieldFor,
  groups,
} from "@/modules/body-assessments/presentation/fields"

type MetricChoice = Metric & { label: string; value: string }

const metricGroups = groups.map(group => ({
  ...group,
  items: assessmentFields
    .filter(field => field.group === group.key)
    .map<MetricChoice>(field => ({
      group: field.group,
      key: field.key,
      label: field.label,
      value: `${field.group}.${field.key}`,
    }))
    .sort((first, second) => first.label.localeCompare(second.label, "pt-BR")),
}))

const metricChoices = metricGroups.flatMap(group => group.items)

const chartDate = (value: string) => {
  const [, month, day] = value.split("-")
  return `${day}/${month}`
}

const fullDate = (value: string) =>
  new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium", timeZone: "UTC" })
    .format(new Date(`${value}T00:00:00Z`))
    .replaceAll(".", "")

export function BodyAssessmentChart({ assessments }: { assessments: BodyAssessment[] }) {
  const [selected, setSelected] = useState<Metric | null>(null)
  const anchor = useComboboxAnchor()
  const data = selected ? metricHistory(assessments, selected).slice(-5) : []
  const field = selected ? fieldFor(selected.group, selected.key) : undefined
  const selectedChoice = selected
    ? metricChoices.find(
        choice => choice.group === selected.group && choice.key === selected.key
      )
    : null

  const config = {
    value: { label: field?.label, color: "var(--chart-1)" },
  } satisfies ChartConfig

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gráfico corporal</CardTitle>
        <CardDescription className="col-span-full col-start-1 row-start-2 sm:col-span-1">
          Escolha uma métrica para analisar
        </CardDescription>
        <CardAction className="col-span-full col-start-1 row-span-1 row-start-3 w-full sm:col-span-1 sm:col-start-2 sm:row-span-2 sm:row-start-1 sm:w-64">
          <Combobox
            items={metricGroups}
            onValueChange={choice =>
              setSelected(
                choice ? { group: choice.group as AssessmentGroup, key: choice.key } : null
              )
            }
            value={selectedChoice}
          >
            <ComboboxPrimitive.InputGroup ref={anchor} render={<InputGroup />}>
              <InputGroupAddon>
                <ScaleIcon aria-hidden="true" />
              </InputGroupAddon>
              <ComboboxPrimitive.Input
                aria-label="Métrica do gráfico"
                id="body-chart-metric"
                placeholder="Selecione"
                render={<InputGroupInput />}
              />
              <InputGroupAddon align="inline-end">
                {selectedChoice && <ComboboxClear aria-label="Limpar métrica" />}
                <ComboboxTrigger aria-label="Abrir métricas" />
              </InputGroupAddon>
            </ComboboxPrimitive.InputGroup>

            <ComboboxContent anchor={anchor}>
              <ComboboxEmpty>Nenhuma métrica encontrada</ComboboxEmpty>
              <ComboboxList>
                {group => (
                  <ComboboxGroup items={group.items} key={group.key}>
                    <ComboboxLabel>{group.label}</ComboboxLabel>
                    <ComboboxCollection>
                      {(choice: MetricChoice) => (
                        <ComboboxItem key={choice.value} value={choice}>
                          {choice.label}
                        </ComboboxItem>
                      )}
                    </ComboboxCollection>
                  </ComboboxGroup>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
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
