"use client"

import { EyeIcon, LoaderCircleIcon, Trash2Icon } from "lucide-react"
import Link from "next/link"
import { useCallback, useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import { PageHeader } from "@/components/page-header"
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
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useUser } from "@/contexts/user-context"
import type { WorkoutSession } from "@/modules/sessions/domain/session"
import { useSessionGateway } from "@/modules/sessions/presentation/session-gateway-context"

export function SessionHistory({ title = "Histórico" }: { title?: string }) {
  const { user } = useUser()
  return <UserSessionHistory key={user.uid} title={title} />
}

const historyError = (failure: unknown) =>
  failure instanceof Error ? failure.message : "Não foi possível carregar o histórico"

const sessionStatusLabel = (status: WorkoutSession["status"]) => {
  if (status === "inProgress") return "Em andamento"
  return status === "completed" ? "Finalizada" : "Cancelada"
}

const completedWorkSets = (session: WorkoutSession) =>
  session.exercises
    .flatMap(exercise => exercise.sets)
    .filter(set => set.completed && !set.warmup).length

const formatSessionDate = (session: WorkoutSession) =>
  new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(session.completedAt ?? session.startedAt))

function UserSessionHistory({ title }: { title: string }) {
  const gateway = useSessionGateway()
  const [sessions, setSessions] = useState<WorkoutSession[]>([])
  const [page, setPage] = useState(0)
  const [pageCursors, setPageCursors] = useState<(string | undefined)[]>([undefined])
  const [cursor, setCursor] = useState<string | null>(null)
  const [pending, setPending] = useState(true)
  const [hasLoaded, setHasLoaded] = useState(false)
  const [deleting, setDeleting] = useState<WorkoutSession | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const mounted = useRef(true)
  const active = useRef(false)
  const loadPage = useCallback(
    async (targetPage: number, targetCursor?: string) => {
      if (active.current) return
      active.current = true
      setPending(true)
      try {
        const result = await gateway.list(targetCursor)
        if (!mounted.current) return
        setSessions(result.sessions)
        setPage(targetPage)
        setCursor(result.nextCursor)
        setPageCursors(current => {
          const cursors = current.slice(0, targetPage + 1)
          if (result.nextCursor) cursors[targetPage + 1] = result.nextCursor
          return cursors
        })
        setHasLoaded(true)
      } catch (failure) {
        if (!mounted.current) return
        toast.error(historyError(failure), {
          action: {
            label: "Tentar novamente",
            onClick: () => void loadPage(targetPage, targetCursor),
          },
        })
      } finally {
        active.current = false
        if (mounted.current) setPending(false)
      }
    },
    [gateway]
  )
  useEffect(() => {
    mounted.current = true
    void loadPage(0)
    return () => {
      mounted.current = false
    }
  }, [loadPage])

  async function confirmDelete() {
    if (!deleting) return
    setIsDeleting(true)
    try {
      await gateway.delete(deleting.id)
      setDeleting(null)
      toast.success("Treino excluído")
      const previousPage = page > 0 && sessions.length === 1
      const targetPage = previousPage ? page - 1 : page
      await loadPage(targetPage, pageCursors[targetPage])
    } catch (failure) {
      toast.error(historyError(failure))
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        description="Consulte seus treinos e abra um treino concluído para ver a evolução de cada exercício"
        title={title}
      />

      <section
        aria-labelledby="history-list-title"
        className="space-y-4"
        id="history-list"
      >
        {hasLoaded && sessions.length > 0 && (
          <Table className="table-fixed">
            <colgroup className="justify-between">
              <col className="" />
              <col className="" />
              <col className="hidden lg:table-column" />
              <col className="hidden sm:table-column" />
              <col className="" />
            </colgroup>

            <TableHeader className="border-y bg-muted/40 [&_tr]:border-0">
              <TableRow className="h-12">
                <TableHead className="text-center">Treino</TableHead>

                <TableHead className="text-center">Data</TableHead>

                <TableHead className="text-center hidden lg:table-cell">Status</TableHead>

                <TableHead className="text-center hidden sm:table-cell">Séries</TableHead>

                <TableHead className="text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {sessions.map(session => (
                <TableRow key={session.id}>
                  <TableCell className="text-center whitespace-normal">
                    <p className="font-medium">{session.workoutPlanName}</p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {session.workoutDayName}
                    </p>
                  </TableCell>

                  <TableCell className="text-center text-muted-foreground">
                    {formatSessionDate(session)}
                  </TableCell>

                  <TableCell className="text-center hidden lg:table-cell">
                    <span className="inline-flex rounded-full bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                      {sessionStatusLabel(session.status)}
                    </span>
                  </TableCell>

                  <TableCell className="text-center hidden tabular-nums sm:table-cell">
                    {completedWorkSets(session)}
                  </TableCell>

                  <TableCell className="text-center">
                    <div className="flex justify-end gap-2">
                      <Button
                        asChild
                        className="xl:w-auto xl:px-4"
                        size="icon-sm"
                        variant="outline"
                      >
                        <Link
                          href={
                            session.status === "inProgress"
                              ? `/workouts/sessions/${encodeURIComponent(session.id)}`
                              : `/history/sessions/${encodeURIComponent(session.id)}`
                          }
                        >
                          <EyeIcon className="xl:hidden" />

                          <span className="hidden xl:inline">
                            {session.status === "inProgress"
                              ? "Retomar treino"
                              : "Ver desempenho"}
                          </span>
                        </Link>
                      </Button>

                      <Button
                        onClick={() => setDeleting(session)}
                        size="icon-sm"
                        type="button"
                        variant="destructive"
                      >
                        <Trash2Icon />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {pending && (
          <output className="text-sm text-muted-foreground">Carregando histórico</output>
        )}
      </section>

      {!pending && hasLoaded && sessions.length === 0 && (
        <p className="text-sm text-muted-foreground">
          Nenhum treino registrado · Inicie um dia pelos detalhes da sua ficha
        </p>
      )}

      {hasLoaded && (page > 0 || cursor) && (
        <Pagination aria-label="Paginação do histórico">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                aria-disabled={page === 0 || pending}
                href="#history-list"
                onClick={event => {
                  event.preventDefault()
                  if (page > 0 && !pending) void loadPage(page - 1, pageCursors[page - 1])
                }}
                text="Anterior"
              />
            </PaginationItem>

            <PaginationItem>
              <PaginationLink
                href="#history-list"
                isActive
                onClick={event => event.preventDefault()}
              >
                {page + 1}
              </PaginationLink>
            </PaginationItem>

            <PaginationItem>
              <PaginationNext
                aria-disabled={!cursor || pending}
                href="#history-list"
                onClick={event => {
                  event.preventDefault()
                  if (cursor && !pending) void loadPage(page + 1, cursor)
                }}
                text="Próxima"
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      <AlertDialog
        onOpenChange={open => !open && !isDeleting && setDeleting(null)}
        open={!!deleting}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir treino</AlertDialogTitle>

            <AlertDialogDescription>
              O treino “{deleting?.workoutPlanName} · {deleting?.workoutDayName}” será
              excluído permanentemente. Esta ação não poderá ser desfeita
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>

            <Button disabled={isDeleting} onClick={confirmDelete} variant="destructive">
              {isDeleting && <LoaderCircleIcon className="animate-spin" />}
              {isDeleting ? "Excluindo" : "Excluir"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
