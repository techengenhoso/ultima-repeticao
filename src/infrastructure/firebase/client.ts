import { type Analytics, getAnalytics, isSupported } from "firebase/analytics"
import { FirebaseError, getApp, getApps, initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

let analyticsPromise: Promise<Analytics | null> | undefined

export const firebaseApp =
  getApps().length > 0
    ? getApp()
    : initializeApp({
        apiKey: "AIzaSyDOwPQBrSwJFhs9AMkDtNbLoWPeO2U_3AE",
        authDomain: "ultima-repeticao-5da2b.firebaseapp.com",
        projectId: "ultima-repeticao-5da2b",
        storageBucket: "ultima-repeticao-5da2b.firebasestorage.app",
        messagingSenderId: "174568685702",
        appId: "1:174568685702:web:be1dfb3f250c5c16351107",
        measurementId: "G-37E41PV8D0",
      })

export const auth = getAuth(firebaseApp)

export const db = getFirestore(firebaseApp)

export function getFirebaseAnalytics() {
  if (typeof window === "undefined") return Promise.resolve(null)

  analyticsPromise ??= isSupported().then(supported =>
    supported ? getAnalytics(firebaseApp) : null
  )

  return analyticsPromise
}

export function getFirebaseErrorMessage({
  error,
  message,
}: {
  error: unknown
  message?: string
}) {
  const result =
    error instanceof FirebaseError
      ? firebaseErrors[error.code]
      : message || "Não foi possível concluir a operação. Tente novamente."

  return result
}

const firebaseErrors: Record<string, string> = {
  "auth/email-already-in-use": "Já existe uma conta cadastrada com este e-mail",
  "auth/invalid-email": "Informe um e-mail válido",
  "auth/weak-password": "A senha não atende aos requisitos mínimos de segurança",
  "auth/user-not-found": "Usuário não encontrado",
  "auth/wrong-password": "E-mail ou senha incorretos",
  "auth/invalid-credential": "E-mail ou senha incorretos",
  "auth/user-disabled": "Esta conta foi desativada",
  "auth/operation-not-allowed": "Este método de autenticação não está disponível",
  "auth/too-many-requests": "Muitas tentativas, aguarde alguns minutos e tente novamente",
  "auth/network-request-failed": "Não foi possível conectar ao servidor",
  "auth/requires-recent-login": "Por segurança, entre novamente para continuar",
  "auth/popup-closed-by-user": "A janela de autenticação foi fechada antes da conclusão",
  "auth/cancelled-popup-request": "A autenticação foi cancelada",
  "auth/account-exists-with-different-credential": "Já existe uma conta com este e-mail",
  "auth/credential-already-in-use": "Esta credencial já está vinculada a outra conta",
  "auth/unauthorized-domain": "Este domínio não está autorizado para autenticação",
  "auth/invalid-action-code": "Este código de confirmação é inválido",
  "auth/expired-action-code": "Este código de confirmação expirou",
  "auth/internal-error": "Ocorreu um erro interno",
  "auth/user-mismatch": "Não foi possível confirmar sua identidade",
}
