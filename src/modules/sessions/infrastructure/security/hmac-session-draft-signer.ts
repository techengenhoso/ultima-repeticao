import "server-only"
import { createHash, createHmac, timingSafeEqual } from "node:crypto"
import {
  type SessionDraftSigner,
  SessionDraftVerificationError,
} from "../../application/ports/session-draft-signer"
import { sessionSchema } from "../../domain/session"

const tokenSeparator = "."

function signingSecret() {
  const secret = process.env.WORKOUT_SESSION_DRAFT_SECRET
  if (secret) {
    if (secret.length < 32)
      throw new Error(
        "A assinatura de rascunho de treino precisa ter ao menos 32 caracteres"
      )
    return secret
  }
  const firebasePrivateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY
  if (firebasePrivateKey)
    return createHash("sha256")
      .update("ultima-repeticao:workout-session-draft:v1")
      .update(firebasePrivateKey)
      .digest("base64url")
  throw new Error("Assinatura de rascunho de treino não configurada")
}

function signature(payload: string) {
  return createHmac("sha256", signingSecret()).update(payload).digest("base64url")
}

function validSignature(payload: string, received: string) {
  const expected = Buffer.from(signature(payload))
  const actual = Buffer.from(received)
  return actual.length === expected.length && timingSafeEqual(actual, expected)
}

export const hmacSessionDraftSigner: SessionDraftSigner = {
  sign(uid, session) {
    const payload = Buffer.from(JSON.stringify({ uid, session })).toString("base64url")
    return `${payload}${tokenSeparator}${signature(payload)}`
  },
  verify(uid, token) {
    const [payload, received, ...rest] = token.split(tokenSeparator)
    if (!payload || !received || rest.length || !validSignature(payload, received))
      throw new SessionDraftVerificationError("Rascunho de treino inválido")
    try {
      const decoded = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
        uid?: unknown
        session?: unknown
      }
      if (decoded.uid !== uid)
        throw new SessionDraftVerificationError("Rascunho de treino indisponível")
      return sessionSchema.parse(decoded.session)
    } catch (error) {
      if (error instanceof SessionDraftVerificationError) throw error
      throw new SessionDraftVerificationError("Rascunho de treino inválido")
    }
  },
}
