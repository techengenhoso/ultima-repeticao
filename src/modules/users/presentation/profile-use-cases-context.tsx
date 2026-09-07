"use client"

import { createContext, type ReactNode, useContext } from "react"
import type { ProfileUseCases } from "../application/profile-use-cases"

const ProfileUseCasesContext = createContext<ProfileUseCases | null>(null)

export function ProfileUseCasesProvider({
  children,
  useCases,
}: {
  children: ReactNode
  useCases: ProfileUseCases
}) {
  return (
    <ProfileUseCasesContext.Provider value={useCases}>
      {children}
    </ProfileUseCasesContext.Provider>
  )
}

export function useProfileUseCases() {
  const useCases = useContext(ProfileUseCasesContext)
  if (!useCases) throw new Error("ProfileUseCasesProvider não encontrado")
  return useCases
}
