"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useRef, useState } from "react"
import { FormProvider, useForm, useWatch } from "react-hook-form"
import { toast } from "sonner"
import type { z } from "zod"
import { ConfirmationDialog } from "@/components/confirmation-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  type SessionFormValues,
  sessionFormSchema,
  sessionSchema,
  type WorkoutSession,
} from "@/modules/sessions/domain/session"
import { useSessionGateway } from "@/modules/sessions/presentation/session-gateway-context"
import { SessionExerciseCarousel } from "./session-exercise-carousel"
import { hasCompletedAllWorkSets, SessionExercisePicker } from "./session-exercise-picker"

type SessionConfirmation = "completed" | "cancelled" | "reload"

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

export function SessionEditor({
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
    if (next) selectExercise(next.index)
    else setActiveExerciseIndex(null)
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
            <SessionExerciseCarousel
              activeIndex={activeExerciseIndex}
              onBack={() => setActiveExerciseIndex(null)}
              onSelect={selectExercise}
              onSeriesCompleted={onRestStarted}
              onWorkSetsCompleted={selectNextUnfinishedExercise}
              pending={pending}
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
