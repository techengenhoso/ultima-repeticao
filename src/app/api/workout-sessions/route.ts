import { NextResponse } from "next/server"
import { SessionUseCaseError } from "@/modules/sessions/application/session-use-cases"
import { documentIdSchema, sessionCommandSchema } from "@/modules/sessions/domain/session"
import {
  authenticateFirebaseRequest,
  RequestAuthenticationError,
} from "@/modules/shared/infrastructure/firebase-request-authenticator"
import { readLimitedJson } from "@/modules/shared/infrastructure/http-request-body"
import { sessionUseCases } from "./dependencies"

export const runtime = "nodejs"
const headers = { "Cache-Control": "no-store" }

async function handle(request: Request) {
  try {
    const user = await authenticateFirebaseRequest(
      request,
      "Entre na sua conta para acessar as sessões"
    )
    if (request.method === "GET") {
      const params = new URL(request.url).searchParams
      const id = params.get("id")
      const cursor = params.get("cursor")
      return NextResponse.json(
        id
          ? { session: await sessionUseCases.get(user.uid, documentIdSchema.parse(id)) }
          : await sessionUseCases.list(
              user.uid,
              cursor ? documentIdSchema.parse(cursor) : undefined
            ),
        { headers }
      )
    }
    if (!request.headers.get("content-type")?.startsWith("application/json"))
      throw new SessionUseCaseError(415, "Envie os dados em JSON")
    const raw = await readLimitedJson(
      request.body,
      256 * 1024,
      AbortSignal.any([request.signal, AbortSignal.timeout(30000)])
    )
    const command = sessionCommandSchema.safeParse(raw)
    if (!command.success)
      throw new SessionUseCaseError(
        422,
        "Revise cargas, repetições, RIR e séries informadas"
      )
    return NextResponse.json(await sessionUseCases.execute(user.uid, command.data), {
      headers,
    })
  } catch (error) {
    if (error instanceof RequestAuthenticationError)
      return NextResponse.json({ message: error.message }, { status: 401, headers })
    if (error instanceof SessionUseCaseError)
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
