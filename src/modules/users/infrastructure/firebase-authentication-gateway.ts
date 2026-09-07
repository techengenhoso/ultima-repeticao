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
import { auth, getFirebaseErrorMessage } from "@/infrastructure/firebase/client"
import type { AuthenticationGateway } from "@/modules/users/application/ports/authentication-gateway"
import type { AuthenticatedUser } from "@/modules/users/domain/authenticated-user"

function toAuthenticatedUser(user: User): AuthenticatedUser {
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    supportsPassword: user.providerData.some(
      provider => provider.providerId === "password"
    ),
  }
}

export const firebaseAuthenticationGateway: AuthenticationGateway = {
  observe(listener) {
    return onAuthStateChanged(auth, user =>
      listener(user ? toAuthenticatedUser(user) : null)
    )
  },
  async signIn(email, password) {
    await signInWithEmailAndPassword(auth, email, password)
  },
  async signUp(fullName, email, password) {
    const credential = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(credential.user, { displayName: fullName })
  },
  sendPasswordReset(email) {
    return sendPasswordResetEmail(auth, email)
  },
  signOut() {
    return signOut(auth)
  },
  async updateProfile(user, data) {
    const current = auth.currentUser
    if (!current || current.uid !== user.uid) throw new Error("Usuário não autenticado")
    await updateProfile(current, data)
  },
  async changePassword(user, currentPassword, newPassword) {
    const current = auth.currentUser
    if (!current || current.uid !== user.uid || !current.email)
      throw new Error("E-mail do usuário não encontrado")
    const credential = EmailAuthProvider.credential(current.email, currentPassword)
    await reauthenticateWithCredential(current, credential)
    await updatePassword(current, newPassword)
  },
  errorMessage(error, fallback) {
    return getFirebaseErrorMessage({ error, message: fallback })
  },
}
