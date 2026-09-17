"use client"

import { LoaderCircleIcon } from "lucide-react"
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
import { useUser } from "@/contexts/user-context"
import type { WorkoutSession } from "@/modules/sessions/domain/session"
import { useSessionGateway } from "@/modules/sessions/presentation/session-gateway-context"

export function SessionHistory({ title = "Histórico" }: { title?: string }) {
  const { user } = useUser()
  return <UserSessionHistory key={user.uid} title={title} />
}
const historyError = (failure: unknown) =>
  failure instanceof Error ? failure.message : "Não foi possível carregar o histórico"
function UserSessionHistory({ title }: { title: string }) {
  const gateway = useSessionGateway()
  const [sessions, setSessions] = useState<WorkoutSession[]>([])
  const [cursor, setCursor] = useState<string | null>(null)
  const [pending, setPending] = useState(true)
  const [hasLoaded, setHasLoaded] = useState(false)
  const [deleting, setDeleting] = useState<WorkoutSession | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const mounted = useRef(true)
  const active = useRef(false)
  const load = useCallback(
    async (next?: string) => {
      if (active.current) return
      active.current = true
      setPending(true)
      try {
        const result = await gateway.list(next)
        if (!mounted.current) return
        setSessions(current =>
          next
            ? [
                ...current,
                ...result.sessions.filter(
                  item => !current.some(previous => previous.id === item.id)
                ),
              ]
            : result.sessions
        )
        setCursor(result.nextCursor)
        setHasLoaded(true)
      } catch (failure) {
        if (!mounted.current) return
        toast.error(historyError(failure), {
          action: {
            label: "Tentar novamente",
            onClick: () => void load(next),
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
    void load()
    return () => {
      mounted.current = false
    }
  }, [load])

  async function confirmDelete() {
    if (!deleting) return
    setIsDeleting(true)
    try {
      await gateway.delete(deleting.id)
      setDeleting(null)
      toast.success("Treino excluído")
      await load()
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
      <Button asChild variant="outline">
        <Link href="/workouts">Escolher treino para iniciar</Link>
      </Button>
      <div className="grid gap-4 sm:grid-cols-2">
        {sessions.map(session => (
          <article className="min-w-0 space-y-3 border bg-card p-4" key={session.id}>
            <h2 className="wrap-break-word font-semibold">
              {session.workoutPlanName} · {session.workoutDayName}
            </h2>
            <p className="text-sm">
              {new Date(session.startedAt).toLocaleString("pt-BR")}
            </p>
            <p className="text-sm text-muted-foreground">
              {session.status === "inProgress"
                ? "Em andamento"
                : session.status === "completed"
                  ? "Concluída"
                  : "Cancelada"}{" "}
              ·{" "}
              {
                session.exercises
                  .flatMap(item => item.sets)
                  .filter(set => set.completed && !set.warmup).length
              }{" "}
              séries de trabalho concluídas
            </p>
            <Button asChild className="w-full" variant="outline">
              <Link href={`/workouts/sessions/${encodeURIComponent(session.id)}`}>
                {session.status === "inProgress" ? "Retomar treino" : "Ver desempenho"}
              </Link>
            </Button>
            <Button
              aria-label={`Excluir ${session.workoutPlanName} de ${session.workoutDayName}`}
              className="w-full"
              onClick={() => setDeleting(session)}
              type="button"
              variant="destructive"
            >
              Excluir treino
            </Button>
          </article>
        ))}
      </div>
      {pending && <output>Carregando histórico</output>}
      {!pending && hasLoaded && sessions.length === 0 && (
        <p className="text-sm text-muted-foreground">
          Nenhum treino registrado · Inicie um dia pelos detalhes da sua ficha
        </p>
      )}
      {cursor && (
        <Button
          disabled={pending}
          onClick={() => void load(cursor)}
          type="button"
          variant="outline"
        >
          Carregar mais treinos
        </Button>
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
