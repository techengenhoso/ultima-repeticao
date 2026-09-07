import type {
  BodyAssessment,
  BodyAssessmentInput,
} from "@/modules/body-assessments/domain/body-assessment"

export interface BodyAssessmentRepository {
  list(uid: string): Promise<BodyAssessment[]>
  findByDate(uid: string, assessmentDate: string): Promise<BodyAssessment | null>
  findById(uid: string, id: string): Promise<BodyAssessment | null>
  create(uid: string, input: BodyAssessmentInput): Promise<BodyAssessment>
  update(uid: string, id: string, input: BodyAssessmentInput): Promise<BodyAssessment>
  delete(uid: string, id: string): Promise<void>
}
