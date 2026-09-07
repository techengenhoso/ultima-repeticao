import { NextResponse } from "next/server"
import {
  BodyAssessmentError,
  createBodyAssessment,
  deleteBodyAssessment,
  listBodyAssessments,
  updateBodyAssessment,
} from "@/modules/body-assessments/application/body-assessment-use-cases"
import { assessmentInputSchema } from "@/modules/body-assessments/domain/body-assessment"
import { documentIdSchema } from "@/modules/sessions/domain/session"
import {
  authenticateFirebaseRequest,
  RequestAuthenticationError,
} from "@/modules/shared/infrastructure/firebase-request-authenticator"
import { readLimitedJson } from "@/modules/shared/infrastructure/http-request-body"
import { bodyAssessmentRepository } from "./dependencies"
export const runtime = "nodejs"
const headers = { "Cache-Control": "no-store" }
async function handle(request: Request) {
  try {
    const current = await authenticateFirebaseRequest(request)
    if (request.method === "GET")
      return NextResponse.json(
        await listBodyAssessments(bodyAssessmentRepository, current.uid),
        { headers }
      )
    const id = documentIdSchema.safeParse(new URL(request.url).searchParams.get("id"))
    if (request.method === "DELETE") {
      if (!id.success) throw new BodyAssessmentError(422, "Avaliação inválida")
      return NextResponse.json(
        await deleteBodyAssessment(bodyAssessmentRepository, current.uid, id.data),
        {
          headers,
        }
      )
    }
    if (!request.headers.get("content-type")?.startsWith("application/json"))
      throw new BodyAssessmentError(415, "Envie os dados em JSON")
    const raw = await readLimitedJson(
      request.body,
      64 * 1024,
      AbortSignal.any([request.signal, AbortSignal.timeout(30000)])
    )
    const input = assessmentInputSchema.safeParse(raw)
    if (!input.success) throw new BodyAssessmentError(422, "Revise os dados da avaliação")
    if (request.method === "POST")
      return NextResponse.json(
        await createBodyAssessment(bodyAssessmentRepository, current.uid, input.data),
        { headers }
      )
    if (request.method === "PUT") {
      if (!id.success) throw new BodyAssessmentError(422, "Avaliação inválida")
      return NextResponse.json(
        await updateBodyAssessment(
          bodyAssessmentRepository,
          current.uid,
          id.data,
          input.data
        ),
        {
          headers,
        }
      )
    }
    return NextResponse.json({ message: "Método não permitido" }, { status: 405, headers })
  } catch (error) {
    if (error instanceof BodyAssessmentError)
      return NextResponse.json(
        { message: error.message },
        { status: error.status, headers }
      )
    if (error instanceof RequestAuthenticationError)
      return NextResponse.json({ message: error.message }, { status: 401, headers })
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
