import type { SessionExercise } from "../../domain/session"
import type { ExerciseSnapshot, SessionPlanDay } from "../../domain/session-execution"

export interface SessionPlanReader {
  findDay(
    uid: string,
    workoutPlanId: string,
    workoutDayId: string
  ): Promise<SessionPlanDay | null>
}

export interface SessionExerciseLibrary {
  findSnapshot(
    uid: string,
    reference: SessionExercise["exerciseReference"]
  ): Promise<ExerciseSnapshot | null>
}
