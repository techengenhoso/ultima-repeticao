import { NextResponse } from "next/server"
import { getAdminAuth } from "@/lib/server/firebase-admin"
import {
  getSession,
  listSessions,
  SessionError,
  sessionCommand,
} from "@/lib/server/session-service"
import { documentIdSchema, sessionCommandSchema } from "@/lib/sessions/schemas"
import { readLimitedJson } from "@/lib/workouts/ai/http"

export const runtime = "nodejs"
const headers = { "Cache-Control": "no-store" }
async function handle(request: Request) {
  try {
    const token = request.headers.get("authorization")
    if (!token?.startsWith("Bearer ") || token.length > 8192)
      throw new SessionError(401, "Entre na sua conta para acessar as sessões")
    const auth = getAdminAuth()
    const user = await auth.verifyIdToken(token.slice(7), true).catch(() => {
      throw new SessionError(401, "Sua sessão expirou, entre novamente")
    })
    if (request.method === "GET") {
      const params = new URL(request.url).searchParams
      const id = params.get("id")
      const cursor = params.get("cursor")
      return NextResponse.json(
        id
          ? { session: await getSession(user.uid, documentIdSchema.parse(id)) }
          : await listSessions(
              user.uid,
              cursor ? documentIdSchema.parse(cursor) : undefined
            ),
        { headers }
      )
    }
    if (!request.headers.get("content-type")?.startsWith("application/json"))
      throw new SessionError(415, "Envie os dados em JSON")
    const raw = await readLimitedJson(
      request.body,
      256 * 1024,
      AbortSignal.any([request.signal, AbortSignal.timeout(30000)])
    )
    const command = sessionCommandSchema.safeParse(raw)
    if (!command.success)
      throw new SessionError(422, "Revise cargas, repetições, RIR e séries informadas")
    return NextResponse.json(await sessionCommand(user.uid, command.data), { headers })
  } catch (error) {
    if (error instanceof SessionError)
      return NextResponse.json(
        { message: error.message },
        { status: error.status, headers }
      )
    return NextResponse.json(
      {
        message:
          "Não foi possível acessar as sessões, confira a conexão e a configuração do servidor",
      },
      { status: 503, headers }
    )
  }
}
export const GET = handle
export const POST = handle
