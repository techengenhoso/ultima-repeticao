import type { AuthenticatedUser, UserEditable } from "../domain/authenticated-user"
import type { AuthenticationGateway } from "./ports/authentication-gateway"

export class AuthenticationUseCaseError extends Error {}

export interface AuthenticationUseCases {
  observe(listener: (user: AuthenticatedUser | null) => void): () => void
  signIn(email: string, password: string): Promise<void>
  signUp(fullName: string, email: string, password: string): Promise<void>
  requestPasswordReset(email: string): Promise<void>
  signOut(): Promise<void>
  updateUser(user: AuthenticatedUser, data: UserEditable): Promise<void>
  changePassword(
    user: AuthenticatedUser,
    currentPassword: string,
    newPassword: string
  ): Promise<void>
  publicError(error: unknown, fallback: string): string
}

export function createAuthenticationUseCases(
  gateway: AuthenticationGateway
): AuthenticationUseCases {
  return {
    observe: listener => gateway.observe(listener),
    signIn: (email, password) => gateway.signIn(email, password),
    signUp: (fullName, email, password) => gateway.signUp(fullName, email, password),
    requestPasswordReset: email => gateway.sendPasswordReset(email),
    signOut: () => gateway.signOut(),
    updateUser: (user, data) => gateway.updateProfile(user, data),
    async changePassword(user, currentPassword, newPassword) {
      if (!user.email)
        throw new AuthenticationUseCaseError(
          "Não foi possível identificar o endereço de e-mail"
        )
      if (!user.supportsPassword)
        throw new AuthenticationUseCaseError("Esta conta não utiliza senha para entrar")
      await gateway.changePassword(user, currentPassword, newPassword)
    },
    publicError(error, fallback) {
      return error instanceof AuthenticationUseCaseError
        ? error.message
        : gateway.errorMessage(error, fallback)
    },
  }
}
