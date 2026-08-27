import { doc, getDoc, setDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

export interface Profile {
  birthDate: string
  gender: "male" | "female" | "other" | null
  goal: "hypertrophy" | "weightLoss" | "conditioning" | "strength" | "qualityOfLife" | null
  experience: "beginner" | "basic" | "intermediate" | "advanced" | "expert" | null
}

export type ProfileEditable = Partial<
  Pick<Profile, "birthDate" | "gender" | "goal" | "experience">
>

export async function saveProfileRepository(
  uid: string,
  data: ProfileEditable
): Promise<Profile> {
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
      }),
      ...data,
    },
    { merge: true }
  )

  const profile = await getProfileRepository(uid)

  if (!profile) throw new Error("Não foi possível carregar o perfil")

  return profile
}

export async function getProfileRepository(uid: string) {
  const snapshot = await getDoc(doc(db, "users", uid))
  return snapshot.exists() ? (snapshot.data() as Profile) : null
}

export async function ensureProfileRepository(uid: string): Promise<Profile> {
  return (await getProfileRepository(uid)) ?? saveProfileRepository(uid, {})
}
