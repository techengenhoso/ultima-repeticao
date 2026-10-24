import type { WorkoutSession } from "@/modules/sessions/domain/session"

export interface PerformanceSessionReader {
  countCompleted(uid: string): Promise<number>
  listFinalized(uid: string): Promise<WorkoutSession[]>
}
