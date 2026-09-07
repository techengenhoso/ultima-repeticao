import type {
  BodyAssessment,
  BodyAssessmentInput,
} from "@/modules/body-assessments/domain/body-assessment"
import { sortAssessments } from "@/modules/body-assessments/domain/calculations"
import {
  exerciseOptions,
  performanceForExercise,
} from "@/modules/progress/domain/performance"
import type { WorkoutSession } from "@/modules/sessions/domain/session"
import type { ProgressGateway } from "./ports/progress-gateway"

export interface ProgressUseCases {
  listAssessments(): Promise<BodyAssessment[]>
  saveAssessment(
    input: BodyAssessmentInput,
    existing?: BodyAssessment
  ): Promise<BodyAssessment>
  removeAssessment(id: string): Promise<void>
  replaceAssessment(items: BodyAssessment[], item: BodyAssessment): BodyAssessment[]
  removeAssessmentFromList(items: BodyAssessment[], id: string): BodyAssessment[]
  listPerformanceSessions(): Promise<WorkoutSession[]>
  exerciseOptions(sessions: WorkoutSession[]): ReturnType<typeof exerciseOptions>
  performanceForExercise(
    sessions: WorkoutSession[],
    key: string
  ): ReturnType<typeof performanceForExercise>
}

export function createProgressUseCases(gateway: ProgressGateway): ProgressUseCases {
  return {
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
    exerciseOptions,
    performanceForExercise,
  }
}
