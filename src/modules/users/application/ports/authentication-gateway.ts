import type {
  AuthenticatedUser,
  UserEditable,
} from "@/modules/users/domain/authenticated-user"

export interface AuthenticationGateway {
  observe(listener: (user: AuthenticatedUser | null) => void): () => void
  signIn(email: string, password: string): Promise<void>
  signUp(fullName: string, email: string, password: string): Promise<void>
  sendPasswordReset(email: string): Promise<void>
  signOut(): Promise<void>
  updateProfile(user: AuthenticatedUser, data: UserEditable): Promise<void>
  changePassword(
    user: AuthenticatedUser,
    currentPassword: string,
    newPassword: string
  ): Promise<void>
  errorMessage(error: unknown, fallback: string): string
}
