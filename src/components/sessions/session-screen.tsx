"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeftIcon } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useCallback, useEffect, useRef, useState } from "react"
import { FormProvider, useForm, useWatch } from "react-hook-form"
import { toast } from "sonner"
import type { z } from "zod"
import { ConfirmationDialog } from "@/components/confirmation-dialog"
import { Skeletons } from "@/components/skeleton"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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

let finalizedSessionHandoff: WorkoutSession | null = null

function retainFinalizedSession(session: WorkoutSession) {
  finalizedSessionHandoff = session
}

function finalizedSessionFor(id: string) {
  return finalizedSessionHandoff?.id === id ? finalizedSessionHandoff : null
}

function discardFinalizedSession(id: string) {
  if (finalizedSessionHandoff?.id === id) finalizedSessionHandoff = null
}

const confirmationDetails: Record<
  SessionConfirmation,
  {
    confirmLabel: string
    description: string
    title: string
    variant: "default" | "destructive"
  }
> = {
  completed: {
    confirmLabel: "Concluir treino",
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
    variant: "destructive",
  },
  reload: {
    confirmLabel: "Recarregar treino",
    description:
      "As alterações ainda não salvas serão substituídas pela versão do servidor",
    title: "Recarregar treino",
    variant: "default",
  },
}

function formExercisesWithDefaultEffort(
  exercises: WorkoutSession["exercises"]
): SessionFormValues["exercises"] {
  return exercises.map(exercise => ({
    ...exercise,
    sets: exercise.sets.map(set =>
      set.warmup || set.completed || set.effortRating !== undefined
        ? set
        : { ...set, effortRating: "adequate" }
    ),
  }))
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
  onFinalized: (session: WorkoutSession) => void
  onUpdated: (session: WorkoutSession) => void
  onRestPrepared: (seconds?: number) => void
  onRestStarted: (seconds?: number) => void
}) {
  const gateway = useSessionGateway()
  const form = useForm<z.input<typeof sessionFormSchema>, unknown, SessionFormValues>({
    resolver: zodResolver(sessionFormSchema),
    defaultValues: { exercises: formExercisesWithDefaultEffort(session.exercises) },
    mode: "onBlur",
  })
  const exercises = useWatch({ control: form.control, name: "exercises" })
  const [activeExerciseIndex, setActiveExerciseIndex] = useState<number | null>(null)
  const [confirmation, setConfirmation] = useState<SessionConfirmation | null>(null)
  const [pending, setPending] = useState(false)
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

  async function finalizeSession(
    status: "completed" | "cancelled",
    values: SessionFormValues
  ) {
    if (draftToken)
      return gateway.mutate({
        action: "finalize",
        id: session.id,
        draftToken,
        status,
        exercises: values.exercises,
      })
    return gateway.mutate({
      action: "save",
      id: session.id,
      version: session.version,
      status,
      exercises: values.exercises,
    })
  }

  function handleFinalizedSession(
    status: "completed" | "cancelled",
    saved: WorkoutSession
  ) {
    form.reset({ exercises: saved.exercises })
    onFinalized(saved)
    onUpdated(saved)
    toast.success(status === "completed" ? "Treino concluído" : "Treino cancelado")
  }

  function handleFinalizationFailure(failure: unknown) {
    toast.error(
      failure instanceof Error
        ? failure.message
        : "Não foi possível finalizar, seus registros locais foram mantidos",
      !draftToken
        ? {
            action: {
              label: "Recarregar versão salva",
              onClick: reloadSavedSession,
            },
          }
        : undefined
    )
  }

  async function save(status: "completed" | "cancelled", values: SessionFormValues) {
    if (lock.current) return
    lock.current = true
    setPending(true)
    setConfirmation(null)
    try {
      const saved = await finalizeSession(status, values)
      handleFinalizedSession(status, saved)
    } catch (failure) {
      handleFinalizationFailure(failure)
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
        toast.error(
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

  function requestCompletion() {
    void form.handleSubmit(values => {
      if (values.exercises.every(hasCompletedAllWorkSets)) {
        void save("completed", values)
        return
      }
      setConfirmation("completed")
    })()
  }

  const allExercisesCompleted = exercises.every(hasCompletedAllWorkSets)

  const confirmationDetailsForCurrentState = confirmation
    ? confirmationDetails[confirmation]
    : null

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
        {activeExerciseIndex === null && (
          <Card aria-labelledby="finish-workout-title">
            <CardHeader>
              <div className="min-w-0 max-w-xl space-y-1">
                <p className="text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                  Finalização
                </p>
                <CardTitle className="text-lg" id="finish-workout-title">
                  {allExercisesCompleted
                    ? "Treino pronto para concluir"
                    : "Encerrar treino"}
                </CardTitle>
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
            </CardHeader>
            <CardContent>
              <div className="grid w-full gap-2 lg:w-auto lg:shrink-0 lg:grid-cols-2">
                <Button
                  className="w-full"
                  disabled={pending}
                  onClick={requestCompletion}
                  type="button"
                >
                  Concluir treino
                </Button>

                <Button
                  className="w-full"
                  disabled={pending}
                  onClick={() => setConfirmation("cancelled")}
                  type="button"
                  variant="secondary"
                >
                  Cancelar treino
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </form>
      <ConfirmationDialog
        cancelLabel="Voltar"
        confirmLabel={confirmationDetailsForCurrentState?.confirmLabel ?? "Confirmar"}
        confirmVariant={confirmationDetailsForCurrentState?.variant ?? "default"}
        description={confirmationDetailsForCurrentState?.description ?? ""}
        isPending={pending}
        onConfirm={confirmFinalization}
        onOpenChange={open => !open && setConfirmation(null)}
        open={confirmation !== null}
        pendingLabel="Salvando"
        title={confirmationDetailsForCurrentState?.title ?? "Confirmar ação"}
      />
    </FormProvider>
  )
}

export function SessionScreen({ id }: { id: string }) {
  const { user } = useUser()
  const [retry, setRetry] = useState(0)
  const retrySession = useCallback(() => setRetry(value => value + 1), [])
  return (
    <LoadedSession
      id={id}
      key={`${user.uid}:${id}:${retry}`}
      onRetry={retrySession}
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
  const pathname = usePathname()
  const router = useRouter()
  const [initialSession] = useState(() => finalizedSessionFor(id))
  const [session, setSession] = useState<WorkoutSession | null>(initialSession)
  const [draftToken, setDraftToken] = useState<string | null>(null)
  const [restTimer, setRestTimer] = useState({
    endsAt: null as number | null,
    seconds: 90,
  })
  const [hasLoadError, setHasLoadError] = useState(false)
  useEffect(() => {
    let current = true
    setDraftToken(null)
    setHasLoadError(false)
    const draft = draftStore.get(uid, id)
    const restTimerEndsAt = draftStore.getRestTimer(uid, id)
    if (restTimerEndsAt) setRestTimer(current => ({ ...current, endsAt: restTimerEndsAt }))
    if (draft) {
      setSession(draft.session)
      setDraftToken(draft.draftToken)
      return () => {
        current = false
      }
    }
    if (initialSession) {
      discardFinalizedSession(id)
      return () => {
        current = false
      }
    }
    setSession(null)
    gateway
      .load(id)
      .then(value => {
        if (current) setSession(value)
      })
      .catch(failure => {
        if (!current) return
        setHasLoadError(true)
        toast.error(
          failure instanceof Error ? failure.message : "Não foi possível carregar",
          {
            action: {
              label: "Tentar novamente",
              onClick: onRetry,
            },
          }
        )
      })
    return () => {
      current = false
    }
  }, [draftStore, gateway, id, initialSession, onRetry, uid])
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
      seconds: seconds ?? 90,
      endsAt: current.endsAt,
    }))
  }
  function startRestTimer(seconds?: number) {
    const duration = seconds ?? restTimer.seconds
    const endsAt = Date.now() + duration * 1000
    draftStore.saveRestTimer(uid, id, endsAt)
    setRestTimer(current => ({
      ...current,
      seconds: duration,
      endsAt,
    }))
  }
  const clearRestTimer = useCallback(() => {
    draftStore.removeRestTimer(uid, id)
    setRestTimer(current => ({ ...current, endsAt: null }))
  }, [draftStore, id, uid])
  useEffect(() => {
    if (!session) return
    const isWorkoutSession = pathname.startsWith("/workouts/sessions/")
    const isHistorySession = pathname.startsWith("/history/sessions/")
    const shouldShowInHistory = session.status !== "inProgress" && isWorkoutSession
    const shouldShowInWorkouts = session.status === "inProgress" && isHistorySession
    if (shouldShowInHistory || shouldShowInWorkouts) {
      const section = session.status === "inProgress" ? "workouts" : "history"
      router.replace(`/${section}/sessions/${encodeURIComponent(session.id)}`)
    }
  }, [pathname, router, session])

  return (
    <div className="mx-auto min-w-0 max-w-6xl space-y-5">
      <header className={session ? "border-b border-border pb-4" : undefined}>
        <Button asChild className="-ml-3" size="sm" variant="ghost">
          <Link href={session?.status === "inProgress" ? "/workouts" : "/history"}>
            <ArrowLeftIcon aria-hidden="true" />
            {session?.status === "inProgress" ? "Treinos" : "Histórico"}
          </Link>
        </Button>

        {session && (
          <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                Ficha {session.workoutPlanName}
              </p>

              <h1 className="wrap-break-word text-2xl font-bold tracking-tight sm:text-3xl">
                Treino {session.workoutDayName}
              </h1>
            </div>

            {session.status === "inProgress" && (
              <RestTimer endsAt={restTimer.endsAt} onCompleted={clearRestTimer} />
            )}
          </div>
        )}
      </header>

      {!session && !hasLoadError && <Skeletons />}

      {session &&
        (session.status === "inProgress" ? (
          <SessionEditor
            draftToken={draftToken}
            key={session.id}
            onDraftUpdated={updateDraft}
            onFinalized={finalized => {
              retainFinalizedSession(finalized)
              clearRestTimer()
              removeDraft()
            }}
            onRestPrepared={prepareRestTimer}
            onRestStarted={startRestTimer}
            onUpdated={setSession}
            session={session}
          />
        ) : (
          <SessionSummary onUpdated={setSession} session={session} />
        ))}
    </div>
  )
}
