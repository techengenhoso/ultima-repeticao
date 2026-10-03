import {
  referenceKey,
  type SessionExercise,
  type WorkoutSession,
} from "@/modules/sessions/domain/session"

export type ExerciseOption = {
  key: string
  name: string
  source: "default" | "custom"
  exerciseId: string
}

export type WorkoutPerformanceRow = {
  date: number
  exercises: number
  id: string
  repetitions: number
  sets: number
  volume: number
  workoutDayName: string
  workoutPlanName: string
}

const validSets = (exercise: SessionExercise) =>
  exercise.sets.filter(set => set.completed && !set.warmup)

const completedSets = (session: WorkoutSession) =>
  session.exercises.flatMap(exercise => validSets(exercise))
export function exerciseOptions(sessions: WorkoutSession[]) {
  const values = new Map<string, ExerciseOption>()
  for (const session of sessions)
    for (const exercise of session.exercises)
      if (validSets(exercise).length)
        values.set(referenceKey(exercise.exerciseReference), {
          key: referenceKey(exercise.exerciseReference),
          name: exercise.exerciseSnapshot.name,
          ...exercise.exerciseReference,
        })
  return [...values.values()].sort((a, b) => a.name.localeCompare(b.name, "pt-BR"))
}

export function workoutPerformance(sessions: WorkoutSession[], now = Date.now()) {
  const rows: WorkoutPerformanceRow[] = sessions
    .filter(session => session.status === "completed")
    .map(session => {
      const sets = completedSets(session)
      const date = session.completedAt ?? session.startedAt

      return {
        date,
        exercises: session.exercises.length,
        id: session.id,
        repetitions: sets.reduce((sum, set) => sum + set.performedRepetitions, 0),
        sets: sets.length,
        volume: sets.reduce((sum, set) => sum + set.load * set.performedRepetitions, 0),
        workoutDayName: session.workoutDayName,
        workoutPlanName: session.workoutPlanName,
      }
    })
    .sort((a, b) => a.date - b.date)

  const totals = rows.reduce(
    (summary, row) => ({
      repetitions: summary.repetitions + row.repetitions,
      sets: summary.sets + row.sets,
      volume: summary.volume + row.volume,
    }),
    { repetitions: 0, sets: 0, volume: 0 }
  )
  const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000
  const recentRows = rows.filter(row => row.date >= thirtyDaysAgo)
  const recentTotals = recentRows.reduce(
    (summary, row) => ({
      repetitions: summary.repetitions + row.repetitions,
      sets: summary.sets + row.sets,
      volume: summary.volume + row.volume,
    }),
    { repetitions: 0, sets: 0, volume: 0 }
  )
  const recentCompletedSessions = sessions.filter(
    session =>
      session.status === "completed" &&
      (session.completedAt ?? session.startedAt) >= thirtyDaysAgo
  )
  const recentExerciseKeys = new Set(
    recentCompletedSessions.flatMap(session =>
      session.exercises
        .filter(exercise => validSets(exercise).length > 0)
        .map(exercise => referenceKey(exercise.exerciseReference))
    )
  )

  return {
    ...totals,
    lastThirtyDays: {
      cancelledSessions: sessions.filter(
        session =>
          session.status === "cancelled" &&
          (session.completedAt ?? session.startedAt) >= thirtyDaysAgo
      ).length,
      completedSessions: recentRows.length,
      exercises: recentExerciseKeys.size,
      ...recentTotals,
    },
    recentSessions: recentRows.length,
    rows,
    sessions: rows.length,
  }
}

export function performanceForExercise(sessions: WorkoutSession[], key: string) {
  const rows = sessions
    .filter(session => session.status === "completed")
    .flatMap(session =>
      session.exercises
        .filter(exercise => referenceKey(exercise.exerciseReference) === key)
        .flatMap(exercise => {
          const sets = validSets(exercise)
          if (!sets.length) return []
          const best = [...sets].sort(
            (a, b) => b.load - a.load || b.performedRepetitions - a.performedRepetitions
          )[0]
          return [
            {
              date: session.completedAt ?? session.startedAt,
              performedSets: sets,
              repetitions: sets.reduce((sum, set) => sum + set.performedRepetitions, 0),
              sessionId: session.id,
              sets: sets.length,
              load: best.load,
              volume: sets.reduce(
                (sum, set) => sum + set.load * set.performedRepetitions,
                0
              ),
              best,
            },
          ]
        })
    )
    .sort((a, b) => a.date - b.date)
  return {
    rows,
    latest: rows.at(-1),
    best: rows.reduce(
      (best, row) =>
        !best ||
        row.best.load > best.load ||
        (row.best.load === best.load &&
          row.best.performedRepetitions > best.performedRepetitions)
          ? row.best
          : best,
      undefined as SessionExercise["sets"][number] | undefined
    ),
    maxVolume: rows.reduce((max, row) => Math.max(max, row.volume), 0),
    sessions: rows.length,
  }
}
