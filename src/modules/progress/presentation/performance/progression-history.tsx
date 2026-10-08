"use client"

import { LoaderCircleIcon, Trash2Icon } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import type { PerformanceData } from "./performance-types"

type ProgressionItem = PerformanceData["rows"][number] & {
  decision: NonNullable<PerformanceData["rows"][number]["decision"]>
}

const formatDate = (value: number) =>
  new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value))

export function ProgressionHistory({
  items,
  onRemove,
}: {
  items: PerformanceData["rows"]
  onRemove(item: ProgressionItem): Promise<void>
}) {
  const [deleting, setDeleting] = useState<ProgressionItem | null>(null)
  const [pending, setPending] = useState(false)
  const progressions = items.filter(
    (item): item is ProgressionItem => item.decision !== undefined
  )
  const [page, setPage] = useState(1)
  const pageCount = Math.max(1, Math.ceil(progressions.length / 3))
  const current = Math.min(page, pageCount)
  const visible = [...progressions].reverse().slice((current - 1) * 3, current * 3)
  const isFirstPage = current === 1
  const isLastPage = current === pageCount

  async function remove() {
    if (!deleting) return
    setPending(true)
    try {
      await onRemove(deleting)
      setDeleting(null)
      toast.success("Evolução de carga excluída")
    } catch (failure) {
      toast.error(
        failure instanceof Error
          ? failure.message
          : "Não foi possível excluir a evolução de carga"
      )
    } finally {
      setPending(false)
    }
  }

  return (
    <section id="progression-history">
      <Card>
        <CardHeader>
          <CardTitle>Histórico de evolução</CardTitle>
          <CardDescription>
            Consulte ou exclua as cargas definidas para os próximos treinos
          </CardDescription>
        </CardHeader>

        <CardContent>
          {!progressions.length ? (
            <Empty className="border">
              <EmptyHeader>
                <EmptyTitle>Nenhuma evolução registrada</EmptyTitle>
                <EmptyDescription>
                  Defina a próxima carga após concluir o exercício
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <div className="space-y-3">
              {visible.map(item => (
                <div
                  className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border bg-muted/50 p-4"
                  key={`${item.sessionId}-${item.exerciseIndex}`}
                >
                  <div className="flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-1 text-sm">
                    <span className="font-medium">
                      {formatDate(item.decision.decidedAt)}
                    </span>
                    <span className="text-muted-foreground">
                      Próxima carga {item.decision.load} kg
                      {item.decision.suggestedRepetitions !== undefined
                        ? ` · ${item.decision.suggestedRepetitions} repetições`
                        : ""}
                    </span>
                  </div>

                  <Button
                    aria-label={`Excluir evolução de carga de ${formatDate(item.decision.decidedAt)}`}
                    disabled={pending}
                    onClick={() => setDeleting(item)}
                    size="icon-sm"
                    type="button"
                    variant="destructive"
                  >
                    <Trash2Icon />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>

        {progressions.length > 0 && (
          <CardFooter className="justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    aria-disabled={isFirstPage}
                    className={isFirstPage ? "pointer-events-none opacity-50" : undefined}
                    href="#progression-history"
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
                      href="#progression-history"
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
                    href="#progression-history"
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
        )}
      </Card>

      <AlertDialog
        onOpenChange={open => !open && !pending && setDeleting(null)}
        open={Boolean(deleting)}
      >
        <AlertDialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto">
          <AlertDialogHeader className="sm:group-data-[size=default]/alert-dialog-content:place-items-center sm:group-data-[size=default]/alert-dialog-content:text-center">
            <AlertDialogTitle>Exclusão permanente</AlertDialogTitle>
            <AlertDialogDescription>
              Esta evolução de carga será excluída permanentemente sem possibilidade de
              recuperação. As séries concluídas deste treino serão preservadas
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="w-full gap-3 sm:justify-stretch sm:*:flex-1">
            <AlertDialogCancel disabled={pending} variant="secondary">
              Cancelar
            </AlertDialogCancel>
            <Button disabled={pending} onClick={() => void remove()} variant="destructive">
              {pending && <LoaderCircleIcon className="animate-spin" />}
              {pending ? "Excluindo" : "Excluir"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  )
}
