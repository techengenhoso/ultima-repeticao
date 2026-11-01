import type { MuscleGroup } from "@/modules/exercises/domain/exercise"
import { estimateSessionMinutes } from "@/modules/workouts/domain/methodology/validation"
import type { Workout } from "@/modules/workouts/domain/workout"

export type WorkoutDuration =
  | ""
  | "up-to-20"
  | "21-to-40"
  | "41-to-60"
  | "61-to-90"
  | "91-to-120"

export interface WorkoutFilters {
  search: string
  daysPerWeek: "" | "1" | "2" | "3" | "4" | "5+"
  muscleGroup: "" | MuscleGroup
  exerciseReference: string
  daySearch: string
  estimatedDuration: WorkoutDuration
}

export const emptyWorkoutFilters: WorkoutFilters = {
  search: "",
  daysPerWeek: "",
  muscleGroup: "",
  exerciseReference: "",
  daySearch: "",
  estimatedDuration: "",
}

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .replace(/\s+/g, " ")
    .toLocaleLowerCase("pt-BR")
}

function matchesEstimatedDuration(minutes: number, duration: WorkoutDuration) {
  if (duration === "up-to-20") return minutes <= 20
  if (duration === "21-to-40") return minutes > 20 && minutes <= 40
  if (duration === "41-to-60") return minutes > 40 && minutes <= 60
  if (duration === "61-to-90") return minutes > 60 && minutes <= 90
  return duration === "91-to-120" && minutes > 90 && minutes <= 120
}

export function filterWorkouts(workouts: Workout[], filters: WorkoutFilters) {
  const normalizedSearch = normalizeText(filters.search)
  const normalizedDaySearch = normalizeText(filters.daySearch)
  const muscleGroup = filters.muscleGroup

  return workouts.filter(
    workout =>
      (!normalizedSearch || normalizeText(workout.name).includes(normalizedSearch)) &&
      (!filters.daysPerWeek ||
        (filters.daysPerWeek === "5+"
          ? workout.days.length >= 5
          : workout.days.length === Number(filters.daysPerWeek))) &&
      (!muscleGroup || workout.days.some(day => day.muscleGroups.includes(muscleGroup))) &&
      (!filters.exerciseReference ||
        workout.days.some(day =>
          day.exercises.some(
            exercise =>
              `${exercise.exerciseReference.source}:${exercise.exerciseReference.exerciseId}` ===
              filters.exerciseReference
          )
        )) &&
      (!normalizedDaySearch ||
        workout.days.some(day => normalizeText(day.name).includes(normalizedDaySearch))) &&
      (!filters.estimatedDuration ||
        workout.days.some(day => {
          const minutes = estimateSessionMinutes(day)
          return (
            minutes !== null &&
            matchesEstimatedDuration(minutes, filters.estimatedDuration)
          )
        }))
  )
}

export function sortWorkouts(workouts: Workout[]) {
  return [...workouts].sort(
    (left, right) =>
      Number(right.isActive) - Number(left.isActive) || right.updatedAt - left.updatedAt
  )
}
