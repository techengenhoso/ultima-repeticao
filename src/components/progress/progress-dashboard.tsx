"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import {
  CalendarIcon,
  LoaderCircleIcon,
  PencilIcon,
  RulerIcon,
  ScaleIcon,
  Trash2Icon,
} from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"
import { type FieldPath, useForm } from "react-hook-form"
import { CartesianGrid, LabelList, Line, LineChart, XAxis, YAxis } from "recharts"
import { z } from "zod"
import { PageHeader } from "@/components/page-header"
import { SelectField } from "@/components/select-field"
import { Skeletons } from "@/components/skeleton"
import { TextField } from "@/components/text-field"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  comparison,
  type Metric,
  metricHistory,
  metricLabel,
  sortAssessments,
} from "@/lib/body-assessments/calculations"
import {
  createAssessment,
  listAssessments,
  removeAssessment,
  updateAssessment,
} from "@/lib/body-assessments/client"
import {
  type AssessmentGroup,
  assessmentFields,
  fieldFor,
  groups,
} from "@/lib/body-assessments/fields"
import {
  assessmentInputSchema,
  type BodyAssessment,
  type BodyAssessmentInput,
} from "@/lib/body-assessments/schemas"
import {
  formatBrazilianDateInput,
  formatIsoDateToBrazilian,
  parseBrazilianDate,
} from "@/lib/date"
import { exerciseOptions, performanceForExercise } from "@/lib/performance/calculations"
import { loadPerformanceSessions } from "@/lib/performance/client"
import { dateSchema } from "@/lib/schemas-zod"
import type { WorkoutSession } from "@/lib/sessions/schemas"

type FormValues = {
  assessmentDate: string
  values: Record<string, Record<string, string>>
}
const formatDate = (value: string) => {
  const [year, month, day] = value.split("-").map(Number)
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium", timeZone: "UTC" })
    .format(new Date(Date.UTC(year, month - 1, day)))
    .replaceAll(".", "")
}
const formatChartDate = (value: string) => {
  const [year, month, day] = value.split("-")
  return `${day}/${month}/${year?.slice(-2)}`
}
const number = (value: string) =>
  value.trim() === "" ? null : Number(value.replace(",", "."))
function formatMeasurementInput(value: string, integer = false) {
  const normalized = value.replace(/\./g, ",").replace(/[^\d,]/g, "")
  const [whole = "", ...fractionParts] = normalized.split(",")
  if (integer) return whole
  const fraction = fractionParts.join("").slice(0, 2)
  return normalized.includes(",") ? `${whole},${fraction}` : whole
}
const formatTextInput = (value: string) => value.replace(/[^\p{L}\s,.-]/gu, "")
const value = (item: BodyAssessment, group: AssessmentGroup, key: string): unknown =>
  item[group][key as never]
const formValue = (values: FormValues, group: AssessmentGroup, key: string) =>
  values.values[group]?.[key] ?? ""
function emptyValues(item?: BodyAssessment): FormValues {
  return {
    assessmentDate: item ? formatIsoDateToBrazilian(item.assessmentDate) : "",
    values: Object.fromEntries(
      groups.map(group => [
        group.key,
        Object.fromEntries(
          assessmentFields
            .filter(field => field.group === group.key)
            .map(field => [
              field.key,
              item ? String(value(item, field.group, field.key) ?? "") : "",
            ])
        ),
      ])
    ),
  }
}
function inputFrom(values: FormValues): BodyAssessmentInput {
  const groupsValue = (group: AssessmentGroup) =>
    Object.fromEntries(
      assessmentFields
        .filter(field => field.group === group)
        .map(field => [
          field.key,
          field.text
            ? formValue(values, group, field.key).trim() || null
            : number(formValue(values, group, field.key)),
        ])
    )
  return {
    assessmentDate: parseBrazilianDate(values.assessmentDate) ?? "",
    bodyIndex: groupsValue("bodyIndex"),
    circumferences: groupsValue("circumferences"),
    skinfolds: groupsValue("skinfolds"),
  } as BodyAssessmentInput
}
const formSchema = z
  .object({
    assessmentDate: dateSchema.refine(Boolean, "Informe a data da avaliação"),
    values: z.record(z.string(), z.record(z.string(), z.string())),
  })
  .superRefine((values, context) => {
    const parsed = assessmentInputSchema.safeParse(inputFrom(values))
    if (parsed.success) return
    for (const issue of parsed.error.issues) {
      if (!issue.path.length) continue
      const path =
        issue.path[0] === "assessmentDate"
          ? ["assessmentDate"]
          : issue.path.length === 2
            ? ["values", ...issue.path]
            : []
      context.addIssue({ code: "custom", message: issue.message, path })
    }
  })
const assessmentSteps: {
  group: AssessmentGroup
  title: string
  fields: FieldPath<FormValues>[]
}[] = groups.map(group => ({
  group: group.key,
  title: group.label,
  fields: [
    ...(group.key === "bodyIndex" ? (["assessmentDate"] as FieldPath<FormValues>[]) : []),
    ...assessmentFields
      .filter(field => field.group === group.key)
      .map(field => `values.${field.group}.${field.key}` as FieldPath<FormValues>),
  ],
}))
const metricChoices: Metric[] = [
  { group: "bodyIndex", key: "weight" },
  { group: "bodyIndex", key: "bodyFatPercentage" },
  { group: "bodyIndex", key: "muscleMass" },
  { group: "bodyIndex", key: "leanBodyMass" },
  ...assessmentFields
    .filter(field => field.group !== "bodyIndex")
    .map(field => ({ group: field.group, key: field.key })),
]

function AssessmentForm({
  item,
  onDone,
  onCancel,
  onDirtyChange,
  assessmentGroups = groups.map(group => group.key),
}: {
  item?: BodyAssessment
  onDone: (item: BodyAssessment) => void
  onCancel: () => void
  onDirtyChange?: (dirty: boolean) => void
  assessmentGroups?: AssessmentGroup[]
}) {
  const heading = useRef<HTMLHeadingElement>(null)
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: emptyValues(item),
  })
  const [step, setStep] = useState(0)
  const [saving, setSaving] = useState(false)
  const [failure, setFailure] = useState("")
  const pending = saving || form.formState.isSubmitting
  const steps = assessmentSteps.filter(item => assessmentGroups.includes(item.group))
  const currentStep = steps[step]
  const dateField = form.register("assessmentDate")

  useEffect(() => {
    form.reset(emptyValues(item))
    setStep(0)
  }, [form, item])

  useEffect(() => {
    onDirtyChange?.(form.formState.isDirty)
  }, [form.formState.isDirty, onDirtyChange])

  useEffect(() => {
    heading.current?.focus()
  })

  async function next() {
    if (await form.trigger(currentStep.fields, { shouldFocus: true })) {
      setFailure("")
      setStep(current => Math.min(current + 1, steps.length - 1))
    }
  }

  async function submit(values: FormValues) {
    setFailure("")
    const parsed = assessmentInputSchema.safeParse(inputFrom(values))
    if (!parsed.success) {
      setFailure(parsed.error.issues[0]?.message ?? "Revise os dados informados")
      return
    }
    setSaving(true)
    try {
      onDone(
        item
          ? await updateAssessment(item.id, parsed.data)
          : await createAssessment(parsed.data)
      )
    } catch (error) {
      setFailure(error instanceof Error ? error.message : "Não foi possível salvar")
    } finally {
      setSaving(false)
    }
  }
  return (
    <form
      className="flex min-h-0 flex-1 flex-col gap-5"
      onSubmit={event => {
        if (step < steps.length - 1) {
          event.preventDefault()
          void next()
          return
        }
        void form.handleSubmit(submit)(event)
      }}
    >
      <div className="min-h-0 space-y-5 overflow-y-auto overscroll-contain scrollbar-none [&::-webkit-scrollbar]:hidden">
        {step === 0 && (
          <TextField
            {...dateField}
            error={form.formState.errors.assessmentDate}
            icon={<CalendarIcon aria-hidden="true" />}
            id="assessment-date"
            inputMode="numeric"
            label="Data da avaliação"
            onChange={event => {
              event.target.value = formatBrazilianDateInput(event.target.value)
              return dateField.onChange(event)
            }}
            placeholder="DD/MM/AAAA"
            type="text"
          />
        )}

        <fieldset className="min-w-0" disabled={pending}>
          <div className="grid gap-5 sm:grid-cols-2">
            {assessmentFields
              .filter(field => field.group === currentStep.group)
              .map(field => {
                const name = `values.${field.group}.${field.key}` as const
                const fieldRegistration = form.register(name)
                const error = form.formState.errors.values?.[field.group]?.[field.key]
                return (
                  <TextField
                    error={error}
                    icon={
                      field.group === "bodyIndex" ? (
                        <ScaleIcon aria-hidden="true" />
                      ) : (
                        <RulerIcon aria-hidden="true" />
                      )
                    }
                    id={name}
                    inputMode={field.text ? "text" : "decimal"}
                    key={name}
                    label={field.label}
                    maxLength={field.text ? 100 : undefined}
                    {...fieldRegistration}
                    onChange={event => {
                      if (field.text)
                        event.target.value = formatTextInput(event.target.value)
                      else
                        event.target.value = formatMeasurementInput(
                          event.target.value,
                          field.integer
                        )
                      return fieldRegistration.onChange(event)
                    }}
                    placeholder={field.placeholder ?? "Ex: 86,2"}
                    type="text"
                  />
                )
              })}
          </div>
        </fieldset>
        {(failure || form.formState.errors.root?.message) && (
          <p className="text-sm text-destructive" role="alert">
            {failure || form.formState.errors.root?.message}
          </p>
        )}
      </div>
      <DialogFooter className="mt-auto border-t pt-4 sm:justify-between">
        <Button
          disabled={pending}
          onClick={() => (step ? setStep(current => current - 1) : onCancel())}
          type="button"
          variant="outline"
        >
          {step ? "Voltar" : "Cancelar"}
        </Button>
        <Button disabled={pending} type="submit">
          {pending && <LoaderCircleIcon className="animate-spin" />}
          {pending
            ? "Salvando"
            : step < steps.length - 1
              ? "Continuar"
              : item
                ? "Alterar"
                : "Criar"}
        </Button>
      </DialogFooter>
    </form>
  )
}
function BodyChart({ assessments }: { assessments: BodyAssessment[] }) {
  const [selected, setSelected] = useState<Metric | null>(null)
  const data = selected ? metricHistory(assessments, selected).slice(-5) : []
  const field = selected ? fieldFor(selected.group, selected.key) : undefined
  const config = {
    value: { label: field?.label, color: "var(--chart-1)" },
  } satisfies ChartConfig
  return (
    <section className="space-y-3 border bg-card p-4">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="font-semibold">Gráfico corporal</h2>

          <p className="text-sm text-muted-foreground">
            Escolha uma métrica para analisar
          </p>
        </div>

        <SelectField
          aria-label="Métrica do gráfico"
          className="w-full sm:w-64"
          icon={<ScaleIcon aria-hidden="true" />}
          id="body-chart-metric"
          onChange={selectedMetric => {
            if (!selectedMetric) {
              setSelected(null)
              return
            }
            const [group, key] = selectedMetric.split(".")
            setSelected({ group: group as AssessmentGroup, key })
          }}
          options={metricChoices.map(metric => ({
            label: metricLabel(metric),
            value: `${metric.group}.${metric.key}`,
          }))}
          value={selected ? `${selected.group}.${selected.key}` : ""}
        />
      </div>
      {selected && data.length ? (
        <>
          <ChartContainer className="h-64 w-full" config={config}>
            <LineChart
              accessibilityLayer
              data={data}
              margin={{ bottom: 4, left: 4, right: 12, top: 28 }}
            >
              <CartesianGrid vertical={false} />

              <XAxis dataKey="date" minTickGap={16} tickFormatter={formatChartDate} />

              <YAxis width={48} />

              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={item =>
                      `${Number(item).toLocaleString("pt-BR")} ${field?.unit ?? ""}`
                    }
                    labelFormatter={label => formatDate(String(label))}
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
              .map(item => `${formatDate(item.date)} ${item.value} ${field?.unit ?? ""}`)
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
    </section>
  )
}

function Indicators({ assessments }: { assessments: BodyAssessment[] }) {
  const metrics: Metric[] = [
    { group: "bodyIndex", key: "weight" },
    { group: "bodyIndex", key: "bodyFatPercentage" },
    { group: "bodyIndex", key: "muscleRatePercentage" },
  ]
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {metrics.flatMap(metric => {
        const latest = sortAssessments(assessments).find(
          item => typeof value(item, metric.group, metric.key) === "number"
        )
        const current = latest ? value(latest, metric.group, metric.key) : null
        if (typeof current !== "number") return []
        const field = fieldFor(metric.group, metric.key)
        const change = comparison(assessments, metric)

        return (
          <article className="border bg-card p-4" key={metric.key}>
            <p className="text-sm text-muted-foreground">{field?.label}</p>
            <p className="mt-1 text-2xl font-bold">
              {current.toLocaleString("pt-BR")} {field?.unit}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              {change ? (
                <>
                  {change.difference > 0 ? "+" : ""}
                  {change.difference.toLocaleString("pt-BR")}
                  {field?.unit} desde a avaliação anterior
                </>
              ) : (
                "Sem avaliação anterior para comparar"
              )}
            </p>
          </article>
        )
      })}
    </div>
  )
}

function AssessmentDetails({ item }: { item: BodyAssessment }) {
  return (
    <div className="space-y-4">
      {groups.map(group => {
        const filled = assessmentFields.filter(
          field =>
            field.group === group.key && value(item, field.group, field.key) !== null
        )
        return filled.length ? (
          <section key={group.key}>
            <h3 className="font-semibold">{group.label}</h3>
            <dl className="mt-2 grid gap-2 sm:grid-cols-2">
              {filled.map(field => (
                <div className="flex justify-between gap-3 border p-2" key={field.key}>
                  <dt className="text-muted-foreground">{field.label}</dt>
                  <dd>
                    {String(value(item, field.group, field.key))} {field.unit}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        ) : null
      })}
    </div>
  )
}
function AssessmentHistory({
  items,
  onView,
  onEdit,
  onDelete,
}: {
  items: BodyAssessment[]
  onView: (item: BodyAssessment) => void
  onEdit: (item: BodyAssessment) => void
  onDelete: (item: BodyAssessment) => void
}) {
  const [page, setPage] = useState(1)
  const pageSize = 3
  const pageCount = Math.max(1, Math.ceil(items.length / pageSize))
  const currentPage = Math.min(page, pageCount)
  const visibleItems = items.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  useEffect(() => {
    setPage(current => Math.min(current, pageCount))
  }, [pageCount])

  if (!items.length)
    return <p className="text-sm text-muted-foreground">Nenhuma avaliação cadastrada</p>

  return (
    <div className="grid gap-3">
      {visibleItems.map(item => (
        <article
          className="flex flex-wrap items-center justify-between gap-3 border bg-card p-4"
          key={item.id}
        >
          <div>
            <h3 className="font-semibold">{formatDate(item.assessmentDate)}</h3>

            <p className="text-sm text-muted-foreground">criação da avaliação</p>
          </div>

          <div className="flex gap-1">
            <Button
              aria-label="Visualizar avaliação"
              onClick={() => onView(item)}
              size="sm"
              type="button"
              variant="outline"
            >
              Detalhes
            </Button>

            <Button
              aria-label="Editar avaliação"
              onClick={() => onEdit(item)}
              size="icon-sm"
              type="button"
              variant="blue"
            >
              <PencilIcon />
            </Button>

            <Button
              aria-label="Excluir avaliação"
              onClick={() => onDelete(item)}
              size="icon-sm"
              type="button"
              variant="destructive"
            >
              <Trash2Icon />
            </Button>
          </div>
        </article>
      ))}
      {pageCount >= 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                aria-disabled={currentPage === 1}
                href="#assessment-history"
                onClick={event => {
                  event.preventDefault()
                  setPage(current => Math.max(1, current - 1))
                }}
                text="Anterior"
              />
            </PaginationItem>
            {Array.from({ length: pageCount }, (_, index) => index + 1).map(item => (
              <PaginationItem key={item}>
                <PaginationLink
                  href="#assessment-history"
                  isActive={item === currentPage}
                  onClick={event => {
                    event.preventDefault()
                    setPage(item)
                  }}
                >
                  {item}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                aria-disabled={currentPage === pageCount}
                href="#assessment-history"
                onClick={event => {
                  event.preventDefault()
                  setPage(current => Math.min(pageCount, current + 1))
                }}
                text="Próxima"
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}

function BodyAssessments() {
  const [items, setItems] = useState<BodyAssessment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [editing, setEditing] = useState<BodyAssessment | null>(null)
  const [creatingGroup, setCreatingGroup] = useState<AssessmentGroup | null>(null)
  const [choosingType, setChoosingType] = useState(false)
  const [viewing, setViewing] = useState<BodyAssessment | null>(null)
  const [deleting, setDeleting] = useState<BodyAssessment | null>(null)
  const [creatingDirty, setCreatingDirty] = useState(false)
  const [editingDirty, setEditingDirty] = useState(false)
  const [confirmingClose, setConfirmingClose] = useState<"creating" | "editing" | null>(
    null
  )
  const load = async () => {
    setLoading(true)
    try {
      setItems(sortAssessments(await listAssessments()))
      setError("")
    } catch (error) {
      setError(error instanceof Error ? error.message : "Não foi possível carregar")
    } finally {
      setLoading(false)
    }
  }
  // biome-ignore lint/correctness/useExhaustiveDependencies: carregamento inicial ocorre uma única vez
  useEffect(() => {
    void load()
  }, [])
  const saved = (item: BodyAssessment) => {
    setItems(current =>
      sortAssessments([item, ...current.filter(old => old.id !== item.id)])
    )
    setEditing(null)
    setCreatingGroup(null)
    setCreatingDirty(false)
    setEditingDirty(false)
  }
  const closeCreating = () => {
    if (creatingDirty) {
      setConfirmingClose("creating")
      return
    }
    setCreatingGroup(null)
  }
  const closeEditing = () => {
    if (editingDirty) {
      setConfirmingClose("editing")
      return
    }
    setEditing(null)
  }
  const discardChanges = () => {
    if (confirmingClose === "creating") {
      setCreatingGroup(null)
      setCreatingDirty(false)
    }
    if (confirmingClose === "editing") {
      setEditing(null)
      setEditingDirty(false)
    }
    setConfirmingClose(null)
  }
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold">Avaliação corporal</h2>
          <p className="text-sm text-muted-foreground">
            Registre medidas e acompanhe suas variações
          </p>
        </div>
        <Button onClick={() => setChoosingType(true)}>Nova avaliação</Button>
      </div>
      <Dialog onOpenChange={setChoosingType} open={choosingType}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Tipo de avaliação corporal</DialogTitle>
            <DialogDescription>
              Escolha o tipo de medida que deseja cadastrar
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 sm:grid-cols-3">
            {groups.map(group => (
              <Button
                className="h-auto min-h-24 whitespace-normal"
                key={group.key}
                onClick={() => {
                  setChoosingType(false)
                  setCreatingGroup(group.key)
                }}
                type="button"
                variant="outline"
              >
                {group.label}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
      {creatingGroup && (
        <Dialog
          onOpenChange={open => {
            if (!open) closeCreating()
          }}
          open
        >
          <DialogContent className="flex max-h-[calc(100dvh-2rem)] min-w-0 flex-col gap-4 overflow-hidden p-4 sm:max-w-xl sm:p-6">
            <DialogHeader>
              <DialogTitle>Nova avaliação corporal</DialogTitle>
              <DialogDescription>
                Registre a data e as medidas de{" "}
                {groups
                  .find(group => group.key === creatingGroup)
                  ?.label.toLocaleLowerCase("pt-BR")}
              </DialogDescription>
            </DialogHeader>
            <AssessmentForm
              assessmentGroups={[creatingGroup]}
              onCancel={closeCreating}
              onDirtyChange={setCreatingDirty}
              onDone={saved}
            />
          </DialogContent>
        </Dialog>
      )}
      {editing && (
        <Dialog
          onOpenChange={open => {
            if (!open) closeEditing()
          }}
          open
        >
          <DialogContent className="flex max-h-[calc(100dvh-2rem)] min-w-0 flex-col gap-4 overflow-hidden p-4 sm:max-w-xl sm:p-6">
            <DialogHeader>
              <DialogTitle>Editar avaliação corporal</DialogTitle>
              <DialogDescription>
                Atualize a data e as medidas disponíveis para esta avaliação
              </DialogDescription>
            </DialogHeader>
            <AssessmentForm
              item={editing}
              onCancel={closeEditing}
              onDirtyChange={setEditingDirty}
              onDone={saved}
            />
          </DialogContent>
        </Dialog>
      )}
      {loading ? (
        <Skeletons />
      ) : error ? (
        <div role="alert">
          <p className="text-destructive">{error}</p>

          <Button className="mt-2" onClick={() => void load()} variant="outline">
            Tentar novamente
          </Button>
        </div>
      ) : items.length === 0 ? (
        <Empty className="border">
          <EmptyHeader>
            <EmptyTitle>Nenhuma avaliação cadastrada</EmptyTitle>
            <EmptyDescription>Crie uma avaliação para acompanhamento</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <>
          <Indicators assessments={items} />

          <BodyChart assessments={items} />

          <section className="space-y-3" id="assessment-history">
            <h2 className="font-semibold">Histórico de avaliações</h2>
            <AssessmentHistory
              items={items}
              onDelete={setDeleting}
              onEdit={setEditing}
              onView={setViewing}
            />
          </section>
        </>
      )}

      <Dialog onOpenChange={open => !open && setViewing(null)} open={Boolean(viewing)}>
        <DialogContent className="flex max-h-[calc(100dvh-2rem)] min-w-0 flex-col gap-4 overflow-hidden p-4 sm:max-w-xl sm:p-6">
          <DialogHeader>
            <DialogTitle>
              Avaliação de {viewing && formatDate(viewing.assessmentDate)}
            </DialogTitle>
            <DialogDescription>
              Medidas registradas nesta avaliação corporal
            </DialogDescription>
          </DialogHeader>
          <div className="min-h-0 overflow-y-auto overscroll-contain scrollbar-none [&::-webkit-scrollbar]:hidden">
            {viewing && <AssessmentDetails item={viewing} />}
          </div>
          <DialogFooter className="border-t pt-4">
            <Button onClick={() => setViewing(null)} type="button" variant="outline">
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <AlertDialog
        onOpenChange={open => !open && setDeleting(null)}
        open={Boolean(deleting)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir avaliação?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleting)
                  void removeAssessment(deleting.id).then(() => {
                    setItems(items => items.filter(item => item.id !== deleting.id))
                    setDeleting(null)
                  })
              }}
              variant="destructive"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog
        onOpenChange={open => !open && setConfirmingClose(null)}
        open={Boolean(confirmingClose)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Descartar alterações</AlertDialogTitle>
            <AlertDialogDescription>
              Os dados preenchidos nesta avaliação não serão salvos. Esta ação não poderá
              ser desfeita
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continuar editando</AlertDialogCancel>
            <Button onClick={discardChanges} variant="destructive">
              Descartar
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
function Performance() {
  const [sessions, setSessions] = useState<WorkoutSession[]>([])
  const [selected, setSelected] = useState("")
  const [error, setError] = useState("")
  useEffect(() => {
    void loadPerformanceSessions()
      .then(value => {
        setSessions(value)
        setSelected(exerciseOptions(value)[0]?.key ?? "")
      })
      .catch(error =>
        setError(error instanceof Error ? error.message : "Não foi possível carregar")
      )
  }, [])
  const options = useMemo(() => exerciseOptions(sessions), [sessions])
  const data = useMemo(
    () => performanceForExercise(sessions, selected),
    [sessions, selected]
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
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">Desempenho nos treinos</h2>
        <p className="text-sm text-muted-foreground">
          Séries de trabalho concluídas nas suas sessões
        </p>
      </div>
      {options.length ? (
        <>
          <select
            aria-label="Exercício"
            className="h-11 max-w-full border bg-background px-3"
            onChange={e => setSelected(e.target.value)}
            value={selected}
          >
            {options.map(option => (
              <option key={option.key} value={option.key}>
                {option.name} ·{" "}
                {option.source === "custom" ? "Personalizado" : "Biblioteca"}
              </option>
            ))}
          </select>
          {data.latest && (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <article className="border bg-card p-4">
                Última carga
                <strong className="block text-xl">{data.latest.load} kg</strong>
              </article>
              <article className="border bg-card p-4">
                Melhor série
                <strong className="block text-xl">
                  {data.latest.best.load} kg × {data.latest.best.performedRepetitions}
                </strong>
              </article>
              <article className="border bg-card p-4">
                Maior carga<strong className="block text-xl">{data.maxLoad} kg</strong>
              </article>
              <article className="border bg-card p-4">
                Sessões concluídas
                <strong className="block text-xl">{data.sessions}</strong>
              </article>
            </div>
          )}
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
        </>
      ) : (
        <p className="text-sm text-muted-foreground">
          Nenhuma série de trabalho concluída encontrada
        </p>
      )}
    </div>
  )
}
export function ProgressDashboard() {
  return (
    <div className="space-y-6">
      <PageHeader
        description="Acompanhe suas avaliações corporais e seu desempenho nos treinos"
        title="Evolução"
      />
      <Tabs defaultValue="body">
        <TabsList className="w-full sm:w-fit">
          <TabsTrigger value="body">Avaliação corporal</TabsTrigger>
          <TabsTrigger value="performance">Desempenho nos treinos</TabsTrigger>
        </TabsList>
        <TabsContent className="pt-6" value="body">
          <BodyAssessments />
        </TabsContent>
        <TabsContent className="pt-6" value="performance">
          <Performance />
        </TabsContent>
      </Tabs>
    </div>
  )
}
