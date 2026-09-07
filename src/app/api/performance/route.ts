import { FirebaseAuthError } from "firebase-admin/auth"
import { NextResponse } from "next/server"
import { getAdminAuth } from "@/lib/server/firebase-admin"
import { listPerformanceSessions } from "@/lib/server/performance-service"
export const runtime = "nodejs"
export async function GET(request: Request) {
  try {
    const token = request.headers.get("authorization")
    if (!token?.startsWith("Bearer ") || token.length > 8192)
      return NextResponse.json(
        { message: "Entre na sua conta para acessar o desempenho" },
        { status: 401 }
      )
    const user = await getAdminAuth().verifyIdToken(token.slice(7), true)
    return NextResponse.json(await listPerformanceSessions(user.uid), {
      headers: { "Cache-Control": "no-store" },
    })
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof FirebaseAuthError
            ? "Sua sessão expirou, entre novamente"
            : "Não foi possível acessar o desempenho",
      },
      { status: 503 }
    )
  }
}
