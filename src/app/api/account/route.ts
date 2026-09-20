import { NextResponse } from "next/server"
import {
  authenticateFirebaseRequest,
  RequestAuthenticationError,
} from "@/modules/shared/infrastructure/firebase-request-authenticator"
import { deleteAccount } from "@/modules/users/application/delete-account-use-case"
import { firebaseAccountDeletionRepository } from "@/modules/users/infrastructure/firebase-account-deletion-repository"

export const runtime = "nodejs"

const headers = { "Cache-Control": "no-store" }
const recentAuthenticationMaximumAgeSeconds = 5 * 60

export async function DELETE(request: Request) {
  try {
    const current = await authenticateFirebaseRequest(request)
    const authenticationAgeSeconds = Math.floor(Date.now() / 1000) - current.authTime

    if (authenticationAgeSeconds > recentAuthenticationMaximumAgeSeconds)
      return NextResponse.json(
        {
          message:
            "Por segurança, confirme sua senha novamente antes de excluir sua conta",
        },
        { status: 401, headers }
      )

    await deleteAccount(firebaseAccountDeletionRepository, current.uid)

    return NextResponse.json({ deleted: true }, { headers })
  } catch (error) {
    if (error instanceof RequestAuthenticationError)
      return NextResponse.json({ message: error.message }, { status: 401, headers })
    return NextResponse.json(
      { message: "Não foi possível excluir sua conta. Tente novamente" },
      { status: 503, headers }
    )
  }
}
