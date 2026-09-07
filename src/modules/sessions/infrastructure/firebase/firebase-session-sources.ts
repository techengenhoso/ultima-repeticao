import "server-only"
import type { ExerciseLibraryReader } from "@/modules/exercises/application/ports/exercise-library-reader"
import { getAdminFirestore } from "@/modules/shared/infrastructure/firebase-admin"
import {
  legacyWorkoutDaySchema,
  workoutDaySchema,
} from "@/modules/workouts/domain/schemas"
import type {
  SessionExerciseLibrary,
  SessionPlanReader,
} from "../../application/ports/session-plan-reader"
import type { SessionExercise } from "../../domain/session"

export class FirebaseSessionPlanReader implements SessionPlanReader {
  async findDay(uid: string, workoutPlanId: string, workoutDayId: string) {
    const plan = await getAdminFirestore()
      .collection("users")
      .doc(uid)
      .collection("workoutPlans")
      .doc(workoutPlanId)
      .get()
    if (!plan.exists) return null
    const raw = plan.data()
    const source = Array.isArray(raw?.days)
      ? raw.days.find((day: { id?: string }) => day.id === workoutDayId)
      : undefined
    const legacyDay = legacyWorkoutDaySchema.safeParse(source)
    const day = workoutDaySchema.safeParse(legacyDay.success ? legacyDay.data : null)
    const name = raw?.name
    if (!day.success || typeof name !== "string") return null
    return {
      workoutPlanName: name,
      workoutDayName: day.data.name,
      exercises: [...day.data.exercises]
        .sort((a, b) => a.order - b.order)
        .map(item => ({
          exerciseReference: item.exerciseReference,
          sets: item.sets,
          targetRepetitions: item.repetitions,
          ...(item.targetRir !== undefined ? { targetRir: item.targetRir } : {}),
          ...(item.restSeconds !== undefined ? { restSeconds: item.restSeconds } : {}),
          initialLoad: item.initialLoad,
        })),
    }
  }
}

export class FirebaseSessionExerciseLibrary implements SessionExerciseLibrary {
  constructor(private readonly exerciseLibraryReader: ExerciseLibraryReader) {}

  async findSnapshot(uid: string, reference: SessionExercise["exerciseReference"]) {
    const exercise = (await this.exerciseLibraryReader.list(uid)).find(
      item => item.source === reference.source && item.id === reference.exerciseId
    )
    return exercise ? { name: exercise.name, muscleGroup: exercise.muscleGroup } : null
  }
}
