"use client"

import { EyeIcon, Trash2Icon } from "lucide-react"
import Link from "next/link"
import { useCallback, useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import { PageHeader } from "@/components/page-header"
import { Skeletons } from "@/components/skeleton"
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
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty"
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

function SessionPagination({
  cursor,
  hasLoaded,
  onPageChange,
  page,
  pageCursors,
  pending,
}: {
  cursor: string | null
  hasLoaded: boolean
  onPageChange: (targetPage: number, targetCursor?: string) => void
  page: number
  pageCursors: (string | undefined)[]
  pending: boolean
}) {
  const isFirstPage = page === 0
  const isLastPage = !cursor

  if (!hasLoaded) return null

  return (
    <CardFooter className="justify-center">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              aria-disabled={isFirstPage || pending}
              className={
                isFirstPage || pending ? "pointer-events-none opacity-50" : undefined
              }
              href="#history-list"
              onClick={event => {
                event.preventDefault()
                if (!isFirstPage && !pending) onPageChange(page - 1, pageCursors[page - 1])
              }}
              tabIndex={isFirstPage || pending ? -1 : undefined}
              text="Anterior"
            />
          </PaginationItem>

          {pageCursors.map((pageCursor, index) => (
            <PaginationItem key={pageCursor ?? "first-page"}>
              <PaginationLink
                aria-disabled={pending}
                className={pending ? "pointer-events-none opacity-50" : undefined}
                href="#history-list"
                isActive={index === page}
                onClick={event => {
                  event.preventDefault()
                  if (index !== page && !pending) onPageChange(index, pageCursor)
                }}
                tabIndex={pending ? -1 : undefined}
              >
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              aria-disabled={isLastPage || pending}
              className={
                isLastPage || pending ? "pointer-events-none opacity-50" : undefined
              }
              href="#history-list"
              onClick={event => {
                event.preventDefault()
                if (!isLastPage && !pending) onPageChange(page + 1, cursor)
              }}
              tabIndex={isLastPage || pending ? -1 : undefined}
              text="Próxima"
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </CardFooter>
  )
}

function SessionHistoryList({
  cursor,
  onDelete,
  onPageChange,
  page,
  pageCursors,
  pending,
  sessions,
}: {
  cursor: string | null
  onDelete: (session: WorkoutSession) => void
  onPageChange: (targetPage: number, targetCursor?: string) => void
  page: number
  pageCursors: (string | undefined)[]
  pending: boolean
  sessions: WorkoutSession[]
}) {
  return (
    <section aria-labelledby="history-list-title" id="history-list">
      <Card>
        <CardContent>
          <ItemGroup>
            {sessions.map(session => (
              <Item key={session.id} variant="muted">
                <ItemContent>
                  <ItemTitle>{session.workoutPlanName}</ItemTitle>
                  <ItemDescription>
                    {session.workoutDayName} · {formatSessionDate(session)} ·{" "}
                    {sessionStatusLabel(session.status)} · {completedWorkSets(session)}{" "}
                    séries
                  </ItemDescription>
                </ItemContent>

                <ItemActions className="shrink-0 gap-1">
                  <Button
                    aria-label={
                      session.status === "inProgress"
                        ? "Retomar treino"
                        : "Ver desempenho do treino"
                    }
                    asChild
                    className="size-9 px-0 sm:w-auto sm:px-4"
                    size="sm"
                    variant="secondary"
                  >
                    <Link
                      href={
                        session.status === "inProgress"
                          ? `/workouts/sessions/${encodeURIComponent(session.id)}`
                          : `/history/sessions/${encodeURIComponent(session.id)}`
                      }
                    >
                      <EyeIcon aria-hidden="true" className="sm:hidden" />
                      <span className="hidden sm:inline">
                        {session.status === "inProgress"
                          ? "Retomar treino"
                          : "Ver desempenho"}
                      </span>
                    </Link>
                  </Button>

                  <Button
                    aria-label="Excluir treino"
                    onClick={() => onDelete(session)}
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

        <SessionPagination
          cursor={cursor}
          hasLoaded
          onPageChange={onPageChange}
          page={page}
          pageCursors={pageCursors}
          pending={pending}
        />
      </Card>
    </section>
  )
}

function SessionHistoryContent({
  cursor,
  error,
  hasLoaded,
  onDelete,
  onPageChange,
  onRetry,
  page,
  pageCursors,
  pending,
  sessions,
}: {
  cursor: string | null
  error: string
  hasLoaded: boolean
  onDelete: (session: WorkoutSession) => void
  onPageChange: (targetPage: number, targetCursor?: string) => void
  onRetry: () => void
  page: number
  pageCursors: (string | undefined)[]
  pending: boolean
  sessions: WorkoutSession[]
}) {
  if (pending && !hasLoaded) return <Skeletons />

  if (error && !hasLoaded)
    return (
      <div role="alert">
        <p className="text-destructive">{error} Tivemos um erro</p>
        <Button className="mt-2" onClick={onRetry} variant="secondary">
          Tentar novamente
        </Button>
      </div>
    )

  if (!hasLoaded) return null

  if (!sessions.length)
    return (
      <Empty className="border">
        <EmptyHeader>
          <EmptyTitle>Seu histórico está vazio</EmptyTitle>
          <EmptyDescription>Finalize um treino para poder acompanhar</EmptyDescription>
        </EmptyHeader>
      </Empty>
    )

  return (
    <SessionHistoryList
      cursor={cursor}
      onDelete={onDelete}
      onPageChange={onPageChange}
      page={page}
      pageCursors={pageCursors}
      pending={pending}
      sessions={sessions}
    />
  )
}

function UserSessionHistory({ title }: { title: string }) {
  const gateway = useSessionGateway()
  const [sessions, setSessions] = useState<WorkoutSession[]>([])
  const [page, setPage] = useState(0)
  const [pageCursors, setPageCursors] = useState<(string | undefined)[]>([undefined])
  const [cursor, setCursor] = useState<string | null>(null)
  const [pending, setPending] = useState(true)
  const [hasLoaded, setHasLoaded] = useState(false)
  const [error, setError] = useState("")
  const [deleting, setDeleting] = useState<WorkoutSession | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const mounted = useRef(true)
  const active = useRef(false)
  const hasLoadedRef = useRef(false)
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
        hasLoadedRef.current = true
        setError("")
      } catch (failure) {
        if (!mounted.current) return
        const message = historyError(failure)
        if (hasLoadedRef.current)
          toast.error(message, {
            action: {
              label: "Tentar novamente",
              onClick: () => void loadPage(targetPage, targetCursor),
            },
          })
        else setError(message)
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

      <SessionHistoryContent
        cursor={cursor}
        error={error}
        hasLoaded={hasLoaded}
        onDelete={setDeleting}
        onPageChange={(targetPage, targetCursor) =>
          void loadPage(targetPage, targetCursor)
        }
        onRetry={() => void loadPage(page, pageCursors[page])}
        page={page}
        pageCursors={pageCursors}
        pending={pending}
        sessions={sessions}
      />

      <AlertDialog
        onOpenChange={open => !open && !isDeleting && setDeleting(null)}
        open={!!deleting}
      >
        <AlertDialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto">
          <AlertDialogHeader className="sm:group-data-[size=default]/alert-dialog-content:place-items-center sm:group-data-[size=default]/alert-dialog-content:text-center">
            <AlertDialogTitle>Exclusão permanente</AlertDialogTitle>

            <AlertDialogDescription>
              Este treino será excluído permanentemente sem possibilidade de recuperação
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="w-full gap-3 sm:justify-stretch sm:*:flex-1">
            <AlertDialogCancel disabled={isDeleting} variant="secondary">
              Cancelar
            </AlertDialogCancel>

            <AlertDialogAction
              disabled={isDeleting}
              onClick={() => void confirmDelete()}
              variant="destructive"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
