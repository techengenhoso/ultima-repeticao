import { parseRepetitions } from "@/modules/workouts/domain/repetitions"
import { exerciseFromLatestSession, suggestLoad } from "./progression"
import { type SessionCommand, type SessionExercise, type WorkoutSession } from "./session"

export class SessionDomainError extends Error {}

export function applyPerformance(
  session: WorkoutSession,
  command: Extract<SessionCommand, { action: "save" }>,
  completedAt: number
): WorkoutSession {
  if (session.status !== "inProgress")
    throw new SessionDomainError("Este treino já foi encerrado, recarregue para conferir")
  if (session.exercises.length !== command.exercises.length)
    throw new SessionDomainError("A lista de exercícios do treino não pode ser alterada")
  const exercises = session.exercises.map((exercise, index) => {
    const incoming = command.exercises[index]
    if (!incoming || incoming.sets.length !== exercise.sets.length)
      throw new SessionDomainError(
        "As séries planejadas do treino não podem ser alteradas"
      )
    if (
      incoming.exerciseReference.source !== exercise.exerciseReference.source ||
      incoming.exerciseReference.exerciseId !== exercise.exerciseReference.exerciseId
    )
      throw new SessionDomainError(
        "A identidade do exercício do treino não pode ser alterada"
      )
    return {
      ...exercise,
      sets: incoming.sets.map((set, setIndex) => {
        const planned = exercise.sets[setIndex]
        if (
          !planned ||
          set.setNumber !== planned.setNumber ||
          set.warmup !== planned.warmup
        )
          throw new SessionDomainError(
            "A sequência das séries do treino não pode ser alterada"
          )
        return {
          ...set,
          targetRepetitions: planned.targetRepetitions,
        }
      }),
    }
  })
  if (
    command.status === "completed" &&
    !exercises.some(item => item.sets.some(set => set.completed && !set.warmup))
  )
    throw new SessionDomainError(
      "Conclua pelo menos uma série de trabalho ou cancele o treino"
    )
  return {
    ...session,
    exercises,
    status: command.status,
    ...(command.status === "inProgress" ? {} : { completedAt }),
  }
}

export function applyLoadDecision(
  session: WorkoutSession,
  exerciseIndex: number,
  command: Extract<SessionCommand, { action: "decide" }>,
  latestSession: WorkoutSession | null,
  decidedAt: number
): WorkoutSession {
  if (session.status !== "completed")
    throw new SessionDomainError("Conclua o treino antes de escolher a próxima carga")
  const exercise = session.exercises[exerciseIndex]
  if (!exercise) throw new SessionDomainError("Exercício não encontrado")
  if (exercise.decision)
    throw new SessionDomainError("A próxima carga já foi registrada para este exercício")
  const suggestion = suggestLoad(exercise, latestSession, command.settings)
  if (command.choice === "accept" && suggestion.action === "insufficientData")
    throw new SessionDomainError("Não há sugestão disponível para aceitar")
  if (command.choice === "custom" && command.repetitions === undefined)
    throw new SessionDomainError("Informe as repetições desejadas")
  const expectedLoad =
    command.choice === "maintain"
      ? suggestion.currentLoad
      : (suggestion.suggestedLoad ?? suggestion.currentLoad)
  if (command.choice !== "custom" && expectedLoad !== command.load)
    throw new SessionDomainError("A sugestão mudou, recalcule e confirme a carga exibida")
  const decisionLoad =
    command.choice === "custom"
      ? command.load
      : command.choice === "maintain"
        ? suggestion.currentLoad
        : (suggestion.suggestedLoad ?? suggestion.currentLoad)
  const exercises = session.exercises.map((item, index) =>
    index === exerciseIndex
      ? {
          ...item,
          decision: {
            choice: command.choice,
            load: decisionLoad,
            repetitions:
              command.choice === "custom"
                ? command.repetitions
                : suggestion.suggestedRepetitions,
            settings: command.settings,
            suggestion,
            decidedAt,
          },
        }
      : item
  )
  return { ...session, exercises }
}

export function removeLoadDecision(
  session: WorkoutSession,
  exerciseIndex: number
): WorkoutSession {
  if (session.status !== "completed")
    throw new SessionDomainError("A evolução só pode ser excluída de um treino concluído")
  const exercise = session.exercises[exerciseIndex]
  if (!exercise) throw new SessionDomainError("Exercício não encontrado")
  if (!exercise.decision)
    throw new SessionDomainError("Não há evolução de carga registrada para excluir")

  const exercises = session.exercises.map((item, index) => {
    if (index !== exerciseIndex) return item
    const { decision: _, ...exerciseWithoutDecision } = item
    return exerciseWithoutDecision
  })

  return { ...session, exercises }
}

export function initialExercise(
  target: SessionExerciseTarget,
  snapshot: ExerciseSnapshot,
  latestSession: WorkoutSession | null
): SessionExercise {
  const initial: SessionExercise = {
    exerciseReference: target.exerciseReference,
    exerciseSnapshot: snapshot,
    targetSets: target.sets,
    targetRepetitions: target.targetRepetitions,
    ...(target.restSeconds !== undefined ? { restSeconds: target.restSeconds } : {}),
    initialLoad: target.initialLoad,
    sets: [],
  }
  const latest = exerciseFromLatestSession(latestSession, target)
  const referenceLoad =
    latest?.decision?.load ??
    latest?.sets.filter(set => set.completed && !set.warmup).at(-1)?.load
  const minimumRepetitions = parseRepetitions(target.targetRepetitions)?.min ?? 0
  const targetRepetitions =
    latest?.decision?.repetitions ??
    latest?.decision?.suggestion.suggestedRepetitions ??
    minimumRepetitions
  return {
    ...initial,
    ...(latest?.decision?.settings || latest?.incrementSettings
      ? { incrementSettings: latest?.decision?.settings ?? latest?.incrementSettings }
      : {}),
    ...(referenceLoad !== undefined ? { referenceLoad } : {}),
    sets: Array.from({ length: target.sets }, (_, index) => ({
      setNumber: index + 1,
      targetRepetitions: target.targetRepetitions,
      performedRepetitions: targetRepetitions,
      load: referenceLoad ?? target.initialLoad,
      completed: false,
      warmup: false,
    })),
  }
}

export type SessionExerciseTarget = Pick<
  SessionExercise,
  "exerciseReference" | "targetRepetitions" | "restSeconds" | "initialLoad"
> & { sets: number }
export type ExerciseSnapshot = SessionExercise["exerciseSnapshot"]
export type SessionPlanDay = {
  workoutPlanName: string
  workoutDayName: string
  exercises: SessionExerciseTarget[]
}
