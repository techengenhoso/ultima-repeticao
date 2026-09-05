import { parseRepetitions } from "@/lib/workouts/repetitions"
import {
  type IncrementSettings,
  type LoadSuggestion,
  referenceKey,
  type SessionExercise,
  type WorkoutSession,
} from "./schemas"

export function exerciseHistory(sessions: WorkoutSession[], exercise: SessionExercise) {
  return sessions
    .filter(session => session.status === "completed")
    .sort((a, b) => b.startedAt - a.startedAt)
    .flatMap(session => {
      const items = session.exercises.filter(
        item =>
          referenceKey(item.exerciseReference) === referenceKey(exercise.exerciseReference)
      )
      // Fichas legadas podem repetir a referência: não misture duas execuções.
      return items.length === 1 ? [{ session, exercise: items[0] }] : []
    })
}

type HistoryEntry = ReturnType<typeof exerciseHistory>[number]
const workSets = (exercise: SessionExercise) => exercise.sets.filter(set => !set.warmup)
const comparable = (a: SessionExercise, b: SessionExercise) =>
  a.targetSets === b.targetSets &&
  a.targetRepetitions === b.targetRepetitions &&
  a.targetRir === b.targetRir

function dataProblem(exercise: SessionExercise, latest?: HistoryEntry) {
  if (exercise.painReported || latest?.exercise.painReported)
    return "Dor relatada: não há sugestão de progressão, interrompa o exercício em caso de dor aguda e procure orientação profissional"
  if (!latest || !workSets(latest.exercise).some(set => set.completed))
    return "Sem desempenho concluído: defina a carga de forma conservadora durante o treino"
  if (!comparable(exercise, latest.exercise))
    return "A prescrição mudou, registre uma sessão com as metas atuais antes de progredir"
  const sets = workSets(latest.exercise)
  if (sets.some(set => !set.completed) || sets.length !== exercise.targetSets)
    return "Séries incompletas não indicam perda de força, registre todas as séries de trabalho para avaliar a progressão"
  if (sets.some(set => set.load !== sets[0].load))
    return "As cargas variaram entre as séries, a última carga registrada serve apenas como referência"
  return null
}

function belowTarget(
  exercise: SessionExercise,
  target: SessionExercise,
  currentLoad: number,
  minimum: number
) {
  const sets = workSets(exercise)
  if (
    !comparable(exercise, target) ||
    exercise.painReported ||
    sets.length !== target.targetSets
  )
    return false
  if (!sets.every(set => set.completed && set.load === currentLoad)) return false
  return (
    sets.filter(set => set.performedRepetitions < minimum).length >= 2 ||
    sets.some(
      set =>
        set.perceivedRir !== undefined &&
        target.targetRir !== undefined &&
        set.perceivedRir < target.targetRir
    )
  )
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
  if (problem) return { ...base, reason: problem }
  const range = parseRepetitions(exercise.targetRepetitions)
  if (!range) return { ...base, reason: "Faixa de repetições indisponível" }
  return evaluatePerformance(exercise, history, settings, base, range)
}

function evaluatePerformance(
  exercise: SessionExercise,
  history: HistoryEntry[],
  settings: IncrementSettings,
  base: LoadSuggestion,
  range: { min: number; max: number }
): LoadSuggestion {
  const latest = history[0]
  const sets = workSets(latest.exercise)
  const hasRir =
    exercise.targetRir !== undefined && sets.every(set => set.perceivedRir !== undefined)
  const confidence = hasRir ? "normal" : "low"
  const note = hasRir
    ? ""
    : " · Confiança menor: RIR ausente, avaliação baseada em repetições e carga"
  const rirAdequate = sets.every(
    set =>
      set.perceivedRir === undefined ||
      exercise.targetRir === undefined ||
      set.perceivedRir >= exercise.targetRir
  )
  const increase = sets.every(set => set.performedRepetitions >= range.max) && rirAdequate
  const below = belowTarget(latest.exercise, exercise, base.currentLoad, range.min)
  const previous = history[1]
  const decrease =
    below &&
    previous &&
    belowTarget(previous.exercise, exercise, base.currentLoad, range.min)
  if (!increase && !decrease)
    return {
      ...base,
      confidence,
      action: "maintain",
      suggestedLoad: base.currentLoad,
      reason: `${below ? "Uma sessão abaixo da meta não justifica reduzir a carga, repita e observe a recuperação" : "Mantenha a carga e busque completar a faixa de repetições"}${note}`,
    }
  return adjustedLoad(
    {
      ...base,
      confidence,
      basedOnSessionIds: decrease
        ? [latest.session.id, previous.session.id]
        : base.basedOnSessionIds,
      reason: `${increase ? "Todas as séries atingiram o limite superior sem RIR informado abaixo da meta" : "Duas sessões completas na mesma carga ficaram abaixo das metas, considere uma redução conservadora"}${note}`,
    },
    increase,
    settings
  )
}
