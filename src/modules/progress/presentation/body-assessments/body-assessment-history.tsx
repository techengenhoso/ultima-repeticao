"use client"

import { PencilIcon, Trash2Icon } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import type { BodyAssessment } from "@/modules/body-assessments/domain/body-assessment"

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium", timeZone: "UTC" })
    .format(new Date(`${value}T00:00:00Z`))
    .replaceAll(".", "")
export function BodyAssessmentHistory({
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
  const pageCount = Math.max(1, Math.ceil(items.length / 3))
  const current = Math.min(page, pageCount)
  const visible = items.slice((current - 1) * 3, current * 3)
  useEffect(() => setPage(value => Math.min(value, pageCount)), [pageCount])
  if (!items.length)
    return <p className="text-sm text-muted-foreground">Nenhuma avaliação cadastrada</p>
  return (
    <div className="grid gap-3">
      {visible.map(item => (
        <Card className="py-3" key={item.id} size="sm">
          <CardHeader>
            <CardTitle className="text-base normal-case tracking-normal">
              {formatDate(item.assessmentDate)}
            </CardTitle>
            <CardDescription>Criação da avaliação</CardDescription>
            <div
              className="col-start-2 row-span-2 row-start-1 self-center justify-self-end"
              data-slot="card-action"
            >
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
            </div>
          </CardHeader>
        </Card>
      ))}
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              aria-disabled={current === 1}
              href="#assessment-history"
              onClick={event => {
                event.preventDefault()
                setPage(value => Math.max(1, value - 1))
              }}
              text="Anterior"
            />
          </PaginationItem>
          {Array.from({ length: pageCount }, (_, index) => index + 1).map(item => (
            <PaginationItem key={item}>
              <PaginationLink
                href="#assessment-history"
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
              aria-disabled={current === pageCount}
              href="#assessment-history"
              onClick={event => {
                event.preventDefault()
                setPage(value => Math.min(pageCount, value + 1))
              }}
              text="Próxima"
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
