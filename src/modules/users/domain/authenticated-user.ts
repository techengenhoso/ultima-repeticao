/** Identidade que a interface pode consumir sem conhecer o provedor de autenticação. */
export interface AuthenticatedUser {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
  supportsPassword: boolean
}

export interface UserEditable {
  displayName?: string | null
  photoURL?: string | null
}
