"use client"

import { ChevronDownIcon } from "lucide-react"
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
import { effortRatingLabel } from "@/modules/sessions/domain/session"
import type { PerformanceData } from "./performance-types"

const formatDate = (value: number) =>
  new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value))

export function PerformanceHistory({ items }: { items: PerformanceData["rows"] }) {
  const [page, setPage] = useState(1)
  const pageCount = Math.max(1, Math.ceil(items.length / 3))
  const current = Math.min(page, pageCount)
  const visible = [...items].reverse().slice((current - 1) * 3, current * 3)
  const isFirstPage = current === 1
  const isLastPage = current === pageCount

  return (
    <section id="performance-history">
      <Card>
        <CardHeader>
          <CardTitle>Histórico de desempenho</CardTitle>
          <CardDescription>
            Consulte seus treinos concluídos para este exercício
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-3">
            {visible.map(item => (
              <Collapsible
                className="overflow-hidden rounded-2xl border bg-muted/50"
                key={item.sessionId}
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
                  <ul>
                    {item.performedSets.map((set, index) => (
                      <li
                        className="flex flex-wrap justify-between gap-x-4 gap-y-1 border-t py-3 first:border-t-0 last:pb-0"
                        key={set.setNumber}
                      >
                        <span className="font-medium">Série {index + 1}</span>
                        <span className="text-muted-foreground">
                          {set.load} kg × {set.performedRepetitions} repetições ·{" "}
                          {set.effortRating
                            ? effortRatingLabel[set.effortRating]
                            : "Não avaliada"}
                        </span>
                      </li>
                    ))}
                  </ul>
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
                  href="#performance-history"
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
                    href="#performance-history"
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
                  href="#performance-history"
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
