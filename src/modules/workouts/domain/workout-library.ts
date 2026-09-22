import type { MuscleGroup } from "@/modules/exercises/domain/exercise"
import { estimateSessionMinutes } from "@/modules/workouts/domain/methodology/validation"
import type { Workout } from "@/modules/workouts/domain/workout"

export type WorkoutDuration = "" | "up-to-30" | "31-to-45" | "46-to-60" | "over-60"

export interface WorkoutFilters {
  search: string
  daysPerWeek: "" | "1" | "2" | "3" | "4" | "5+"
  muscleGroup: "" | MuscleGroup
  exerciseSearch: string
  daySearch: string
  estimatedDuration: WorkoutDuration
}

export const emptyWorkoutFilters: WorkoutFilters = {
  search: "",
  daysPerWeek: "",
  muscleGroup: "",
  exerciseSearch: "",
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
  if (duration === "up-to-30") return minutes <= 30
  if (duration === "31-to-45") return minutes >= 31 && minutes <= 45
  if (duration === "46-to-60") return minutes >= 46 && minutes <= 60
  return duration === "over-60" && minutes > 60
}

export function filterWorkouts(workouts: Workout[], filters: WorkoutFilters) {
  const normalizedSearch = normalizeText(filters.search)
  const normalizedExerciseSearch = normalizeText(filters.exerciseSearch)
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
      (!normalizedExerciseSearch ||
        workout.days.some(day =>
          day.exercises.some(exercise =>
            normalizeText(exercise.exerciseSnapshot.name).includes(
              normalizedExerciseSearch
            )
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
