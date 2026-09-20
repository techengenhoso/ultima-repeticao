import "server-only"
import { FieldValue } from "firebase-admin/firestore"
import type { BodyAssessmentRepository } from "@/modules/body-assessments/application/ports/body-assessment-repository"
import {
  type BodyAssessmentInput,
  bodyAssessmentSchema,
} from "@/modules/body-assessments/domain/body-assessment"
import { getAdminFirestore } from "@/modules/shared/infrastructure/firebase-admin"

const collection = (uid: string) =>
  getAdminFirestore().collection("users").doc(uid).collection("bodyAssessments")

function removeLegacyNullFields(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {}
  return Object.fromEntries(
    Object.entries(value).filter(([, fieldValue]) => fieldValue !== null)
  )
}

const hasMeasurements = (group: object) => Object.keys(group).length > 0

function documentData(input: BodyAssessmentInput) {
  return {
    assessmentDate: input.assessmentDate,
    ...(hasMeasurements(input.bodyIndex) ? { bodyIndex: input.bodyIndex } : {}),
    ...(hasMeasurements(input.circumferences)
      ? { circumferences: input.circumferences }
      : {}),
    ...(hasMeasurements(input.skinfolds) ? { skinfolds: input.skinfolds } : {}),
  }
}

function updateData(input: BodyAssessmentInput) {
  return {
    assessmentDate: input.assessmentDate,
    bodyIndex: hasMeasurements(input.bodyIndex) ? input.bodyIndex : FieldValue.delete(),
    circumferences: hasMeasurements(input.circumferences)
      ? input.circumferences
      : FieldValue.delete(),
    skinfolds: hasMeasurements(input.skinfolds) ? input.skinfolds : FieldValue.delete(),
  }
}

function decode(id: string, data: FirebaseFirestore.DocumentData) {
  return bodyAssessmentSchema.parse({
    id,
    assessmentDate: data.assessmentDate,
    bodyIndex: removeLegacyNullFields(data.bodyIndex),
    circumferences: removeLegacyNullFields(data.circumferences),
    skinfolds: removeLegacyNullFields(data.skinfolds),
  })
}

export const firebaseBodyAssessmentRepository: BodyAssessmentRepository = {
  async list(uid) {
    const snapshot = await collection(uid)
      .orderBy("assessmentDate", "desc")
      .limit(100)
      .get()
    return snapshot.docs.map(item => decode(item.id, item.data()))
  },
  async findByDate(uid, assessmentDate) {
    const snapshot = await collection(uid)
      .where("assessmentDate", "==", assessmentDate)
      .limit(1)
      .get()
    const item = snapshot.docs[0]
    return item ? decode(item.id, item.data()) : null
  },
  async findById(uid, id) {
    const snapshot = await collection(uid).doc(id).get()
    return snapshot.exists ? decode(snapshot.id, snapshot.data() ?? {}) : null
  },
  async create(uid, input) {
    const reference = collection(uid).doc()
    await reference.create({
      ...documentData(input),
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    })
    const saved = await reference.get()
    return decode(saved.id, saved.data() ?? {})
  },
  async update(uid, id, input: BodyAssessmentInput) {
    const reference = collection(uid).doc(id)
    await reference.update({
      ...updateData(input),
      updatedAt: FieldValue.serverTimestamp(),
    })
    const saved = await reference.get()
    return decode(saved.id, saved.data() ?? {})
  },
  async delete(uid, id) {
    await collection(uid).doc(id).delete()
  },
}
