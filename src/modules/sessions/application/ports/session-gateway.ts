import type {
  LoadSuggestion,
  PreparedSession,
  SessionCommand,
  WorkoutSession,
} from "../../domain/session"

export interface SessionGateway {
  findInProgress(): Promise<WorkoutSession | null>
  load(id: string): Promise<WorkoutSession>
  list(cursor?: string): Promise<{ sessions: WorkoutSession[]; nextCursor: string | null }>
  prepare(command: Extract<SessionCommand, { action: "start" }>): Promise<PreparedSession>
  mutate(
    command: Exclude<SessionCommand, { action: "start" | "suggest" }>
  ): Promise<WorkoutSession>
  suggest(
    command: Extract<SessionCommand, { action: "suggest" }>
  ): Promise<{ suggestion: LoadSuggestion; history: WorkoutSession[] }>
}
