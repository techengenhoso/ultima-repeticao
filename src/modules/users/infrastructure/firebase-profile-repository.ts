import { doc, getDoc, setDoc } from "firebase/firestore"
import { db } from "@/infrastructure/firebase/client"
import type { ProfileRepository } from "@/modules/users/application/ports/profile-repository"
import type { Profile } from "@/modules/users/domain/profile"

const defaults: Profile = {
  birthDate: "",
  gender: null,
  goal: null,
  experience: null,
}

export const firebaseProfileRepository: ProfileRepository = {
  async get(uid) {
    const snapshot = await getDoc(doc(db, "users", uid))
    return snapshot.exists() ? ({ ...defaults, ...snapshot.data() } as Profile) : null
  },
  async save(uid, data) {
    const reference = doc(db, "users", uid)
    const snapshot = await getDoc(reference)
    await setDoc(
      reference,
      { ...(!snapshot.exists() ? defaults : {}), ...data },
      { merge: true }
    )
    const profile = await this.get(uid)
    if (!profile) throw new Error("Não foi possível carregar o perfil")
    return profile
  },
}
