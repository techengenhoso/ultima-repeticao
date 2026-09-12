import { parseRepetitions } from "@/modules/workouts/domain/repetitions"
import { suggestLoad } from "./progression"
import {
  type IncrementSettings,
  type SessionCommand,
  type SessionExercise,
  type WorkoutSession,
} from "./session"

export class SessionDomainError extends Error {}

export function applyPerformance(
  session: WorkoutSession,
  command: Extract<SessionCommand, { action: "save" }>,
  completedAt: number
): WorkoutSession {
  if (session.status !== "inProgress")
    throw new SessionDomainError("Esta sessão já foi encerrada, recarregue para conferir")
  if (session.exercises.length !== command.exercises.length)
    throw new SessionDomainError("A lista de exercícios da sessão não pode ser alterada")
  const exercises = session.exercises.map((exercise, index) => {
    const incoming = command.exercises[index]
    if (!incoming || incoming.sets.length !== exercise.sets.length)
      throw new SessionDomainError(
        "As séries planejadas da sessão não podem ser alteradas"
      )
    if (
      incoming.exerciseReference.source !== exercise.exerciseReference.source ||
      incoming.exerciseReference.exerciseId !== exercise.exerciseReference.exerciseId
    )
      throw new SessionDomainError(
        "A identidade do exercício da sessão não pode ser alterada"
      )
    return {
      ...exercise,
      painReported: incoming.painReported,
      sets: incoming.sets.map((set, setIndex) => {
        const planned = exercise.sets[setIndex]
        if (
          !planned ||
          set.setNumber !== planned.setNumber ||
          set.warmup !== planned.warmup
        )
          throw new SessionDomainError(
            "A sequência das séries da sessão não pode ser alterada"
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
      "Conclua pelo menos uma série de trabalho ou cancele a sessão"
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
  history: WorkoutSession[],
  decidedAt: number
): WorkoutSession {
  if (session.status !== "completed")
    throw new SessionDomainError("Conclua a sessão antes de escolher a próxima carga")
  const exercise = session.exercises[exerciseIndex]
  if (!exercise) throw new SessionDomainError("Exercício não encontrado")
  const suggestion = suggestLoad(exercise, history, command.settings)
  if (
    command.choice === "accept" &&
    (suggestion.action === "insufficientData" || suggestion.suggestedLoad === undefined)
  )
    throw new SessionDomainError("Não há sugestão disponível para aceitar")
  if (exercise.painReported && command.choice === "accept")
    throw new SessionDomainError("Não aceite progressão com dor relatada")
  const expectedLoad =
    command.choice === "maintain" ? suggestion.currentLoad : suggestion.suggestedLoad
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
            settings: command.settings,
            suggestion,
            decidedAt,
          },
        }
      : item
  )
  return { ...session, exercises }
}

export function initialExercise(
  target: SessionExerciseTarget,
  snapshot: ExerciseSnapshot,
  history: WorkoutSession[]
): SessionExercise {
  const initial: SessionExercise = {
    exerciseReference: target.exerciseReference,
    exerciseSnapshot: snapshot,
    targetSets: target.sets,
    targetRepetitions: target.targetRepetitions,
    ...(target.targetRir !== undefined ? { targetRir: target.targetRir } : {}),
    ...(target.restSeconds !== undefined ? { restSeconds: target.restSeconds } : {}),
    initialLoad: target.initialLoad,
    painReported: false,
    sets: [],
  }
  const latest = history
    .filter(entry => entry.status === "completed")
    .sort((a, b) => b.startedAt - a.startedAt)
    .flatMap(entry =>
      entry.exercises.filter(
        item =>
          item.exerciseReference.source === target.exerciseReference.source &&
          item.exerciseReference.exerciseId === target.exerciseReference.exerciseId
      ).length === 1
        ? entry.exercises.filter(
            item =>
              item.exerciseReference.source === target.exerciseReference.source &&
              item.exerciseReference.exerciseId === target.exerciseReference.exerciseId
          )
        : []
    )
    .find(item => item.decision || item.sets.some(set => set.completed && !set.warmup))
  const referenceLoad =
    latest?.decision?.load ??
    latest?.sets.filter(set => set.completed && !set.warmup).at(-1)?.load
  const targetRepetitions = parseRepetitions(target.targetRepetitions)?.min ?? 0
  return {
    ...initial,
    ...(latest?.decision?.settings || latest?.incrementSettings
      ? { incrementSettings: latest?.decision?.settings ?? latest?.incrementSettings }
      : {}),
    ...(referenceLoad !== undefined ? { referenceLoad } : {}),
    sets: Array.from({ length: target.sets }, (_, index) => ({
      setNumber: index + 1,
      targetRepetitions: target.targetRepetitions,
      performedRepetitions:
        latest?.sets.find(
          set => !set.warmup && set.completed && set.setNumber === index + 1
        )?.performedRepetitions ?? targetRepetitions,
      load: referenceLoad ?? target.initialLoad,
      completed: false,
      warmup: false,
    })),
  }
}

export type SessionExerciseTarget = Pick<
  SessionExercise,
  "exerciseReference" | "targetRepetitions" | "targetRir" | "restSeconds" | "initialLoad"
> & { sets: number }
export type ExerciseSnapshot = SessionExercise["exerciseSnapshot"]
export type SessionPlanDay = {
  workoutPlanName: string
  workoutDayName: string
  exercises: SessionExerciseTarget[]
}
export type LoadDecisionInput = {
  command: Extract<SessionCommand, { action: "decide" }>
  settings: IncrementSettings
}
