import { parseRepetitions } from "@/modules/workouts/domain/repetitions"
import {
  type EffortRating,
  type IncrementSettings,
  type LoadSuggestion,
  referenceKey,
  type SessionExercise,
  type WorkoutSession,
} from "./session"

export function exerciseHistory(sessions: WorkoutSession[], exercise: SessionExercise) {
  return sessions
    .filter(session => session.status === "completed")
    .sort((a, b) => b.startedAt - a.startedAt)
    .flatMap(session => {
      const items = session.exercises.filter(
        item =>
          referenceKey(item.exerciseReference) === referenceKey(exercise.exerciseReference)
      )
      return items.length === 1 ? [{ session, exercise: items[0] }] : []
    })
}

type HistoryEntry = ReturnType<typeof exerciseHistory>[number]
const workSets = (exercise: SessionExercise) => exercise.sets.filter(set => !set.warmup)
const effortRank: Record<EffortRating, number> = {
  veryHard: 0,
  hard: 1,
  adequate: 2,
  easy: 3,
  veryEasy: 4,
}
const comparable = (a: SessionExercise, b: SessionExercise) =>
  a.targetSets === b.targetSets && a.targetRepetitions === b.targetRepetitions

function dataProblem(exercise: SessionExercise, latest?: HistoryEntry) {
  if (exercise.painReported || latest?.exercise.painReported)
    return "Dor relatada: não há sugestão de progressão, interrompa o exercício em caso de dor aguda e procure orientação profissional"
  if (!latest || !workSets(latest.exercise).some(set => set.completed))
    return "Sem desempenho concluído: defina a carga de forma conservadora durante o treino"
  if (!comparable(exercise, latest.exercise))
    return "A prescrição mudou, registre um treino com as metas atuais antes de progredir"
  const sets = workSets(latest.exercise)
  if (sets.some(set => !set.completed) || sets.length !== exercise.targetSets)
    return "Séries incompletas não indicam perda de força, registre todas as séries de trabalho para avaliar a progressão"
  if (sets.some(set => set.load !== sets[0].load))
    return "As cargas variaram entre as séries, a última carga registrada serve apenas como referência"
  return null
}

function adjustedLoad(
  base: LoadSuggestion,
  increase: boolean,
  settings: IncrementSettings
): LoadSuggestion {
  const current = base.currentLoad
  if (current === 0)
    return {
      ...base,
      action: "insufficientData",
      suggestedRepetitions: undefined,
      reason:
        "Carga zero registrada: informe uma carga executável antes de sugerir incrementos em quilogramas",
    }
  const delta =
    settings.increment ??
    settings.equipmentIncrement ??
    (current * settings.percentage) / 100
  const step =
    settings.equipmentIncrement ?? settings.increment ?? settings.roundingStep ?? 0.5
  const candidate = increase
    ? Math.ceil((current + delta - 1e-8) / step) * step
    : Math.floor((current - delta + 1e-8) / step) * step
  const load = Math.round(candidate * 100) / 100
  const tooLarge = !increase
    ? current - load > current * 0.1
    : settings.increment === undefined && load - current > current * 0.1
  if (load < 0 || load > 1000 || load === current || tooLarge)
    return {
      ...base,
      action: "maintain",
      suggestedLoad: current,
      reason:
        "O incremento disponível não permite um ajuste conservador, mantenha a carga ou informe outra opção",
    }
  return {
    ...base,
    action: increase ? "increase" : "decrease",
    suggestedLoad: load,
    reason: `${base.reason} · Arredondamento em múltiplos de ${step} kg, confirme a disponibilidade no equipamento`,
  }
}

export function suggestLoad(
  exercise: SessionExercise,
  sessions: WorkoutSession[],
  settings: IncrementSettings
): LoadSuggestion {
  const history = exerciseHistory(sessions, exercise)
  const latest = history[0]
  const sets = latest ? workSets(latest.exercise).filter(set => set.completed) : []
  const base: LoadSuggestion = {
    currentLoad: sets.at(-1)?.load ?? 0,
    basedOnSessionIds: latest ? [latest.session.id] : [],
    confidence: "low",
    action: "insufficientData",
    reason: "",
  }
  const problem = dataProblem(exercise, latest)
  if (problem || !latest)
    return {
      ...base,
      reason: problem ?? "Sem desempenho concluído para avaliar a progressão",
    }
  const range = parseRepetitions(exercise.targetRepetitions)
  if (!range) return { ...base, reason: "Faixa de repetições indisponível" }
  return evaluateLoadSuggestion(latest.exercise, settings, base, range)
}

function evaluateLoadSuggestion(
  exercise: SessionExercise,
  settings: IncrementSettings,
  base: LoadSuggestion,
  range: { min: number; max: number }
): LoadSuggestion {
  const currentSets = workSets(exercise)
  if (!currentSets.every(set => set.effortRating !== undefined))
    return {
      ...base,
      action: "maintain",
      suggestedLoad: base.currentLoad,
      confidence: "low",
      reason:
        "Avalie todas as séries para receber uma sugestão baseada na dificuldade percebida",
    }

  const leastEasy = Math.min(
    ...currentSets.map(set => effortRank[set.effortRating as EffortRating])
  )
  const lowestRepetitions = Math.min(...currentSets.map(set => set.performedRepetitions))

  if (lowestRepetitions < range.min)
    return {
      ...base,
      action: "maintain",
      suggestedLoad: base.currentLoad,
      confidence: "normal",
      reason: `Mantenha a carga e busque concluir pelo menos ${range.min} repetições em todas as séries`,
    }

  if (lowestRepetitions < range.max && leastEasy >= effortRank.easy) {
    const increment = leastEasy === effortRank.veryEasy ? 2 : 1
    const suggestedRepetitions = Math.min(lowestRepetitions + increment, range.max)
    return {
      ...base,
      action: "increaseRepetitions",
      suggestedLoad: base.currentLoad,
      suggestedRepetitions,
      confidence: "normal",
      reason: `Todas as séries foram avaliadas como ${leastEasy === effortRank.veryEasy ? "muito fáceis" : "fáceis ou muito fáceis"}: faça ${suggestedRepetitions} repetições em cada série no próximo treino`,
    }
  }

  if (
    currentSets.every(set => set.performedRepetitions >= range.max) &&
    leastEasy >= effortRank.adequate
  )
    return adjustedLoad(
      {
        ...base,
        confidence: "normal",
        suggestedRepetitions: range.min,
        reason: `Todas as séries chegaram ao limite de ${range.max} repetições: aumente a carga e recomece com ${range.min} repetições`,
      },
      true,
      settings
    )

  return {
    ...base,
    action: "maintain",
    suggestedLoad: base.currentLoad,
    confidence: "normal",
    reason:
      leastEasy <= effortRank.hard
        ? "A dificuldade foi alta: mantenha a carga e as repetições no próximo treino"
        : "Mantenha a carga e avance quando todas as séries ficarem fáceis",
  }
}
