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
