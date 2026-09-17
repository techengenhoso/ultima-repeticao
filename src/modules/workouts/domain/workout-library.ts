import type { MuscleGroup } from "@/modules/exercises/domain/exercise"
import type { Workout } from "@/modules/workouts/domain/workout"

export interface WorkoutFilters {
  search: string
  daysPerWeek: "" | "1" | "2" | "3" | "4" | "5+"
  muscleGroup: "" | MuscleGroup
}

export const emptyWorkoutFilters: WorkoutFilters = {
  search: "",
  daysPerWeek: "",
  muscleGroup: "",
}

function normalizeWorkoutName(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .replace(/\s+/g, " ")
    .toLocaleLowerCase("pt-BR")
}

export function filterWorkouts(workouts: Workout[], filters: WorkoutFilters) {
  const normalizedSearch = normalizeWorkoutName(filters.search)
  const muscleGroup = filters.muscleGroup

  return workouts.filter(
    workout =>
      (!normalizedSearch ||
        normalizeWorkoutName(workout.name).includes(normalizedSearch)) &&
      (!filters.daysPerWeek ||
        (filters.daysPerWeek === "5+"
          ? workout.days.length >= 5
          : workout.days.length === Number(filters.daysPerWeek))) &&
      (!muscleGroup || workout.days.some(day => day.muscleGroups.includes(muscleGroup)))
  )
}

export function sortWorkouts(workouts: Workout[]) {
  return [...workouts].sort(
    (left, right) =>
      Number(right.isActive) - Number(left.isActive) || right.updatedAt - left.updatedAt
  )
}
