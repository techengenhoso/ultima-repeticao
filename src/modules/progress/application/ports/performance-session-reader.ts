import type { WorkoutSession } from "@/modules/sessions/domain/session"

export interface PerformanceSessionReader {
  listFinalized(uid: string): Promise<WorkoutSession[]>
}
