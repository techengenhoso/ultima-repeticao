"use client"

import { createContext, type ReactNode, useContext } from "react"
import type { ExerciseUseCases } from "../application/exercise-use-cases"

const ExerciseUseCasesContext = createContext<ExerciseUseCases | null>(null)

export function ExerciseUseCasesProvider({
  children,
  useCases,
}: {
  children: ReactNode
  useCases: ExerciseUseCases
}) {
  return (
    <ExerciseUseCasesContext.Provider value={useCases}>
      {children}
    </ExerciseUseCasesContext.Provider>
  )
}

export function useExerciseUseCases() {
  const useCases = useContext(ExerciseUseCasesContext)
  if (!useCases) throw new Error("ExerciseUseCasesProvider não encontrado")
  return useCases
}
