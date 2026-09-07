import type { SessionExercise, WorkoutSession } from "@/lib/sessions/schemas"
import { referenceKey } from "@/lib/sessions/schemas"
export type ExerciseOption = {
  key: string
  name: string
  source: "default" | "custom"
  exerciseId: string
}
const validSets = (exercise: SessionExercise) =>
  exercise.sets.filter(set => set.completed && !set.warmup)
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
              load: best.load,
              volume: sets.reduce(
                (sum, set) => sum + set.load * set.performedRepetitions,
                0
              ),
              best,
              target: `${exercise.targetSets} séries · ${exercise.targetRepetitions}${exercise.targetRir === undefined ? "" : ` · RIR ${exercise.targetRir}`}`,
            },
          ]
        })
    )
    .sort((a, b) => a.date - b.date)
  const latest = rows.at(-1)
  return {
    rows,
    latest,
    maxLoad: rows.reduce((max, row) => Math.max(max, row.load), 0),
    sessions: rows.length,
  }
}
