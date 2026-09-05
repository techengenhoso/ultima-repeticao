import type { Exercise } from "@/lib/exercises/types"
import type { WorkoutPrescription } from "@/lib/workouts/methodology/types"
import {
  type MethodologyIssue,
  validateWorkoutPlan,
} from "@/lib/workouts/methodology/validation"
import type { WorkoutFormValues } from "@/lib/workouts/types"
import { classifyMovement } from "./movement-classification"

// A ordem visual é a ordem salva; snapshots nunca vêm dos campos editáveis.
export function reviewWorkout(
  values: WorkoutFormValues,
  prescription: WorkoutPrescription,
  library: Map<string, Exercise>
) {
  const referenceIssues: MethodologyIssue[] = []
  const plan = {
    ...values,
    days: values.days.map((day, dayIndex) => {
      const exercises = day.exercises.map((exercise, order) => {
        const source = library.get(
          `${exercise.exerciseReference.source}:${exercise.exerciseReference.exerciseId}`
        )
        if (!source)
          referenceIssues.push({
            code: "unavailable_exercise",
            severity: "error",
            path: ["days", dayIndex, "exercises", order],
            message: "Substitua este exercício por uma opção compatível da biblioteca",
          })
        return {
          ...exercise,
          order,
          exerciseSnapshot: source
            ? { name: source.name, muscleGroup: source.muscleGroup }
            : exercise.exerciseSnapshot,
        }
      })
      return {
        ...day,
        order: dayIndex,
        exercises,
        muscleGroups: [
          ...new Set(exercises.map(item => item.exerciseSnapshot.muscleGroup)),
        ],
      }
    }),
  }
  const classifications = new Map(
    [...library].flatMap(([key, exercise]) => {
      const kind = classifyMovement(exercise.movementPattern)
      return kind ? [[key, kind] as const] : []
    })
  )
  return {
    plan,
    issues: [
      ...referenceIssues,
      ...validateWorkoutPlan(plan, prescription, classifications),
    ],
  }
}
