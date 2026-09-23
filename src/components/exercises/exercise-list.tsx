"use client"

import { Skeletons } from "@/components/skeleton"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useExercise } from "@/contexts/exercise-context"
import { ExerciseListRow } from "./exercise-list-row"

const itemsPerPage = 10

interface ExercisePaginationProps {
  currentPage: number
  onPageChange: (page: number) => void
  totalPages: number
}

function pageNumbers(
  currentPage: number,
  totalPages: number
): Array<number | "ellipsis-start" | "ellipsis-end"> {
  if (totalPages <= 5) return Array.from({ length: totalPages }, (_, index) => index + 1)

  if (currentPage <= 3) return [1, 2, 3, "ellipsis-end", totalPages]

  if (currentPage >= totalPages - 2)
    return [1, "ellipsis-start", totalPages - 2, totalPages - 1, totalPages]

  return [1, "ellipsis-start", currentPage, "ellipsis-end", totalPages]
}

function ExercisePagination({
  currentPage,
  onPageChange,
  totalPages,
}: ExercisePaginationProps) {
  const isFirstPage = currentPage === 1
  const isLastPage = currentPage === totalPages

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            aria-disabled={isFirstPage}
            className={isFirstPage ? "pointer-events-none opacity-50" : undefined}
            href="#exercise-list-title"
            onClick={event => {
              event.preventDefault()
              if (!isFirstPage) onPageChange(currentPage - 1)
            }}
            tabIndex={isFirstPage ? -1 : undefined}
            text="Anterior"
          />
        </PaginationItem>

        {pageNumbers(currentPage, totalPages).map(page =>
          typeof page === "string" ? (
            <PaginationItem key={page}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={page}>
              <PaginationLink
                aria-label={`Ir para página ${page}`}
                href="#exercise-list-title"
                isActive={page === currentPage}
                onClick={event => {
                  event.preventDefault()
                  onPageChange(page)
                }}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          )
        )}

        <PaginationItem>
          <PaginationNext
            aria-disabled={isLastPage}
            className={isLastPage ? "pointer-events-none opacity-50" : undefined}
            href="#exercise-list-title"
            onClick={event => {
              event.preventDefault()
              if (!isLastPage) onPageChange(currentPage + 1)
            }}
            tabIndex={isLastPage ? -1 : undefined}
            text="Próxima"
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

export function ExerciseList() {
  const {
    filteredExercises,
    isLoading,
    page,
    setDeleting,
    setDetails,
    setFormExercise,
    setPage,
  } = useExercise()

  const totalPages = Math.max(1, Math.ceil(filteredExercises.length / itemsPerPage))
  const currentPage = Math.min(page, totalPages)
  const exercises = filteredExercises.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <section aria-labelledby="exercise-list-title">
      {isLoading ? (
        <Skeletons />
      ) : filteredExercises.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyTitle>Nenhum resultado encontrado</EmptyTitle>

            <EmptyDescription>
              Tente mudar, limpar os filtros ou crie um exercício
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle id="exercise-list-title">Biblioteca de exercícios</CardTitle>
            <CardDescription>
              Consulte os exercícios disponíveis e gerencie os personalizados
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="space-y-5">
              <Table className="table-fixed">
                <TableHeader className="bg-muted/50 [&_tr]:border-y [&_th]:font-semibold [&_th]:text-foreground">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-center">Exercício</TableHead>
                    <TableHead className="hidden text-center sm:table-cell">
                      Músculos principais
                    </TableHead>
                    <TableHead className="hidden text-center lg:table-cell">
                      Dificuldade
                    </TableHead>
                    <TableHead className="w-36 text-center">Ações</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody className="[&_tr:last-child]:border-b">
                  {exercises.map(exercise => (
                    <ExerciseListRow
                      exercise={exercise}
                      key={`${exercise.source}-${exercise.id}`}
                      onDelete={setDeleting}
                      onDetails={setDetails}
                      onEdit={setFormExercise}
                    />
                  ))}
                </TableBody>
              </Table>

              <ExercisePagination
                currentPage={currentPage}
                onPageChange={setPage}
                totalPages={totalPages}
              />
            </div>
          </CardContent>
        </Card>
      )}
    </section>
  )
}
