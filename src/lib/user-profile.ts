import type { Timestamp } from "firebase/firestore"
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore"

import { db } from "@/lib/firebase"

export interface UserProfile {
  fullName: string
  email: string
  birthDate: string | null
  gender: string | null
  goal: string | null
  experience: string | null
  createdAt: Timestamp
  updatedAt: Timestamp
}

export type UserProfileInput = Pick<
  UserProfile,
  "fullName" | "email" | "birthDate" | "gender" | "goal" | "experience"
>

export async function getUserProfile(uid: string) {
  const snapshot = await getDoc(doc(db, "users", uid))
  return snapshot.exists() ? (snapshot.data() as UserProfile) : null
}

export async function saveUserProfile(uid: string, input: UserProfileInput) {
  const reference = doc(db, "users", uid)
  const snapshot = await getDoc(reference)

  await setDoc(
    reference,
    {
      ...input,
      ...(!snapshot.exists() && { createdAt: serverTimestamp() }),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  )
  return getUserProfile(uid)
}

export function getUserName(profileName?: string | null, displayName?: string | null) {
  return profileName?.trim() || displayName?.trim() || "Usuário"
}
