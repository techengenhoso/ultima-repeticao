import { NextResponse } from "next/server"
import { z } from "zod"
import { getCompletedSessionCount } from "@/modules/progress/application/get-completed-session-count"
import {
  authenticateFirebaseRequest,
  RequestAuthenticationError,
} from "@/modules/shared/infrastructure/firebase-request-authenticator"
import { performanceSessionReader } from "../dependencies"

export const runtime = "nodejs"

const responseSchema = z.object({ completedSessions: z.number().int().min(0) }).strict()
const headers = { "Cache-Control": "no-store" }

export async function GET(request: Request) {
  try {
    const user = await authenticateFirebaseRequest(
      request,
      "Entre na sua conta para acessar o desempenho"
    )
    const summary = await getCompletedSessionCount(performanceSessionReader, user.uid)

    return NextResponse.json(responseSchema.parse(summary), { headers })
  } catch (error) {
    if (error instanceof RequestAuthenticationError)
      return NextResponse.json({ message: error.message }, { status: 401, headers })
    return NextResponse.json(
      { message: "Não foi possível acessar o desempenho" },
      { status: 503, headers }
    )
  }
}
