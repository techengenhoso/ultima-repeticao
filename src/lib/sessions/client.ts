import { z } from "zod"
import { auth } from "@/lib/firebase"
import { type SessionCommand, sessionSchema, suggestionSchema } from "./schemas"

export async function sessionRequest(command?: SessionCommand, params = "") {
  if (!auth.currentUser) throw new Error("Entre novamente para continuar")
  const token = await auth.currentUser.getIdToken()
  const response = await fetch(`/api/workout-sessions${params}`, {
    method: command ? "POST" : "GET",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    ...(command ? { body: JSON.stringify(command) } : {}),
    cache: "no-store",
    signal: AbortSignal.timeout(45000),
  })
  const data: unknown = await response.json()
  if (!response.ok)
    throw new Error(
      z.object({ message: z.string().max(500) }).safeParse(data).data?.message ??
        "Não foi possível concluir a operação"
    )
  return data
}
export async function loadSession(id: string) {
  return z
    .object({ session: sessionSchema })
    .parse(await sessionRequest(undefined, `?id=${encodeURIComponent(id)}`)).session
}
export async function listSessionPage(cursor?: string) {
  return z
    .object({
      sessions: z.array(sessionSchema).max(20),
      nextCursor: z.string().nullable(),
    })
    .parse(
      await sessionRequest(
        undefined,
        cursor ? `?cursor=${encodeURIComponent(cursor)}` : ""
      )
    )
}
export async function mutateSession(
  command: Exclude<SessionCommand, { action: "suggest" }>
) {
  return z.object({ session: sessionSchema }).parse(await sessionRequest(command)).session
}
export async function loadSuggestion(
  command: Extract<SessionCommand, { action: "suggest" }>
) {
  return z
    .object({ suggestion: suggestionSchema, history: z.array(sessionSchema).max(20) })
    .parse(await sessionRequest(command))
}
