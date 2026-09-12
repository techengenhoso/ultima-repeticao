import { exerciseHistory, suggestLoad } from "../domain/progression"
import { type SessionCommand, sessionSchema, type WorkoutSession } from "../domain/session"
import {
  applyLoadDecision,
  applyPerformance,
  initialExercise,
  SessionDomainError,
} from "../domain/session-execution"
import type {
  SessionExerciseLibrary,
  SessionPlanReader,
} from "./ports/session-plan-reader"
import type { SessionRepository } from "./ports/session-repository"

export class SessionUseCaseError extends Error {
  constructor(
    public readonly status: number,
    message: string
  ) {
    super(message)
  }
}

export class SessionConcurrencyError extends Error {}

export class SessionUseCases {
  constructor(
    private readonly repository: SessionRepository,
    private readonly planReader: SessionPlanReader,
    private readonly exerciseLibrary: SessionExerciseLibrary,
    private readonly now: () => number = Date.now
  ) {}

  async get(uid: string, id: string) {
    const session = await this.repository.find(uid, id)
    if (!session) throw new SessionUseCaseError(404, "Sessão não encontrada")
    if (session.userId !== uid) throw new SessionUseCaseError(403, "Sessão indisponível")
    return session
  }

  findInProgress(uid: string) {
    return this.repository.findInProgress(uid)
  }

  list(uid: string, cursor?: string) {
    return this.repository.list(uid, cursor)
  }

  async execute(uid: string, command: SessionCommand) {
    if (command.action === "start") return { session: await this.start(uid, command) }
    const session = await this.get(uid, command.id)
    if (command.action === "suggest") {
      const exercise = session.exercises[command.exerciseIndex]
      if (!exercise) throw new SessionUseCaseError(404, "Exercício não encontrado")
      const history = await this.repository.listCompletedForExercise(uid, exercise)
      return { suggestion: suggestLoad(exercise, history, command.settings), history }
    }
    try {
      const updated =
        command.action === "save"
          ? applyPerformance(session, command, this.now())
          : await this.decide(uid, session, command)
      const validated = sessionSchema.parse({ ...updated, version: session.version + 1 })
      await this.repository.updateIfVersion(uid, validated, command.version)
      return { session: validated }
    } catch (error) {
      if (error instanceof SessionUseCaseError) throw error
      if (error instanceof SessionConcurrencyError)
        throw new SessionUseCaseError(
          409,
          "A sessão mudou em outra tentativa ou aba, recarregue antes de continuar"
        )
      if (error instanceof SessionDomainError)
        throw new SessionUseCaseError(409, error.message)
      throw error
    }
  }

  async listPerformance(uid: string) {
    return { sessions: await this.repository.listCompleted(uid) }
  }

  private async start(uid: string, command: Extract<SessionCommand, { action: "start" }>) {
    const existing = await this.repository.find(uid, command.id)
    if (existing) return existing
    const day = await this.planReader.findDay(
      uid,
      command.workoutPlanId,
      command.workoutDayId
    )
    if (!day)
      throw new SessionUseCaseError(422, "Revise a ficha antes de iniciar este dia")
    const exercises = await Promise.all(
      day.exercises.map(async target => {
        const snapshot = await this.exerciseLibrary.findSnapshot(
          uid,
          target.exerciseReference
        )
        if (!snapshot)
          throw new SessionUseCaseError(
            422,
            "Um exercício não está mais disponível na biblioteca"
          )
        const history = await this.repository.listCompletedForExercise(uid, {
          exerciseReference: target.exerciseReference,
          exerciseSnapshot: snapshot,
          targetSets: target.sets,
          targetRepetitions: target.targetRepetitions,
          initialLoad: target.initialLoad,
          painReported: false,
          sets: Array.from({ length: target.sets }, (_, index) => ({
            setNumber: index + 1,
            targetRepetitions: target.targetRepetitions,
            performedRepetitions: 0,
            load: target.initialLoad,
            completed: false,
            warmup: false,
          })),
        })
        return initialExercise(target, snapshot, history)
      })
    )
    return this.repository.createIfAbsent(
      uid,
      sessionSchema.parse({
        id: command.id,
        userId: uid,
        workoutPlanId: command.workoutPlanId,
        workoutDayId: command.workoutDayId,
        workoutPlanName: day.workoutPlanName,
        workoutDayName: day.workoutDayName,
        startedAt: this.now(),
        status: "inProgress",
        version: 0,
        exercises,
      })
    )
  }

  private async decide(
    uid: string,
    session: WorkoutSession,
    command: Extract<SessionCommand, { action: "decide" }>
  ) {
    const exercise = session.exercises[command.exerciseIndex]
    if (!exercise) throw new SessionUseCaseError(404, "Exercício não encontrado")
    const history = await this.repository.listCompletedForExercise(uid, exercise)
    if (exerciseHistory(history, exercise)[0]?.session.id !== session.id)
      throw new SessionUseCaseError(
        409,
        "Registre a decisão na sessão concluída mais recente deste exercício"
      )
    return applyLoadDecision(session, command.exerciseIndex, command, history, this.now())
  }
}
