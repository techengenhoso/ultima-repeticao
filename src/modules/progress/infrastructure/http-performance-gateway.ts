import { z } from "zod"
import { auth } from "@/infrastructure/firebase/client"
import { sessionSchema } from "@/modules/sessions/domain/session"

const errorSchema = z.object({ message: z.string() })
const completedSessionCountSchema = z
  .object({ completedSessions: z.number().int().min(0) })
  .strict()

async function performanceRequest(path = "") {
  if (!auth.currentUser) throw new Error("Entre novamente para continuar")
  const response = await fetch(`/api/performance${path}`, {
    headers: { Authorization: `Bearer ${await auth.currentUser.getIdToken()}` },
    cache: "no-store",
  })
  const data: unknown = await response.json()

  if (!response.ok)
    throw new Error(
      errorSchema.safeParse(data).data?.message ?? "Não foi possível carregar o desempenho"
    )

  return data
}

export async function loadPerformanceSessions() {
  const data = await performanceRequest()
  return z.object({ sessions: z.array(sessionSchema).max(100) }).parse(data).sessions
}

export async function loadCompletedSessionCount() {
  return completedSessionCountSchema.parse(await performanceRequest("/summary"))
    .completedSessions
}
