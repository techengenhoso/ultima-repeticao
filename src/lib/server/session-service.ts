import "server-only"
import { Timestamp } from "firebase-admin/firestore"
import { z } from "zod"
import { exerciseHistory, suggestLoad } from "@/lib/sessions/progression"
import {
  referenceKey,
  type SessionCommand,
  type SessionExercise,
  sessionSchema,
  type WorkoutSession,
} from "@/lib/sessions/schemas"
import { readUserExerciseLibrary } from "@/lib/workouts/ai/library"
import { workoutDocumentSchema } from "@/lib/workouts/document-schema"
import { workoutDaySchema } from "@/lib/workouts/schemas"
import { getAdminFirestore } from "./firebase-admin"

export class SessionError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message)
  }
}
const collection = (uid: string) =>
  getAdminFirestore().collection("users").doc(uid).collection("workoutSessions")
const millis = (value: unknown) => (value instanceof Timestamp ? value.toMillis() : value)
function decode(id: string, raw: FirebaseFirestore.DocumentData): WorkoutSession {
  const { exerciseKeys: _keys, ...data } = raw
  return sessionSchema.parse({
    ...data,
    id,
    startedAt:
      data.startedAt instanceof Timestamp ? data.startedAt.toMillis() : data.startedAt,
    completedAt:
      data.completedAt instanceof Timestamp
        ? data.completedAt.toMillis()
        : data.completedAt,
    exercises: data.exercises?.map((exercise: SessionExercise) => ({
      ...exercise,
      ...(exercise.decision
        ? {
            decision: {
              ...exercise.decision,
              decidedAt: millis(exercise.decision.decidedAt),
            },
          }
        : {}),
    })),
  })
}
function encode(session: WorkoutSession) {
  const { id: _id, ...data } = sessionSchema.parse(session)
  return JSON.parse(JSON.stringify(data)) as Omit<WorkoutSession, "id">
}
function document(session: WorkoutSession) {
  const data = encode(session)
  return {
    ...data,
    startedAt: Timestamp.fromMillis(session.startedAt),
    ...(session.completedAt
      ? { completedAt: Timestamp.fromMillis(session.completedAt) }
      : {}),
    exerciseKeys: [
      ...new Set(session.exercises.map(item => referenceKey(item.exerciseReference))),
    ],
    exercises: data.exercises.map(item => ({
      ...item,
      ...(item.decision
        ? {
            decision: {
              ...item.decision,
              decidedAt: Timestamp.fromMillis(item.decision.decidedAt),
            },
          }
        : {}),
    })),
  }
}
export async function getSession(uid: string, id: string) {
  const snapshot = await collection(uid).doc(id).get()
  if (!snapshot.exists) throw new SessionError(404, "Sessão não encontrada")
  const session = decode(snapshot.id, snapshot.data() ?? {})
  if (session.userId !== uid) throw new SessionError(403, "Sessão indisponível")
  return session
}
export async function listSessions(uid: string, cursor?: string) {
  let query = collection(uid).orderBy("startedAt", "desc").limit(20)
  if (cursor) {
    const snapshot = await collection(uid).doc(cursor).get()
    if (!snapshot.exists) throw new SessionError(400, "Página de histórico inválida")
    query = query.startAfter(snapshot)
  }
  const snapshot = await query.get()
  return {
    sessions: snapshot.docs.map(item => decode(item.id, item.data())),
    nextCursor: snapshot.size === 20 ? snapshot.docs.at(-1)?.id : null,
  }
}
export async function historyForExercise(uid: string, exercise: SessionExercise) {
  const snapshot = await collection(uid)
    .where("exerciseKeys", "array-contains", referenceKey(exercise.exerciseReference))
    .where("status", "==", "completed")
    .orderBy("startedAt", "desc")
    .limit(20)
    .get()
  return snapshot.docs.map(item => decode(item.id, item.data()))
}
async function startSession(
  uid: string,
  command: Extract<SessionCommand, { action: "start" }>
) {
  const ref = collection(uid).doc(command.id)
  const existing = await ref.get()
  if (existing.exists) return getSession(uid, command.id)
  const plan = await getAdminFirestore()
    .collection("users")
    .doc(uid)
    .collection("workoutPlans")
    .doc(command.workoutPlanId)
    .get()
  if (!plan.exists) throw new SessionError(404, "Ficha não encontrada")
  const raw = plan.data()
  const source = Array.isArray(raw?.days)
    ? raw.days.find((day: { id?: string }) => day.id === command.workoutDayId)
    : undefined
  const legacyDay = workoutDocumentSchema.shape.days.element.safeParse(source)
  const parsed = workoutDaySchema.safeParse(legacyDay.success ? legacyDay.data : null)
  if (!parsed.success)
    throw new SessionError(422, "Revise a ficha antes de iniciar este dia")
  const library = new Map(
    (await readUserExerciseLibrary(uid)).map(item => [
      referenceKey({ source: item.source, exerciseId: item.id }),
      item,
    ])
  )
  const exercises: SessionExercise[] = await Promise.all(
    [...parsed.data.exercises]
      .sort((a, b) => a.order - b.order)
      .map(async item => {
        const actual = library.get(referenceKey(item.exerciseReference))
        if (!actual)
          throw new SessionError(
            422,
            "Um exercício não está mais disponível na biblioteca"
          )
        const exercise: SessionExercise = {
          exerciseReference: item.exerciseReference,
          exerciseSnapshot: { name: actual.name, muscleGroup: actual.muscleGroup },
          targetSets: item.sets,
          targetRepetitions: item.repetitions,
          ...(item.targetRir !== undefined ? { targetRir: item.targetRir } : {}),
          ...(item.restSeconds !== undefined ? { restSeconds: item.restSeconds } : {}),
          initialLoad: item.initialLoad,
          painReported: false,
          sets: [],
        }
        const latest = exerciseHistory(
          await historyForExercise(uid, exercise),
          exercise
        ).find(
          item =>
            item.exercise.decision ||
            item.exercise.sets.some(set => set.completed && !set.warmup)
        )?.exercise
        const referenceLoad =
          latest?.decision?.load ??
          latest?.sets.filter(set => set.completed && !set.warmup).at(-1)?.load
        exercise.incrementSettings =
          latest?.decision?.settings ?? latest?.incrementSettings
        exercise.referenceLoad = referenceLoad
        exercise.sets = Array.from({ length: item.sets }, (_, index) => ({
          setNumber: index + 1,
          targetRepetitions: item.repetitions,
          performedRepetitions: 0,
          load: referenceLoad ?? item.initialLoad,
          completed: false,
          warmup: false,
        }))
        return exercise
      })
  )
  const session = sessionSchema.parse({
    id: command.id,
    userId: uid,
    workoutPlanId: command.workoutPlanId,
    workoutDayId: command.workoutDayId,
    workoutPlanName: z.string().min(1).max(100).parse(raw?.name),
    workoutDayName: parsed.data.name,
    startedAt: Date.now(),
    status: "inProgress",
    version: 0,
    exercises,
  })
  await getAdminFirestore().runTransaction(async transaction => {
    if (!(await transaction.get(ref)).exists) transaction.create(ref, document(session))
  })
  return getSession(uid, command.id)
}
function performanceOnly(previous: SessionExercise[], incoming: SessionExercise[]) {
  if (incoming.length !== previous.length)
    throw new SessionError(422, "A lista de exercícios da sessão não pode ser alterada")
  return previous.map((exercise, index) => ({
    ...exercise,
    painReported: incoming[index].painReported,
    sets: incoming[index].sets.map(set => ({
      ...set,
      targetRepetitions: exercise.targetRepetitions,
    })),
  }))
}
export async function sessionCommand(uid: string, command: SessionCommand) {
  if (command.action === "start") return { session: await startSession(uid, command) }
  const session = await getSession(uid, command.id)
  if (command.action === "suggest") {
    const exercise = session.exercises[command.exerciseIndex]
    if (!exercise) throw new SessionError(404, "Exercício não encontrado")
    const history = await historyForExercise(uid, exercise)
    return { suggestion: suggestLoad(exercise, history, command.settings), history }
  }
  if (command.action === "decide") await recordDecision(uid, session, command)
  else recordPerformance(session, command)
  session.version += 1
  const validated = sessionSchema.parse(session)
  await getAdminFirestore().runTransaction(async transaction => {
    const snapshot = await transaction.get(collection(uid).doc(command.id))
    const current = decode(snapshot.id, snapshot.data() ?? {})
    if (current.version !== command.version)
      throw new SessionError(
        409,
        "A sessão mudou em outra tentativa ou aba, recarregue antes de continuar"
      )
    transaction.set(snapshot.ref, document(validated))
  })
  return { session: validated }
}

async function recordDecision(
  uid: string,
  session: WorkoutSession,
  command: Extract<SessionCommand, { action: "decide" }>
) {
  if (session.status !== "completed")
    throw new SessionError(409, "Conclua a sessão antes de escolher a próxima carga")
  const exercise = session.exercises[command.exerciseIndex]
  if (!exercise) throw new SessionError(404, "Exercício não encontrado")
  const history = await historyForExercise(uid, exercise)
  if (history[0]?.id !== session.id)
    throw new SessionError(
      409,
      "Registre a decisão na sessão concluída mais recente deste exercício"
    )
  const suggestion = suggestLoad(exercise, history, command.settings)
  if (
    command.choice === "accept" &&
    (suggestion.action === "insufficientData" || suggestion.suggestedLoad === undefined)
  )
    throw new SessionError(422, "Não há sugestão disponível para aceitar")
  if (exercise.painReported && command.choice === "accept")
    throw new SessionError(422, "Não aceite progressão com dor relatada")
  const expectedLoad =
    command.choice === "maintain" ? suggestion.currentLoad : suggestion.suggestedLoad
  if (command.choice !== "custom" && expectedLoad !== command.load)
    throw new SessionError(409, "A sugestão mudou, recalcule e confirme a carga exibida")
  exercise.decision = {
    choice: command.choice,
    load:
      command.choice === "custom"
        ? command.load
        : command.choice === "maintain"
          ? suggestion.currentLoad
          : (suggestion.suggestedLoad ?? suggestion.currentLoad),
    settings: command.settings,
    suggestion,
    decidedAt: Date.now(),
  }
}
function recordPerformance(
  session: WorkoutSession,
  command: Extract<SessionCommand, { action: "save" }>
) {
  if (session.status !== "inProgress")
    throw new SessionError(409, "Esta sessão já foi encerrada, recarregue para conferir")
  session.exercises = performanceOnly(session.exercises, command.exercises)
  session.status = command.status
  if (command.status !== "inProgress") session.completedAt = Date.now()
  if (
    command.status === "completed" &&
    !session.exercises.some(item => item.sets.some(set => set.completed && !set.warmup))
  )
    throw new SessionError(
      422,
      "Conclua pelo menos uma série de trabalho ou cancele a sessão"
    )
}
