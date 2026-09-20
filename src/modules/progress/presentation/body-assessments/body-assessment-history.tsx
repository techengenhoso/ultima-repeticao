"use client"

import { EyeIcon, PencilIcon, Trash2Icon } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
    <Card>
      <CardHeader>
        <CardTitle>Histórico de avaliações</CardTitle>
        <CardDescription>Consulte e gerencie suas avaliações anteriores</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="divide-y divide-border border-y border-border">
          {visible.map(item => (
            <div className="flex items-center justify-between gap-4 py-4" key={item.id}>
              <div>
                <p className="font-medium">{formatDate(item.assessmentDate)}</p>
                <p className="mt-1 text-sm text-muted-foreground">Criação da avaliação</p>
              </div>
              <div className="flex shrink-0 gap-1">
                <Button
                  aria-label="Visualizar avaliação"
                  className="size-9 px-0 sm:w-auto sm:px-4"
                  onClick={() => onView(item)}
                  size="sm"
                  type="button"
                  variant="secondary"
                >
                  <EyeIcon aria-hidden="true" className="sm:hidden" />
                  <span className="hidden sm:inline">Detalhes</span>
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
          ))}
        </div>
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
      </CardContent>
    </Card>
  )
}
