"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeftIcon } from "lucide-react"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { FormProvider, useForm, useWatch } from "react-hook-form"
import { toast } from "sonner"
import type { z } from "zod"
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
import {
  type SessionFormValues,
  sessionFormSchema,
  type WorkoutSession,
} from "@/modules/sessions/domain/session"
import { useSessionGateway } from "@/modules/sessions/presentation/session-gateway-context"
import { RestTimer } from "./rest-timer"
import { SessionExerciseForm } from "./session-exercise-form"
import { hasCompletedAllWorkSets, SessionExercisePicker } from "./session-exercise-picker"
import { SessionSummary } from "./session-summary"

function SessionEditor({
  session,
  onUpdated,
  onRestPrepared,
  onRestStarted,
}: {
  session: WorkoutSession
  onUpdated: (session: WorkoutSession) => void
  onRestPrepared: (seconds?: number) => void
  onRestStarted: (seconds?: number) => void
}) {
  const gateway = useSessionGateway()
  const form = useForm<z.input<typeof sessionFormSchema>, unknown, SessionFormValues>({
    resolver: zodResolver(sessionFormSchema),
    defaultValues: { exercises: session.exercises },
    mode: "onBlur",
  })
  const exercises = useWatch({ control: form.control, name: "exercises" })
  const [activeExerciseIndex, setActiveExerciseIndex] = useState<number | null>(null)
  const [confirmation, setConfirmation] = useState<
    "completed" | "cancelled" | "reload" | null
  >(null)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState("")
  const lock = useRef(false)
  useEffect(() => {
    if (!form.formState.isDirty) return
    const beforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault()
      event.returnValue = ""
    }
    window.addEventListener("beforeunload", beforeUnload)
    return () => window.removeEventListener("beforeunload", beforeUnload)
  }, [form.formState.isDirty])
  async function save(
    status: "inProgress" | "completed" | "cancelled",
    values: SessionFormValues
  ) {
    if (lock.current) return
    lock.current = true
    setPending(true)
    setError("")
    setConfirmation(null)
    try {
      const saved = await gateway.mutate({
        action: "save",
        id: session.id,
        version: session.version,
        status,
        exercises: values.exercises,
      })
      form.reset({ exercises: saved.exercises })
      onUpdated(saved)
      toast.success(
        status === "inProgress"
          ? "Andamento salvo"
          : status === "completed"
            ? "Treino concluído"
            : "Sessão cancelada"
      )
    } catch (failure) {
      setError(
        failure instanceof Error
          ? failure.message
          : "Não foi possível salvar, seus registros foram mantidos"
      )
    } finally {
      lock.current = false
      setPending(false)
    }
  }
  function selectNextUnfinishedExercise(currentIndex: number) {
    const next = [
      ...exercises.slice(currentIndex + 1),
      ...exercises.slice(0, currentIndex),
    ]
      .map((exercise, offset) => ({
        index: (currentIndex + offset + 1) % exercises.length,
        exercise,
      }))
      .find(({ exercise }) => !hasCompletedAllWorkSets(exercise))
    setActiveExerciseIndex(next?.index ?? null)
  }
  function selectExercise(index: number) {
    onRestPrepared(exercises[index]?.restSeconds)
    setActiveExerciseIndex(index)
  }
  const allExercisesCompleted = exercises.every(hasCompletedAllWorkSets)
  return (
    <FormProvider {...form}>
      <form
        className="space-y-4"
        onSubmit={form.handleSubmit(values => save("inProgress", values))}
      >
        <fieldset className="min-w-0" disabled={pending}>
          {activeExerciseIndex === null ? (
            <SessionExercisePicker exercises={exercises} onSelect={selectExercise} />
          ) : (
            <SessionExerciseForm
              index={activeExerciseIndex}
              onBack={() => setActiveExerciseIndex(null)}
              onSeriesCompleted={onRestStarted}
              onWorkSetsCompleted={() => selectNextUnfinishedExercise(activeExerciseIndex)}
              totalExercises={exercises.length}
            />
          )}
        </fieldset>
        {error && (
          <div className="space-y-2 text-sm text-destructive" role="alert">
            <p>{error}</p>
            <Button
              disabled={pending}
              onClick={() => setConfirmation("reload")}
              type="button"
              variant="outline"
            >
              Recarregar versão salva
            </Button>
          </div>
        )}
        {pending && <output className="block text-sm">Salvando sessão</output>}
        {activeExerciseIndex === null && (
          <div className="sticky bottom-3 z-10 flex flex-col gap-2 border border-border bg-background/95 p-2 shadow-sm backdrop-blur sm:flex-row sm:items-center sm:justify-between">
            <p className="px-2 text-xs text-muted-foreground">
              {allExercisesCompleted
                ? "Todos os exercícios estão concluídos"
                : "Salve antes de sair · Só sessões concluídas entram nas sugestões de carga"}
            </p>
            <div className="flex flex-wrap gap-2">
              <Button disabled={pending} size="sm" type="submit" variant="secondary">
                Salvar andamento
              </Button>

              <Button
                disabled={pending}
                onClick={() =>
                  void form.handleSubmit(() => setConfirmation("completed"))()
                }
                size="sm"
                type="button"
              >
                Concluir treino
              </Button>

              <Button
                disabled={pending}
                onClick={() => setConfirmation("cancelled")}
                size="sm"
                type="button"
                variant="red"
              >
                Cancelar
              </Button>
            </div>
          </div>
        )}
      </form>
      <AlertDialog
        onOpenChange={open => !open && setConfirmation(null)}
        open={confirmation !== null}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmation === "completed"
                ? "Concluir treino"
                : confirmation === "reload"
                  ? "Recarregar sessão"
                  : "Cancelar sessão"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmation === "completed"
                ? "Confira as séries marcadas como concluídas, séries incompletas serão preservadas e não indicarão perda de força"
                : confirmation === "reload"
                  ? "As alterações ainda não salvas serão substituídas pela versão do servidor"
                  : "A sessão ficará no histórico como cancelada e não será usada na progressão, alterações ainda não salvas serão descartadas"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continuar registrando</AlertDialogCancel>
            <Button
              onClick={() => {
                if (confirmation === "reload") {
                  setConfirmation(null)
                  setPending(true)
                  void gateway
                    .load(session.id)
                    .then(saved => {
                      form.reset({ exercises: saved.exercises })
                      onUpdated(saved)
                    })
                    .catch(failure =>
                      setError(
                        failure instanceof Error
                          ? failure.message
                          : "Não foi possível recarregar"
                      )
                    )
                    .finally(() => setPending(false))
                } else if (confirmation === "cancelled")
                  void save("cancelled", { exercises: session.exercises })
                else void form.handleSubmit(values => save("completed", values))()
              }}
              type="button"
            >
              Confirmar
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </FormProvider>
  )
}

export function SessionScreen({ id }: { id: string }) {
  const { user } = useUser()
  const [retry, setRetry] = useState(0)
  return (
    <LoadedSession
      id={id}
      key={`${user.uid}:${id}:${retry}`}
      onRetry={() => setRetry(value => value + 1)}
    />
  )
}

function LoadedSession({ id, onRetry }: { id: string; onRetry: () => void }) {
  const gateway = useSessionGateway()
  const [session, setSession] = useState<WorkoutSession | null>(null)
  const [restTimer, setRestTimer] = useState({ instance: 0, seconds: 90, signal: 0 })
  const [error, setError] = useState("")
  useEffect(() => {
    let current = true
    setSession(null)
    setError("")
    gateway
      .load(id)
      .then(value => {
        if (current) setSession(value)
      })
      .catch(failure => {
        if (current)
          setError(
            failure instanceof Error ? failure.message : "Não foi possível carregar"
          )
      })
    return () => {
      current = false
    }
  }, [gateway, id])
  function prepareRestTimer(seconds?: number) {
    setRestTimer(current => ({
      instance: current.instance + 1,
      seconds: seconds ?? 90,
      signal: 0,
    }))
  }
  function startRestTimer(seconds?: number) {
    setRestTimer(current => ({
      ...current,
      seconds: seconds ?? current.seconds,
      signal: current.signal + 1,
    }))
  }
  return (
    <div className="mx-auto min-w-0 max-w-6xl space-y-5">
      <header className="border-b border-border pb-4">
        <Button asChild className="-ml-3" size="sm" variant="ghost">
          <Link href="/workouts">
            <ArrowLeftIcon aria-hidden="true" />
            Treinos
          </Link>
        </Button>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">
              {session?.workoutPlanName ?? "Treino"}
            </p>
            <h1 className="wrap-break-word text-2xl font-bold tracking-tight sm:text-3xl">
              {session?.workoutDayName ?? "Sessão de treino"}
            </h1>
          </div>
          {session?.status === "inProgress" && (
            <RestTimer
              key={restTimer.instance}
              seconds={restTimer.seconds}
              startSignal={restTimer.signal}
            />
          )}
        </div>
      </header>
      {error && (
        <div className="space-y-3" role="alert">
          <p className="text-sm text-destructive">{error}</p>
          <Button onClick={onRetry} type="button">
            Tentar novamente
          </Button>
        </div>
      )}
      {!session && !error && <output>Carregando sessão</output>}
      {session &&
        (session.status === "inProgress" ? (
          <SessionEditor
            key={session.id}
            onRestPrepared={prepareRestTimer}
            onRestStarted={startRestTimer}
            onUpdated={setSession}
            session={session}
          />
        ) : (
          <SessionSummary onUpdated={setSession} session={session} />
        ))}
      {session?.status !== "inProgress" && (
        <Button asChild size="sm" variant="outline">
          <Link href="/history">Ir para o histórico</Link>
        </Button>
      )}
    </div>
  )
}
