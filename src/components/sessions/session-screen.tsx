"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeftIcon } from "lucide-react"
import Link from "next/link"
import { useCallback, useEffect, useRef, useState } from "react"
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
  sessionSchema,
  type WorkoutSession,
} from "@/modules/sessions/domain/session"
import { useSessionDraftStore } from "@/modules/sessions/presentation/session-draft-store-context"
import { useSessionGateway } from "@/modules/sessions/presentation/session-gateway-context"
import { RestTimer } from "./rest-timer"
import { SessionExerciseForm } from "./session-exercise-form"
import { hasCompletedAllWorkSets, SessionExercisePicker } from "./session-exercise-picker"
import { SessionSummary } from "./session-summary"

type SessionConfirmation = "completed" | "cancelled" | "reload"

const confirmationDetails: Record<
  SessionConfirmation,
  {
    confirmLabel: string
    description: string
    title: string
    variant: "default" | "red"
  }
> = {
  completed: {
    confirmLabel: "Confirmar",
    description:
      "Confira as séries marcadas como concluídas, séries incompletas serão preservadas e não indicarão perda de força",
    title: "Concluir treino",
    variant: "default",
  },
  cancelled: {
    confirmLabel: "Cancelar treino",
    description:
      "O treino ficará no histórico como cancelado e não será usado na progressão, alterações ainda não salvas serão descartadas",
    title: "Cancelar treino",
    variant: "red",
  },
  reload: {
    confirmLabel: "Confirmar",
    description:
      "As alterações ainda não salvas serão substituídas pela versão do servidor",
    title: "Recarregar treino",
    variant: "default",
  },
}

function SessionConfirmationDialog({
  confirmation,
  onConfirm,
  onOpenChange,
}: {
  confirmation: SessionConfirmation | null
  onConfirm: () => void
  onOpenChange: (open: boolean) => void
}) {
  const details = confirmation ? confirmationDetails[confirmation] : null
  return (
    <AlertDialog onOpenChange={onOpenChange} open={confirmation !== null}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{details?.title}</AlertDialogTitle>
          <AlertDialogDescription>{details?.description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Continuar registrando</AlertDialogCancel>
          <Button onClick={onConfirm} type="button" variant={details?.variant}>
            {details?.confirmLabel}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

function SessionEditor({
  session,
  draftToken,
  onDraftUpdated,
  onFinalized,
  onUpdated,
  onRestPrepared,
  onRestStarted,
}: {
  session: WorkoutSession
  draftToken: string | null
  onDraftUpdated: (session: WorkoutSession) => void
  onFinalized: () => void
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
  const [confirmation, setConfirmation] = useState<SessionConfirmation | null>(null)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState("")
  const [draftError, setDraftError] = useState("")
  const lock = useRef(false)
  const sessionRef = useRef(session)
  useEffect(() => {
    sessionRef.current = session
  }, [session])
  useEffect(() => {
    if (!draftToken || !form.formState.isDirty) return
    const draft = sessionSchema.safeParse({ ...sessionRef.current, exercises })
    if (!draft.success) return
    try {
      onDraftUpdated(draft.data)
      setDraftError("")
    } catch {
      setDraftError("Não foi possível salvar o rascunho neste dispositivo")
    }
  }, [draftToken, exercises, form.formState.isDirty, onDraftUpdated])
  async function save(status: "completed" | "cancelled", values: SessionFormValues) {
    if (lock.current) return
    lock.current = true
    setPending(true)
    setError("")
    setConfirmation(null)
    try {
      const saved = draftToken
        ? await gateway.mutate({
            action: "finalize",
            id: session.id,
            draftToken,
            status,
            exercises: values.exercises,
          })
        : await gateway.mutate({
            action: "save",
            id: session.id,
            version: session.version,
            status,
            exercises: values.exercises,
          })
      form.reset({ exercises: saved.exercises })
      if (draftToken) onFinalized()
      onUpdated(saved)
      toast.success(status === "completed" ? "Treino concluído" : "Treino cancelado")
    } catch (failure) {
      setError(
        failure instanceof Error
          ? failure.message
          : "Não foi possível finalizar, seus registros locais foram mantidos"
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
  function reloadSavedSession() {
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
          failure instanceof Error ? failure.message : "Não foi possível recarregar"
        )
      )
      .finally(() => setPending(false))
  }
  function confirmFinalization() {
    if (confirmation === "reload") {
      reloadSavedSession()
      return
    }
    if (confirmation === "cancelled") {
      void save("cancelled", { exercises: sessionRef.current.exercises })
      return
    }
    void form.handleSubmit(values => save("completed", values))()
  }
  const allExercisesCompleted = exercises.every(hasCompletedAllWorkSets)
  return (
    <FormProvider {...form}>
      <form className="space-y-4">
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
            {!draftToken && (
              <Button
                disabled={pending}
                onClick={() => setConfirmation("reload")}
                type="button"
                variant="outline"
              >
                Recarregar versão salva
              </Button>
            )}
          </div>
        )}
        {pending && <output className="block text-sm">Finalizando treino</output>}
        {activeExerciseIndex === null && (
          <section
            aria-labelledby="finish-workout-title"
            className="border bg-card p-4 sm:p-5"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="min-w-0 max-w-xl space-y-1">
                <p className="text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                  Finalização
                </p>
                <h2 className="text-lg font-semibold" id="finish-workout-title">
                  {allExercisesCompleted
                    ? "Treino pronto para concluir"
                    : "Encerrar treino"}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {draftToken
                    ? draftError ||
                      (allExercisesCompleted
                        ? "Todos os exercícios foram registrados neste dispositivo"
                        : "Seus registros ficam salvos neste dispositivo até você encerrar")
                    : allExercisesCompleted
                      ? "Todos os exercícios foram concluídos"
                      : "Só treinos concluídos entram nas sugestões de carga"}
                </p>
              </div>
              <div className="grid w-full gap-2 lg:w-auto lg:shrink-0 lg:grid-cols-2">
                <Button
                  className="w-full"
                  disabled={pending}
                  onClick={() =>
                    void form.handleSubmit(() => setConfirmation("completed"))()
                  }
                  type="button"
                >
                  Concluir treino
                </Button>

                <Button
                  className="w-full"
                  disabled={pending}
                  onClick={() => setConfirmation("cancelled")}
                  type="button"
                  variant="red"
                >
                  Cancelar treino
                </Button>
              </div>
            </div>
          </section>
        )}
      </form>
      <SessionConfirmationDialog
        confirmation={confirmation}
        onConfirm={confirmFinalization}
        onOpenChange={open => !open && setConfirmation(null)}
      />
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
      uid={user.uid}
    />
  )
}

function LoadedSession({
  id,
  onRetry,
  uid,
}: {
  id: string
  onRetry: () => void
  uid: string
}) {
  const gateway = useSessionGateway()
  const draftStore = useSessionDraftStore()
  const [session, setSession] = useState<WorkoutSession | null>(null)
  const [draftToken, setDraftToken] = useState<string | null>(null)
  const [restTimer, setRestTimer] = useState({ instance: 0, seconds: 90, signal: 0 })
  const [error, setError] = useState("")
  useEffect(() => {
    let current = true
    setSession(null)
    setDraftToken(null)
    setError("")
    const draft = draftStore.get(uid, id)
    if (draft) {
      setSession(draft.session)
      setDraftToken(draft.draftToken)
      return () => {
        current = false
      }
    }
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
  }, [draftStore, gateway, id, uid])
  const updateDraft = useCallback(
    (updated: WorkoutSession) => {
      if (!draftToken) return
      draftStore.save(uid, { session: updated, draftToken })
      setSession(updated)
    },
    [draftStore, draftToken, uid]
  )
  const removeDraft = useCallback(() => {
    draftStore.remove(uid, id)
    setDraftToken(null)
  }, [draftStore, id, uid])
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
              {session?.workoutDayName ?? "Treino"}
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
      {!session && !error && <output>Carregando treino</output>}
      {session &&
        (session.status === "inProgress" ? (
          <SessionEditor
            draftToken={draftToken}
            key={session.id}
            onDraftUpdated={updateDraft}
            onFinalized={removeDraft}
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
