import { NextResponse } from "next/server"
import { listPerformanceSessions } from "@/modules/progress/application/list-performance-sessions"
import {
  authenticateFirebaseRequest,
  RequestAuthenticationError,
} from "@/modules/shared/infrastructure/firebase-request-authenticator"
import { performanceSessionReader } from "./dependencies"
export const runtime = "nodejs"
export async function GET(request: Request) {
  try {
    const user = await authenticateFirebaseRequest(
      request,
      "Entre na sua conta para acessar o desempenho"
    )
    return NextResponse.json(
      await listPerformanceSessions(performanceSessionReader, user.uid),
      {
        headers: { "Cache-Control": "no-store" },
      }
    )
  } catch (error) {
    if (error instanceof RequestAuthenticationError)
      return NextResponse.json(
        { message: error.message },
        { status: 401, headers: { "Cache-Control": "no-store" } }
      )
    return NextResponse.json(
      {
        message: "Não foi possível acessar o desempenho",
      },
      { status: 503 }
    )
  }
}
