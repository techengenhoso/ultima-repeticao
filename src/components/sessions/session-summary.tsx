"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import type { WorkoutSession } from "@/modules/sessions/domain/session"
import { SessionProgression } from "./session-progression"

export function SessionSummary({
  session,
  onUpdated,
}: {
  session: WorkoutSession
  onUpdated: (session: WorkoutSession) => void
}) {
  const [selected, setSelected] = useState<number | null>(null)
  const completed = session.exercises
    .flatMap(item => item.sets)
    .filter(set => set.completed && !set.warmup).length
  return (
    <div className="space-y-5">
      <p className="text-sm">
        {completed} séries de trabalho concluídas ·{" "}
        {session.completedAt
          ? new Date(session.completedAt).toLocaleString("pt-BR")
          : "Em andamento"}
      </p>
      {session.exercises.map((exercise, index) => (
        <section
          className="min-w-0 space-y-3 border bg-card p-3 sm:p-5"
          key={`${exercise.exerciseReference.source}:${exercise.exerciseReference.exerciseId}:${index}`}
        >
          <h2 className="wrap-break-word text-lg font-semibold">
            {exercise.exerciseSnapshot.name}
          </h2>
          <p className="text-sm">
            Meta: {exercise.targetSets} × {exercise.targetRepetitions} · RIR{" "}
            {exercise.targetRir ?? "não informado"}
          </p>
          <ul className="space-y-2 text-sm">
            {exercise.sets.map(set => (
              <li className="border-l-2 border-primary pl-3" key={set.setNumber}>
                Série {set.setNumber}
                {set.warmup ? " · Aquecimento" : ""}:{" "}
                {set.completed
                  ? `${set.load} kg × ${set.performedRepetitions} repetições · RIR ${set.perceivedRir ?? "não informado"}`
                  : "Não concluída"}
              </li>
            ))}
          </ul>
          {exercise.painReported && (
            <p className="text-sm text-destructive">Dor relatada · Progressão bloqueada</p>
          )}
          {exercise.decision && (
            <p className="text-sm">
              Próxima carga escolhida: {exercise.decision.load} kg ·{" "}
              {new Date(exercise.decision.decidedAt).toLocaleString("pt-BR")}
            </p>
          )}
          {session.status === "completed" && (
            <Button
              onClick={() => setSelected(selected === index ? null : index)}
              type="button"
              variant="outline"
            >
              {selected === index ? "Ocultar evolução" : "Evolução e próxima carga"}
            </Button>
          )}
          {selected === index && session.status === "completed" && (
            <SessionProgression index={index} onUpdated={onUpdated} session={session} />
          )}
        </section>
      ))}
    </div>
  )
}
