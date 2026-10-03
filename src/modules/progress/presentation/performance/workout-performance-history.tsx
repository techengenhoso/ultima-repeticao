"use client"

import { ChevronDownIcon, EyeIcon } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import type { WorkoutPerformanceData } from "./performance-types"

const formatDate = (value: number) =>
  new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value))

export function WorkoutPerformanceHistory({
  items,
}: {
  items: WorkoutPerformanceData["rows"]
}) {
  const [page, setPage] = useState(1)
  const pageCount = Math.max(1, Math.ceil(items.length / 3))
  const current = Math.min(page, pageCount)
  const visible = [...items].reverse().slice((current - 1) * 3, current * 3)
  const isFirstPage = current === 1
  const isLastPage = current === pageCount

  return (
    <section id="workout-performance-history">
      <Card>
        <CardHeader>
          <CardTitle>Histórico de desempenho</CardTitle>
          <CardDescription>Consulte seus treinos concluídos</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-3">
            {visible.map(item => (
              <Collapsible
                className="overflow-hidden rounded-2xl border bg-muted/50"
                key={item.id}
              >
                <CollapsibleTrigger className="group flex w-full items-center justify-between gap-4 bg-accent/60 p-4 text-left outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
                  <div className="grid min-w-0 gap-1">
                    <span className="font-medium">{formatDate(item.date)}</span>
                    <span className="text-sm text-muted-foreground">
                      {item.sets} séries concluídas · {item.repetitions} repetições ·
                      volume {item.volume.toLocaleString("pt-BR")} kg
                    </span>
                  </div>
                  <ChevronDownIcon
                    aria-hidden="true"
                    className="size-4 shrink-0 text-muted-foreground transition-transform group-aria-expanded:rotate-180"
                  />
                </CollapsibleTrigger>
                <CollapsibleContent className="border-t px-4 pb-4">
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-4">
                    <div>
                      <p className="font-medium">{item.workoutPlanName}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.workoutDayName}
                      </p>
                    </div>
                    <Link
                      className="inline-flex items-center gap-2 text-sm font-medium text-primary outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
                      href={`/history/sessions/${encodeURIComponent(item.id)}`}
                    >
                      Ver treino
                      <EyeIcon aria-hidden="true" className="size-4" />
                    </Link>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </CardContent>

        <CardFooter className="justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  aria-disabled={isFirstPage}
                  className={isFirstPage ? "pointer-events-none opacity-50" : undefined}
                  href="#workout-performance-history"
                  onClick={event => {
                    event.preventDefault()
                    if (!isFirstPage) setPage(value => Math.max(1, value - 1))
                  }}
                  tabIndex={isFirstPage ? -1 : undefined}
                  text="Anterior"
                />
              </PaginationItem>

              {Array.from({ length: pageCount }, (_, index) => index + 1).map(item => (
                <PaginationItem key={item}>
                  <PaginationLink
                    href="#workout-performance-history"
                    isActive={item === current}
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
                  aria-disabled={isLastPage}
                  className={isLastPage ? "pointer-events-none opacity-50" : undefined}
                  href="#workout-performance-history"
                  onClick={event => {
                    event.preventDefault()
                    if (!isLastPage) setPage(value => Math.min(pageCount, value + 1))
                  }}
                  tabIndex={isLastPage ? -1 : undefined}
                  text="Próxima"
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </CardFooter>
      </Card>
    </section>
  )
}
