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

function invalidSessionFilter(
  id: string | null,
  cursor: string | null,
  status: string | null
) {
  return (id && (cursor || status)) || (cursor && status)
}

async function getSessions(request: Request, uid: string) {
  const params = new URL(request.url).searchParams
  const id = params.get("id")
  const cursor = params.get("cursor")
  const status = params.get("status")
  if (invalidSessionFilter(id, cursor, status))
    throw new SessionUseCaseError(422, "Use apenas um filtro de sessão por vez")
  if (status && status !== "inProgress")
    throw new SessionUseCaseError(422, "Filtro de sessão inválido")
  if (id)
    return NextResponse.json(
      { session: await sessionUseCases.get(uid, documentIdSchema.parse(id)) },
      { headers }
    )
  if (status)
    return NextResponse.json(
      { session: await sessionUseCases.findInProgress(uid) },
      { headers }
    )
  return NextResponse.json(
    await sessionUseCases.list(uid, cursor ? documentIdSchema.parse(cursor) : undefined),
    { headers }
  )
}

async function executeSession(request: Request, uid: string) {
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
  return NextResponse.json(await sessionUseCases.execute(uid, command.data), { headers })
}

function sessionErrorResponse(error: unknown) {
  if (error instanceof RequestAuthenticationError)
    return NextResponse.json({ message: error.message }, { status: 401, headers })
  if (error instanceof SessionUseCaseError)
    return NextResponse.json({ message: error.message }, { status: error.status, headers })
  return NextResponse.json(
    {
      message:
        "Não foi possível acessar as sessões, confira a conexão e a configuração do servidor",
    },
    { status: 503, headers }
  )
}

async function handle(request: Request) {
  try {
    const user = await authenticateFirebaseRequest(
      request,
      "Entre na sua conta para acessar as sessões"
    )
    return request.method === "GET"
      ? await getSessions(request, user.uid)
      : await executeSession(request, user.uid)
  } catch (error) {
    return sessionErrorResponse(error)
  }
}
export const GET = handle
export const POST = handle
