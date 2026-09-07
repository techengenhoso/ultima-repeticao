import type { PerformanceSessionReader } from "./ports/performance-session-reader"

export async function listPerformanceSessions(
  reader: PerformanceSessionReader,
  uid: string
) {
  return { sessions: await reader.listCompleted(uid) }
}
