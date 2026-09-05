import "server-only"
import { applicationDefault, cert, getApps, initializeApp } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"
import { getFirestore } from "firebase-admin/firestore"

function getAdminApp() {
  const existing = getApps().find(app => app.name === "workout-ai")
  if (existing) return existing
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID
  if (!projectId) throw new Error("Firebase Admin não configurado")
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n")
  if (Boolean(clientEmail) !== Boolean(privateKey))
    throw new Error("Credenciais incompletas")
  return initializeApp(
    {
      projectId,
      credential:
        clientEmail && privateKey
          ? cert({ projectId, clientEmail, privateKey })
          : applicationDefault(),
    },
    "workout-ai"
  )
}

export const getAdminAuth = () => getAuth(getAdminApp())
export const getAdminFirestore = () => getFirestore(getAdminApp())
