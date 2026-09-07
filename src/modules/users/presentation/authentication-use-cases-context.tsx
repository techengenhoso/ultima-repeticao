"use client"

import { createContext, type ReactNode, useContext } from "react"
import type { AuthenticationUseCases } from "../application/authentication-use-cases"

const AuthenticationUseCasesContext = createContext<AuthenticationUseCases | null>(null)

export function AuthenticationUseCasesProvider({
  children,
  useCases,
}: {
  children: ReactNode
  useCases: AuthenticationUseCases
}) {
  return (
    <AuthenticationUseCasesContext.Provider value={useCases}>
      {children}
    </AuthenticationUseCasesContext.Provider>
  )
}

export function useAuthenticationUseCases() {
  const useCases = useContext(AuthenticationUseCasesContext)
  if (!useCases) throw new Error("AuthenticationUseCasesProvider não encontrado")
  return useCases
}
