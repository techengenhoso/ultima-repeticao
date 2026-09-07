import "server-only"
import { FirebaseAuthError } from "firebase-admin/auth"
import { getAdminAuth } from "@/modules/shared/infrastructure/firebase-admin"

export class RequestAuthenticationError extends Error {}

export async function authenticateFirebaseRequest(
  request: Request,
  unauthenticatedMessage = "Entre na sua conta para acessar estes dados"
): Promise<{ uid: string; authTime: number }> {
  const token = request.headers.get("authorization")
  if (!token?.startsWith("Bearer ") || token.length > 8192)
    throw new RequestAuthenticationError(unauthenticatedMessage)
  try {
    const decoded = await getAdminAuth().verifyIdToken(token.slice(7), true)
    return { uid: decoded.uid, authTime: decoded.auth_time }
  } catch (error) {
    if (error instanceof FirebaseAuthError)
      throw new RequestAuthenticationError("Sua sessão expirou, entre novamente")
    throw error
  }
}
