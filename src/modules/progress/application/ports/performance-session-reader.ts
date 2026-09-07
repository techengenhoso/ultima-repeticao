import type { WorkoutSession } from "@/modules/sessions/domain/session"

export interface PerformanceSessionReader {
  listCompleted(uid: string): Promise<WorkoutSession[]>
}
