import type {
  BodyAssessment,
  BodyAssessmentInput,
} from "@/modules/body-assessments/domain/body-assessment"
import { sortAssessments } from "@/modules/body-assessments/domain/calculations"
import {
  type DashboardSummary,
  type DashboardWorkout,
  dashboardSummary,
} from "@/modules/progress/domain/dashboard-summary"
import {
  exerciseOptions,
  latestExerciseProgressions,
  performanceForExercise,
  workoutPerformance,
} from "@/modules/progress/domain/performance"
import type { WorkoutSession } from "@/modules/sessions/domain/session"
import type { ProgressGateway } from "./ports/progress-gateway"

export interface ProgressUseCases {
  completedSessionCount(): Promise<number>
  listAssessments(): Promise<BodyAssessment[]>
  saveAssessment(
    input: BodyAssessmentInput,
    existing?: BodyAssessment
  ): Promise<BodyAssessment>
  removeAssessment(id: string): Promise<void>
  replaceAssessment(items: BodyAssessment[], item: BodyAssessment): BodyAssessment[]
  removeAssessmentFromList(items: BodyAssessment[], id: string): BodyAssessment[]
  listPerformanceSessions(): Promise<WorkoutSession[]>
  latestExerciseProgressions(
    sessions: WorkoutSession[]
  ): ReturnType<typeof latestExerciseProgressions>
  exerciseOptions(sessions: WorkoutSession[]): ReturnType<typeof exerciseOptions>
  workoutPerformance(sessions: WorkoutSession[]): ReturnType<typeof workoutPerformance>
  performanceForExercise(
    sessions: WorkoutSession[],
    key: string
  ): ReturnType<typeof performanceForExercise>
  dashboardSummary(
    sessions: WorkoutSession[],
    workouts?: DashboardWorkout[],
    completedSessions?: number,
    now?: number
  ): DashboardSummary
}

export function createProgressUseCases(gateway: ProgressGateway): ProgressUseCases {
  return {
    completedSessionCount: () => gateway.completedSessionCount(),
    async listAssessments() {
      return sortAssessments(await gateway.listAssessments())
    },
    saveAssessment: (input, existing) =>
      existing
        ? gateway.updateAssessment(existing.id, input)
        : gateway.createAssessment(input),
    removeAssessment: id => gateway.removeAssessment(id),
    replaceAssessment: (items, item) =>
      sortAssessments([item, ...items.filter(current => current.id !== item.id)]),
    removeAssessmentFromList: (items, id) => items.filter(item => item.id !== id),
    listPerformanceSessions: () => gateway.listPerformanceSessions(),
    latestExerciseProgressions,
    exerciseOptions,
    workoutPerformance,
    performanceForExercise,
    dashboardSummary,
  }
}
