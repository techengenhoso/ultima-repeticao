import type { Status, Workout } from "@/lib/workouts/types"

export interface WorkoutFilters {
  search: string
  status: "" | Status
}

export const emptyWorkoutFilters: WorkoutFilters = {
  search: "",
  status: "",
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

  return workouts.filter(
    workout =>
      (!normalizedSearch ||
        normalizeWorkoutName(workout.name).includes(normalizedSearch)) &&
      (!filters.status ||
        (filters.status === "active" ? workout.isActive : !workout.isActive))
  )
}

export function sortWorkouts(workouts: Workout[]) {
  return [...workouts].sort(
    (left, right) =>
      Number(right.isActive) - Number(left.isActive) ||
      right.updatedAt.toMillis() - left.updatedAt.toMillis()
  )
}
