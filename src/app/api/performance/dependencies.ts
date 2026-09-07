import type { PerformanceSessionReader } from "@/modules/progress/application/ports/performance-session-reader"
import { FirebaseSessionRepository } from "@/modules/sessions/infrastructure/firebase/firebase-session-repository"

export const performanceSessionReader: PerformanceSessionReader =
  new FirebaseSessionRepository()
