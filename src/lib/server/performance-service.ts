import "server-only"
import { sessionSchema } from "@/lib/sessions/schemas"
import { getAdminFirestore } from "./firebase-admin"

function decode(id: string, data: FirebaseFirestore.DocumentData) {
  return sessionSchema.parse({
    ...data,
    id,
    startedAt: data.startedAt?.toMillis?.() ?? data.startedAt,
    completedAt: data.completedAt?.toMillis?.() ?? data.completedAt,
    exercises: data.exercises?.map(
      (exercise: {
        decision?: { decidedAt?: { toMillis?: () => number } }
        [key: string]: unknown
      }) => ({
        ...exercise,
        ...(exercise.decision
          ? {
              decision: {
                ...exercise.decision,
                decidedAt:
                  exercise.decision.decidedAt?.toMillis?.() ?? exercise.decision.decidedAt,
              },
            }
          : {}),
      })
    ),
  })
}
export async function listPerformanceSessions(uid: string) {
  const snapshot = await getAdminFirestore()
    .collection("users")
    .doc(uid)
    .collection("workoutSessions")
    .where("status", "==", "completed")
    .orderBy("startedAt", "desc")
    .limit(100)
    .get()
  return { sessions: snapshot.docs.map(item => decode(item.id, item.data())) }
}
