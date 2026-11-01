"use client"

import { ArrowLeftIcon } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useCallback, useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import { Skeletons } from "@/components/skeleton"
import { Button } from "@/components/ui/button"
import { useUser } from "@/contexts/user-context"
import type { WorkoutSession } from "@/modules/sessions/domain/session"
import { useSessionDraftStore } from "@/modules/sessions/presentation/session-draft-store-context"
import { useSessionGateway } from "@/modules/sessions/presentation/session-gateway-context"
import { useSessionRestTimer } from "@/modules/sessions/presentation/use-session-rest-timer"
import { RestTimer } from "./rest-timer"
import { SessionDuration } from "./session-duration"
import { SessionEditor } from "./session-editor"
import { SessionSummary } from "./session-summary"

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
  const restTimer = useSessionRestTimer(uid, id)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const [hasLoadError, setHasLoadError] = useState(false)
  useEffect(() => {
    let current = true
    setDraftToken(null)
    setHasLoadError(false)
    const draft = draftStore.get(uid, id)
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

              <h1
                className="wrap-break-word text-2xl font-bold tracking-tight sm:text-3xl"
                ref={headingRef}
                tabIndex={-1}
              >
                Treino {session.workoutDayName}
              </h1>
            </div>

            {session.status === "inProgress" && (
              <div className="flex min-w-0 flex-wrap items-center gap-2">
                <RestTimer
                  completionFocusRef={headingRef}
                  endsAt={restTimer.endsAt}
                  onAdjust={restTimer.adjust}
                  onCompleted={restTimer.clear}
                  onOpenChange={restTimer.setOpen}
                  open={restTimer.open}
                />

                <SessionDuration startedAt={session.startedAt} />
              </div>
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
              restTimer.clear()
              removeDraft()
            }}
            onRestPrepared={restTimer.prepare}
            onRestStarted={restTimer.start}
            onUpdated={setSession}
            session={session}
          />
        ) : (
          <SessionSummary onUpdated={setSession} session={session} />
        ))}
    </div>
  )
}
