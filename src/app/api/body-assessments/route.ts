import { FirebaseAuthError } from "firebase-admin/auth"
import { NextResponse } from "next/server"
import {
  BodyAssessmentError,
  createBodyAssessment,
  deleteBodyAssessment,
  listBodyAssessments,
  updateBodyAssessment,
} from "@/lib/server/body-assessment-service"
import { getAdminAuth } from "@/lib/server/firebase-admin"
import { documentIdSchema } from "@/lib/sessions/schemas"
import { readLimitedJson } from "@/lib/workouts/ai/http"
export const runtime = "nodejs"
const headers = { "Cache-Control": "no-store" }
async function user(request: Request) {
  const token = request.headers.get("authorization")
  if (!token?.startsWith("Bearer ") || token.length > 8192)
    throw new BodyAssessmentError(401, "Entre na sua conta para acessar as avaliações")
  try {
    return await getAdminAuth().verifyIdToken(token.slice(7), true)
  } catch (error) {
    if (error instanceof FirebaseAuthError)
      throw new BodyAssessmentError(401, "Sua sessão expirou, entre novamente")
    throw error
  }
}
async function handle(request: Request) {
  try {
    const current = await user(request)
    if (request.method === "GET")
      return NextResponse.json(await listBodyAssessments(current.uid), { headers })
    const id = documentIdSchema.safeParse(new URL(request.url).searchParams.get("id"))
    if (request.method === "DELETE") {
      if (!id.success) throw new BodyAssessmentError(422, "Avaliação inválida")
      return NextResponse.json(await deleteBodyAssessment(current.uid, id.data), {
        headers,
      })
    }
    if (!request.headers.get("content-type")?.startsWith("application/json"))
      throw new BodyAssessmentError(415, "Envie os dados em JSON")
    const raw = await readLimitedJson(
      request.body,
      64 * 1024,
      AbortSignal.any([request.signal, AbortSignal.timeout(30000)])
    )
    if (request.method === "POST")
      return NextResponse.json(await createBodyAssessment(current.uid, raw), { headers })
    if (request.method === "PUT") {
      if (!id.success) throw new BodyAssessmentError(422, "Avaliação inválida")
      return NextResponse.json(await updateBodyAssessment(current.uid, id.data, raw), {
        headers,
      })
    }
    return NextResponse.json({ message: "Método não permitido" }, { status: 405, headers })
  } catch (error) {
    if (error instanceof BodyAssessmentError)
      return NextResponse.json(
        { message: error.message },
        { status: error.status, headers }
      )
    return NextResponse.json(
      { message: "Não foi possível acessar as avaliações" },
      { status: 503, headers }
    )
  }
}
export const GET = handle
export const POST = handle
export const PUT = handle
export const DELETE = handle
