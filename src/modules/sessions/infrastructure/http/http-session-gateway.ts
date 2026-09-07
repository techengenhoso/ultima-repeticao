import { z } from "zod"
import { auth } from "@/infrastructure/firebase/client"
import type { SessionGateway } from "../../application/ports/session-gateway"
import { type SessionCommand, sessionSchema, suggestionSchema } from "../../domain/session"

async function request(command?: SessionCommand, params = "") {
  if (!auth.currentUser) throw new Error("Entre novamente para continuar")
  const response = await fetch(`/api/workout-sessions${params}`, {
    method: command ? "POST" : "GET",
    headers: {
      Authorization: `Bearer ${await auth.currentUser.getIdToken()}`,
      "Content-Type": "application/json",
    },
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

export const httpSessionGateway: SessionGateway = {
  async load(id) {
    return z
      .object({ session: sessionSchema })
      .parse(await request(undefined, `?id=${encodeURIComponent(id)}`)).session
  },
  async list(cursor) {
    return z
      .object({
        sessions: z.array(sessionSchema).max(20),
        nextCursor: z.string().nullable(),
      })
      .parse(
        await request(undefined, cursor ? `?cursor=${encodeURIComponent(cursor)}` : "")
      )
  },
  async mutate(command) {
    return z.object({ session: sessionSchema }).parse(await request(command)).session
  },
  async suggest(command) {
    return z
      .object({ suggestion: suggestionSchema, history: z.array(sessionSchema).max(20) })
      .parse(await request(command))
  },
}
