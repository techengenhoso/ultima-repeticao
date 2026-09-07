import type { BodyAssessmentInput } from "@/modules/body-assessments/domain/body-assessment"
import type { BodyAssessmentRepository } from "./ports/body-assessment-repository"

export class BodyAssessmentError extends Error {
  constructor(
    public readonly status: number,
    message: string
  ) {
    super(message)
  }
}

function mergeValues<T extends Record<string, unknown>>(existing: T, incoming: T): T {
  return Object.fromEntries(
    Object.entries(incoming).map(([key, value]) => [key, value ?? existing[key]])
  ) as T
}

export async function listBodyAssessments(
  repository: BodyAssessmentRepository,
  uid: string
) {
  return { assessments: await repository.list(uid) }
}

export async function createBodyAssessment(
  repository: BodyAssessmentRepository,
  uid: string,
  input: BodyAssessmentInput
) {
  const existing = await repository.findByDate(uid, input.assessmentDate)
  if (!existing) return { assessment: await repository.create(uid, input) }
  const merged: BodyAssessmentInput = {
    ...input,
    bodyIndex: mergeValues(existing.bodyIndex, input.bodyIndex),
    circumferences: mergeValues(existing.circumferences, input.circumferences),
    skinfolds: mergeValues(existing.skinfolds, input.skinfolds),
  }
  return { assessment: await repository.update(uid, existing.id, merged) }
}

export async function updateBodyAssessment(
  repository: BodyAssessmentRepository,
  uid: string,
  id: string,
  input: BodyAssessmentInput
) {
  if (!(await repository.findById(uid, id)))
    throw new BodyAssessmentError(404, "Avaliação não encontrada")
  const duplicate = await repository.findByDate(uid, input.assessmentDate)
  if (duplicate && duplicate.id !== id)
    throw new BodyAssessmentError(409, "Já existe uma avaliação nesta data")
  return { assessment: await repository.update(uid, id, input) }
}

export async function deleteBodyAssessment(
  repository: BodyAssessmentRepository,
  uid: string,
  id: string
) {
  if (!(await repository.findById(uid, id)))
    throw new BodyAssessmentError(404, "Avaliação não encontrada")
  await repository.delete(uid, id)
  return { deletedId: id }
}
