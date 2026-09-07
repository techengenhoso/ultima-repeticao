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

function decode(id: string, data: FirebaseFirestore.DocumentData) {
  return bodyAssessmentSchema.parse({
    id,
    assessmentDate: data.assessmentDate,
    bodyIndex: data.bodyIndex,
    circumferences: data.circumferences,
    skinfolds: data.skinfolds,
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
      ...input,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    })
    const saved = await reference.get()
    return decode(saved.id, saved.data() ?? {})
  },
  async update(uid, id, input: BodyAssessmentInput) {
    const reference = collection(uid).doc(id)
    await reference.update({ ...input, updatedAt: FieldValue.serverTimestamp() })
    const saved = await reference.get()
    return decode(saved.id, saved.data() ?? {})
  },
  async delete(uid, id) {
    await collection(uid).doc(id).delete()
  },
}
