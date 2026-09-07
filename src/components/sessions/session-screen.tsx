"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { toast } from "sonner"
import type { z } from "zod"
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
import {
  type SessionFormValues,
  sessionFormSchema,
  type WorkoutSession,
} from "@/modules/sessions/domain/session"
import { useSessionGateway } from "@/modules/sessions/presentation/session-gateway-context"
import { SessionExerciseForm } from "./session-exercise-form"
import { SessionSummary } from "./session-summary"

function SessionEditor({
  session,
  onUpdated,
}: {
  session: WorkoutSession
  onUpdated: (session: WorkoutSession) => void
}) {
  const gateway = useSessionGateway()
  const form = useForm<z.input<typeof sessionFormSchema>, unknown, SessionFormValues>({
    resolver: zodResolver(sessionFormSchema),
    defaultValues: { exercises: session.exercises },
    mode: "onBlur",
  })
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
  return (
    <FormProvider {...form}>
      <form
        className="space-y-5"
        onSubmit={form.handleSubmit(values => save("inProgress", values))}
      >
        <p className="text-sm text-muted-foreground">
          Salve o andamento antes de navegar para outra tela · Só sessões concluídas entram
          nas sugestões de carga
        </p>
        <fieldset className="min-w-0 space-y-5" disabled={pending}>
          {session.exercises.map((exercise, index) => (
            <SessionExerciseForm
              index={index}
              key={`${exercise.exerciseReference.source}:${exercise.exerciseReference.exerciseId}:${index}`}
            />
          ))}
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
        <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:flex-wrap">
          <Button disabled={pending} type="submit" variant="outline">
            Salvar andamento
          </Button>
          <Button
            disabled={pending}
            onClick={() => void form.handleSubmit(() => setConfirmation("completed"))()}
            type="button"
          >
            Concluir treino
          </Button>
          <Button
            disabled={pending}
            onClick={() => setConfirmation("cancelled")}
            type="button"
            variant="ghost"
          >
            Cancelar sessão
          </Button>
        </div>
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
  return (
    <div className="min-w-0 space-y-6">
      <PageHeader
        description={
          session
            ? `${session.workoutPlanName} · ${session.status === "inProgress" ? "Em andamento" : session.status === "completed" ? "Concluída" : "Cancelada"}`
            : "Registre seu desempenho"
        }
        title={session?.workoutDayName ?? "Sessão de treino"}
      />
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
          <SessionEditor key={session.id} onUpdated={setSession} session={session} />
        ) : (
          <SessionSummary onUpdated={setSession} session={session} />
        ))}
      <Button asChild variant="outline">
        <Link href="/history">Ir para o histórico</Link>
      </Button>
    </div>
  )
}
