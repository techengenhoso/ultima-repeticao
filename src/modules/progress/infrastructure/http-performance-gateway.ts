import { z } from "zod"
import { auth } from "@/infrastructure/firebase/client"
import { sessionSchema } from "@/modules/sessions/domain/session"
export async function loadPerformanceSessions() {
  if (!auth.currentUser) throw new Error("Entre novamente para continuar")
  const response = await fetch("/api/performance", {
    headers: { Authorization: `Bearer ${await auth.currentUser.getIdToken()}` },
    cache: "no-store",
  })
  const data: unknown = await response.json()
  if (!response.ok)
    throw new Error(
      z.object({ message: z.string() }).safeParse(data).data?.message ??
        "Não foi possível carregar o desempenho"
    )
  return z.object({ sessions: z.array(sessionSchema).max(100) }).parse(data).sessions
}
