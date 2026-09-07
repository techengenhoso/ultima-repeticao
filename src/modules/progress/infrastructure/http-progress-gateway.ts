import type {
  BodyAssessment,
  BodyAssessmentInput,
} from "@/modules/body-assessments/domain/body-assessment"
import type { ProgressGateway } from "@/modules/progress/application/ports/progress-gateway"
import type { WorkoutSession } from "@/modules/sessions/domain/session"

interface HttpProgressDependencies {
  listAssessments(): Promise<BodyAssessment[]>
  createAssessment(input: BodyAssessmentInput): Promise<BodyAssessment>
  updateAssessment(id: string, input: BodyAssessmentInput): Promise<BodyAssessment>
  removeAssessment(id: string): Promise<unknown>
  listPerformanceSessions(): Promise<WorkoutSession[]>
}

export function createHttpProgressGateway(
  dependencies: HttpProgressDependencies
): ProgressGateway {
  return {
    listAssessments: dependencies.listAssessments,
    createAssessment: dependencies.createAssessment,
    updateAssessment: dependencies.updateAssessment,
    async removeAssessment(id) {
      await dependencies.removeAssessment(id)
    },
    listPerformanceSessions: dependencies.listPerformanceSessions,
  }
}
