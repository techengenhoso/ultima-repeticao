"use client"

import { EyeIcon, PencilIcon, Trash2Icon } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "@/components/ui/item"
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
  const isFirstPage = current === 1
  const isLastPage = current === pageCount

  useEffect(() => setPage(value => Math.min(value, pageCount)), [pageCount])

  if (!items.length)
    return <p className="text-sm text-muted-foreground">Nenhuma avaliação cadastrada</p>

  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de avaliações</CardTitle>
        <CardDescription>Consulte e gerencie suas avaliações anteriores</CardDescription>
      </CardHeader>

      <CardContent>
        <ItemGroup>
          {visible.map(item => (
            <Item key={item.id} variant="muted">
              <ItemContent>
                <ItemTitle>{formatDate(item.assessmentDate)}</ItemTitle>
                <ItemDescription>Criação da avaliação</ItemDescription>
              </ItemContent>

              <ItemActions className="shrink-0 gap-1">
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
                  variant="secondary"
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
              </ItemActions>
            </Item>
          ))}
        </ItemGroup>
      </CardContent>

      <CardFooter className="justify-center">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                aria-disabled={isFirstPage}
                className={isFirstPage ? "pointer-events-none opacity-50" : undefined}
                href="#assessment-history"
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
                aria-disabled={isLastPage}
                className={isLastPage ? "pointer-events-none opacity-50" : undefined}
                href="#assessment-history"
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
  )
}
