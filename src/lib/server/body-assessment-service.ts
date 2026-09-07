import "server-only"
import { FieldValue } from "firebase-admin/firestore"
import {
  assessmentInputSchema,
  type BodyAssessmentInput,
  bodyAssessmentSchema,
} from "@/lib/body-assessments/schemas"
import { getAdminFirestore } from "./firebase-admin"

export class BodyAssessmentError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message)
  }
}
const collection = (uid: string) =>
  getAdminFirestore().collection("users").doc(uid).collection("bodyAssessments")
const decode = (id: string, data: FirebaseFirestore.DocumentData) =>
  bodyAssessmentSchema.parse({
    id,
    assessmentDate: data.assessmentDate,
    bodyIndex: data.bodyIndex,
    circumferences: data.circumferences,
    skinfolds: data.skinfolds,
  })
export async function listBodyAssessments(uid: string) {
  const snapshot = await collection(uid).orderBy("assessmentDate", "desc").limit(100).get()
  return { assessments: snapshot.docs.map(item => decode(item.id, item.data())) }
}
async function uniqueDate(uid: string, input: BodyAssessmentInput, exceptId?: string) {
  const found = await collection(uid)
    .where("assessmentDate", "==", input.assessmentDate)
    .limit(2)
    .get()
  if (found.docs.some(item => item.id !== exceptId))
    throw new BodyAssessmentError(409, "Já existe uma avaliação nesta data")
}
function mergeValues<T extends Record<string, unknown>>(existing: T, incoming: T): T {
  return Object.fromEntries(
    Object.entries(incoming).map(([key, value]) => [key, value ?? existing[key]])
  ) as T
}
export async function createBodyAssessment(uid: string, raw: unknown) {
  const input = assessmentInputSchema.parse(raw)
  const matching = await collection(uid)
    .where("assessmentDate", "==", input.assessmentDate)
    .limit(1)
    .get()
  const existing = matching.docs[0]
  if (existing) {
    const current = decode(existing.id, existing.data())
    const merged = assessmentInputSchema.parse({
      ...input,
      bodyIndex: mergeValues(current.bodyIndex, input.bodyIndex),
      circumferences: mergeValues(current.circumferences, input.circumferences),
      skinfolds: mergeValues(current.skinfolds, input.skinfolds),
    })
    await existing.ref.update({ ...merged, updatedAt: FieldValue.serverTimestamp() })
    const saved = await existing.ref.get()
    return { assessment: decode(saved.id, saved.data() ?? {}) }
  }
  const ref = collection(uid).doc()
  await ref.create({
    ...input,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  })
  const saved = await ref.get()
  return { assessment: decode(saved.id, saved.data() ?? {}) }
}
export async function updateBodyAssessment(uid: string, id: string, raw: unknown) {
  const input = assessmentInputSchema.parse(raw)
  const ref = collection(uid).doc(id)
  if (!(await ref.get()).exists)
    throw new BodyAssessmentError(404, "Avaliação não encontrada")
  await uniqueDate(uid, input, id)
  await ref.update({ ...input, updatedAt: FieldValue.serverTimestamp() })
  const saved = await ref.get()
  return { assessment: decode(saved.id, saved.data() ?? {}) }
}
export async function deleteBodyAssessment(uid: string, id: string) {
  const ref = collection(uid).doc(id)
  if (!(await ref.get()).exists)
    throw new BodyAssessmentError(404, "Avaliação não encontrada")
  await ref.delete()
  return { deletedId: id }
}
