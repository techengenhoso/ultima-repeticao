import { doc, getDoc, serverTimestamp, setDoc, type Timestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"

export interface Profile {
  birthDate: string
  gender: "male" | "female" | "other" | null
  goal: "hypertrophy" | "weightLoss" | "conditioning" | "strength" | "qualityOfLife" | null
  experience: "beginner" | "basic" | "intermediate" | "advanced" | "expert" | null
  createdAt: Timestamp
  updatedAt: Timestamp
}

export type ProfileEditable = Partial<
  Pick<Profile, "birthDate" | "gender" | "goal" | "experience">
>

export async function get(uid: string) {
  const snapshot = await getDoc(doc(db, "users", uid))
  return snapshot.exists() ? (snapshot.data() as Profile) : null
}

export async function create(uid: string, data: ProfileEditable) {
  const reference = doc(db, "users", uid)

  const snapshot = await getDoc(reference)

  await setDoc(
    reference,
    {
      ...(!snapshot.exists() && {
        birthDate: "",
        gender: null,
        goal: null,
        experience: null,
        createdAt: serverTimestamp(),
      }),
      ...data,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  )

  return get(uid)
}
