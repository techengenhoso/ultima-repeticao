import type {
  BodyAssessment,
  BodyAssessmentInput,
} from "@/modules/body-assessments/domain/body-assessment"
import type { WorkoutSession } from "@/modules/sessions/domain/session"

export interface ProgressGateway {
  listAssessments(): Promise<BodyAssessment[]>
  createAssessment(input: BodyAssessmentInput): Promise<BodyAssessment>
  updateAssessment(id: string, input: BodyAssessmentInput): Promise<BodyAssessment>
  removeAssessment(id: string): Promise<void>
  listPerformanceSessions(): Promise<WorkoutSession[]>
}
