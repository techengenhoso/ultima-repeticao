import type { WorkoutDuration } from "@/modules/workouts/domain/workout-library"

export const workoutDurationOptions = [
  { label: "Até 20 min", value: "up-to-20", minutes: 20 },
  { label: "21 - 40 min", value: "21-to-40", minutes: 40 },
  { label: "41 - 60 min", value: "41-to-60", minutes: 60 },
  { label: "61 - 90 min", value: "61-to-90", minutes: 90 },
  { label: "91 - 120 min", value: "91-to-120", minutes: 120 },
] as const satisfies readonly {
  label: string
  value: Exclude<WorkoutDuration, "">
  minutes: number
}[]

export const workoutGenerationDurationOptions = workoutDurationOptions.map(
  ({ label, minutes }) => ({ label, value: String(minutes) })
)
