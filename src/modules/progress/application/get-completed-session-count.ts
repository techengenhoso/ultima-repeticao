import type { PerformanceSessionReader } from "./ports/performance-session-reader"

export async function getCompletedSessionCount(
  reader: PerformanceSessionReader,
  uid: string
) {
  return { completedSessions: await reader.countCompleted(uid) }
}
