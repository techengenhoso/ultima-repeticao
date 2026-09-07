import { NextResponse } from "next/server"
import {
  authenticateFirebaseRequest,
  RequestAuthenticationError,
} from "@/modules/shared/infrastructure/firebase-request-authenticator"
import {
  HttpRequestBodyError,
  readLimitedJson,
} from "@/modules/shared/infrastructure/http-request-body"
import { deleteAccount } from "@/modules/users/application/delete-account-use-case"
import { accountDeletionSchema } from "@/modules/users/domain/account-deletion"
import { firebaseAccountDeletionRepository } from "@/modules/users/infrastructure/firebase-account-deletion-repository"

export const runtime = "nodejs"

const headers = { "Cache-Control": "no-store" }
const recentAuthenticationMaximumAgeSeconds = 5 * 60

export async function DELETE(request: Request) {
  try {
    if (!request.headers.get("content-type")?.startsWith("application/json"))
      return NextResponse.json(
        { message: "Envie os dados em JSON" },
        { status: 415, headers }
      )

    const current = await authenticateFirebaseRequest(request)
    const authenticationAgeSeconds = Math.floor(Date.now() / 1000) - current.authTime

    if (authenticationAgeSeconds > recentAuthenticationMaximumAgeSeconds)
      return NextResponse.json(
        {
          message: "Por segurança, saia e entre novamente antes de excluir sua conta",
        },
        { status: 401, headers }
      )

    const raw = await readLimitedJson(
      request.body,
      1024,
      AbortSignal.any([request.signal, AbortSignal.timeout(30000)])
    )
    const input = accountDeletionSchema.safeParse(raw)

    if (!input.success)
      return NextResponse.json(
        { message: "Digite a frase de confirmação exatamente como exibida" },
        { status: 422, headers }
      )

    await deleteAccount(firebaseAccountDeletionRepository, current.uid)

    return NextResponse.json({ deleted: true }, { headers })
  } catch (error) {
    if (error instanceof RequestAuthenticationError)
      return NextResponse.json({ message: error.message }, { status: 401, headers })
    if (error instanceof HttpRequestBodyError)
      return NextResponse.json(
        { message: error.message },
        { status: error.status, headers }
      )
    return NextResponse.json(
      { message: "Não foi possível excluir sua conta. Tente novamente" },
      { status: 503, headers }
    )
  }
}
