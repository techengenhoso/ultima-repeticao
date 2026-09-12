import type { LoadSuggestion, SessionCommand, WorkoutSession } from "../../domain/session"

export interface SessionGateway {
  findInProgress(): Promise<WorkoutSession | null>
  load(id: string): Promise<WorkoutSession>
  list(cursor?: string): Promise<{ sessions: WorkoutSession[]; nextCursor: string | null }>
  mutate(command: Exclude<SessionCommand, { action: "suggest" }>): Promise<WorkoutSession>
  suggest(
    command: Extract<SessionCommand, { action: "suggest" }>
  ): Promise<{ suggestion: LoadSuggestion; history: WorkoutSession[] }>
}
