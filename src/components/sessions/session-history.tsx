"use client"

import Link from "next/link"
import { useCallback, useEffect, useRef, useState } from "react"
import { PageHeader } from "@/components/page-header"
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
  const [error, setError] = useState("")
  const mounted = useRef(true)
  const active = useRef(false)
  const load = useCallback(
    async (next?: string) => {
      if (active.current) return
      active.current = true
      setPending(true)
      setError("")
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
      } catch (failure) {
        if (mounted.current) setError(historyError(failure))
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
  return (
    <div className="space-y-6">
      <PageHeader
        description="Consulte suas sessões e abra um treino concluído para ver a evolução de cada exercício"
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
              <Link href={`/sessions/${encodeURIComponent(session.id)}`}>
                {session.status === "inProgress" ? "Retomar sessão" : "Ver desempenho"}
              </Link>
            </Button>
          </article>
        ))}
      </div>
      {pending && <output>Carregando histórico</output>}
      {!pending && !error && sessions.length === 0 && (
        <p className="text-sm text-muted-foreground">
          Nenhuma sessão registrada · Inicie um dia pelos detalhes da sua ficha
        </p>
      )}
      {error && (
        <div className="space-y-3" role="alert">
          <p className="text-sm text-destructive">{error}</p>
          <Button
            disabled={pending}
            onClick={() => void load(cursor ?? undefined)}
            type="button"
          >
            Tentar novamente
          </Button>
        </div>
      )}
      {cursor && !error && (
        <Button
          disabled={pending}
          onClick={() => void load(cursor)}
          type="button"
          variant="outline"
        >
          Carregar mais sessões
        </Button>
      )}
    </div>
  )
}
