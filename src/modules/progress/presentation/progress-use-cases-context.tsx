"use client"

import { createContext, type ReactNode, useContext } from "react"
import type { ProgressUseCases } from "../application/progress-use-cases"

const ProgressUseCasesContext = createContext<ProgressUseCases | null>(null)

export function ProgressUseCasesProvider({
  children,
  useCases,
}: {
  children: ReactNode
  useCases: ProgressUseCases
}) {
  return (
    <ProgressUseCasesContext.Provider value={useCases}>
      {children}
    </ProgressUseCasesContext.Provider>
  )
}

export function useProgressUseCases() {
  const useCases = useContext(ProgressUseCasesContext)
  if (!useCases) throw new Error("ProgressUseCasesProvider não encontrado")
  return useCases
}
