import { z } from "zod"
import { auth } from "@/lib/firebase"
import {
  type BodyAssessmentInput,
  bodyAssessmentListSchema,
  bodyAssessmentSchema,
} from "./schemas"

async function request(method: string, body?: BodyAssessmentInput, id?: string) {
  if (!auth.currentUser) throw new Error("Entre novamente para continuar")
  const response = await fetch(
    `/api/body-assessments${id ? `?id=${encodeURIComponent(id)}` : ""}`,
    {
      method,
      headers: {
        Authorization: `Bearer ${await auth.currentUser.getIdToken()}`,
        "Content-Type": "application/json",
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
      cache: "no-store",
      signal: AbortSignal.timeout(45000),
    }
  )
  const data: unknown = await response.json()
  if (!response.ok)
    throw new Error(
      z.object({ message: z.string() }).safeParse(data).data?.message ??
        "Não foi possível concluir a operação"
    )
  return data
}
export const listAssessments = async () =>
  bodyAssessmentListSchema.parse(await request("GET")).assessments
export const createAssessment = async (input: BodyAssessmentInput) =>
  z.object({ assessment: bodyAssessmentSchema }).parse(await request("POST", input))
    .assessment
export const updateAssessment = async (id: string, input: BodyAssessmentInput) =>
  z.object({ assessment: bodyAssessmentSchema }).parse(await request("PUT", input, id))
    .assessment
export const removeAssessment = async (id: string) => request("DELETE", undefined, id)
