"use client"

import { Combobox as ComboboxPrimitive } from "@base-ui/react"
import { cn } from "cn"
import { ChevronLeftIcon, ChevronRightIcon, ListFilterIcon } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Combobox,
  ComboboxClear,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
  useComboboxAnchor,
} from "@/components/ui/combobox"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import type { WorkoutSession } from "@/modules/sessions/domain/session"

type SessionStatusFilter = "cancelled" | "completed"

type SessionStatusChoice = {
  label: string
  value: SessionStatusFilter
}

const weekDays = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"]

const statusChoices: SessionStatusChoice[] = [
  { label: "Treinos concluídos", value: "completed" },
  { label: "Treinos cancelados", value: "cancelled" },
]

const toCalendarDate = (timestamp: number) => {
  const date = new Date(timestamp)
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

const dateKey = (date: Date) =>
  `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`

const monthStart = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1)

const formatMonth = (date: Date) =>
  new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" }).format(date)

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date)

function sessionDate(session: WorkoutSession) {
  return toCalendarDate(session.completedAt ?? session.startedAt)
}

function initialMonth(sessions: WorkoutSession[]) {
  const latest = sessions.reduce<WorkoutSession | null>(
    (current, session) =>
      !current ||
      (session.completedAt ?? session.startedAt) >
        (current.completedAt ?? current.startedAt)
        ? session
        : current,
    null
  )

  return latest ? monthStart(sessionDate(latest)) : monthStart(new Date())
}

export function WorkoutSessionCalendar({ sessions }: { sessions: WorkoutSession[] }) {
  const [month, setMonth] = useState(() => initialMonth(sessions))
  const [statusFilter, setStatusFilter] = useState<SessionStatusFilter | null>("completed")
  const anchor = useComboboxAnchor()
  const completedDays = useMemo(
    () =>
      new Set(
        sessions
          .filter(session => session.status === "completed")
          .map(session => dateKey(sessionDate(session)))
      ),
    [sessions]
  )
  const cancelledDays = useMemo(
    () =>
      new Set(
        sessions
          .filter(session => session.status === "cancelled")
          .map(session => dateKey(sessionDate(session)))
      ),
    [sessions]
  )
  const sessionYears = sessions.map(session => sessionDate(session).getFullYear())
  const currentYear = new Date().getFullYear()
  const firstMonth = new Date(
    Math.min(
      currentYear - 5,
      sessionYears.length ? Math.min(...sessionYears) : currentYear
    ),
    0,
    1
  )
  const lastMonth = new Date(
    Math.max(
      currentYear + 5,
      sessionYears.length ? Math.max(...sessionYears) : currentYear
    ),
    11,
    1
  )
  const selectedStatus =
    statusFilter === "completed"
      ? statusChoices[0]
      : statusFilter === "cancelled"
        ? statusChoices[1]
        : null
  const firstDay = monthStart(month)
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate()
  const blankDays = Array.from({ length: firstDay.getDay() }, (_, index) => index + 1)
  const days = Array.from(
    { length: daysInMonth },
    (_, index) => new Date(month.getFullYear(), month.getMonth(), index + 1)
  )

  useEffect(() => {
    if (!statusFilter) return

    setMonth(initialMonth(sessions.filter(session => session.status === statusFilter)))
  }, [sessions, statusFilter])

  return (
    <section aria-labelledby="workout-calendar-title">
      <Card>
        <CardHeader>
          <CardTitle id="workout-calendar-title">Calendário de treinos</CardTitle>
          <CardDescription className="col-span-full col-start-1 row-start-2 sm:col-span-1">
            Selecione o status para visualizar seus dias
          </CardDescription>
          <CardAction className="col-span-full col-start-1 row-start-3 w-full sm:col-span-1 sm:col-start-2 sm:row-span-2 sm:row-start-1 sm:w-64">
            <Combobox
              items={statusChoices}
              onValueChange={choice => setStatusFilter(choice?.value ?? null)}
              value={selectedStatus}
            >
              <ComboboxPrimitive.InputGroup ref={anchor} render={<InputGroup />}>
                <InputGroupAddon>
                  <ListFilterIcon aria-hidden="true" />
                </InputGroupAddon>
                <ComboboxPrimitive.Input
                  aria-label="Filtrar status dos treinos"
                  id="workout-calendar-status"
                  placeholder="Selecione um status"
                  render={<InputGroupInput />}
                />
                <InputGroupAddon align="inline-end">
                  {selectedStatus && (
                    <ComboboxClear aria-label="Limpar filtro de status" />
                  )}
                  <ComboboxTrigger aria-label="Abrir filtros de status" />
                </InputGroupAddon>
              </ComboboxPrimitive.InputGroup>

              <ComboboxContent anchor={anchor}>
                <ComboboxEmpty>Nenhum status encontrado</ComboboxEmpty>
                <ComboboxList>
                  <ComboboxCollection>
                    {(choice: SessionStatusChoice) => (
                      <ComboboxItem key={choice.value} value={choice}>
                        {choice.label}
                      </ComboboxItem>
                    )}
                  </ComboboxCollection>
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          </CardAction>
        </CardHeader>
        <CardContent>
          <div className="mx-auto w-full max-w-md">
            <div className="flex items-center justify-between">
              <Button
                aria-label="Ver mês anterior"
                disabled={month <= firstMonth}
                onClick={() =>
                  setMonth(
                    current => new Date(current.getFullYear(), current.getMonth() - 1, 1)
                  )
                }
                size="icon"
                variant="ghost"
              >
                <ChevronLeftIcon aria-hidden="true" />
              </Button>
              <h3 className="font-semibold capitalize">{formatMonth(month)}</h3>
              <Button
                aria-label="Ver próximo mês"
                disabled={month >= lastMonth}
                onClick={() =>
                  setMonth(
                    current => new Date(current.getFullYear(), current.getMonth() + 1, 1)
                  )
                }
                size="icon"
                variant="ghost"
              >
                <ChevronRightIcon aria-hidden="true" />
              </Button>
            </div>
            <div className="mt-4 grid grid-cols-7 gap-y-2 text-center">
              {weekDays.map(day => (
                <span className="text-xs font-medium text-muted-foreground" key={day}>
                  {day}
                </span>
              ))}
              {blankDays.map(blankDay => (
                <span
                  aria-hidden="true"
                  key={`${firstDay.getFullYear()}-${firstDay.getMonth()}-blank-${blankDay}`}
                />
              ))}
              {days.map(day => {
                const key = dateKey(day)
                const completed = statusFilter === "completed" && completedDays.has(key)
                const cancelled = statusFilter === "cancelled" && cancelledDays.has(key)
                const label = completed
                  ? `${formatDate(day)}: treino concluído`
                  : cancelled
                    ? `${formatDate(day)}: treino cancelado`
                    : formatDate(day)

                return (
                  <time
                    className={cn(
                      "mx-auto flex aspect-square w-full max-w-11 items-center justify-center rounded-full text-sm font-medium",
                      completed
                        ? "bg-primary text-primary-foreground"
                        : cancelled
                          ? "bg-destructive/15 text-destructive"
                          : "text-foreground"
                    )}
                    dateTime={`${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, "0")}-${String(day.getDate()).padStart(2, "0")}`}
                    key={key}
                  >
                    <span className="sr-only">{label}</span>
                    <span aria-hidden="true">{day.getDate()}</span>
                  </time>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
