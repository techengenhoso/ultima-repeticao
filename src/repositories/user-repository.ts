import {
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  onAuthStateChanged,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  type User,
  updatePassword,
  updateProfile,
} from "firebase/auth"
import { auth } from "@/lib/firebase"

export type { User }

export interface UserEditable {
  displayName?: string | null
  photoURL?: string | null
}

export function onAuthStateChangedUserRepository(listener: (user: User | null) => void) {
  return onAuthStateChanged(auth, listener)
}

export function saveUserRepository(user: User, data: UserEditable) {
  return updateProfile(user, data)
}

export async function changePasswordUserRepository(
  user: User,
  currentPassword: string,
  newPassword: string
) {
  if (!user.email) throw new Error("E-mail do usuário não encontrado")
  const credential = EmailAuthProvider.credential(user.email, currentPassword)
  await reauthenticateWithCredential(user, credential)
  await updatePassword(user, newPassword)
}

export function signOutUserRepository() {
  return signOut(auth)
}

export async function createUserRepository(
  fullName: string,
  email: string,
  password: string
) {
  const credential = await createUserWithEmailAndPassword(auth, email, password)
  await saveUserRepository(credential.user, { displayName: fullName })
  return credential.user
}

export function signInUserRepository(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password)
}

export function forgotPasswordUserRepository(email: string) {
  return sendPasswordResetEmail(auth, email)
}
