"use client"

import { createContext, type ReactNode, useContext } from "react"
import type { WorkoutGenerationUseCases } from "../application/workout-generation-use-cases"

const WorkoutGenerationUseCasesContext = createContext<WorkoutGenerationUseCases | null>(
  null
)

export function WorkoutGenerationUseCasesProvider({
  children,
  useCases,
}: {
  children: ReactNode
  useCases: WorkoutGenerationUseCases
}) {
  return (
    <WorkoutGenerationUseCasesContext.Provider value={useCases}>
      {children}
    </WorkoutGenerationUseCasesContext.Provider>
  )
}

export function useWorkoutGenerationUseCases() {
  const useCases = useContext(WorkoutGenerationUseCasesContext)
  if (!useCases) throw new Error("WorkoutGenerationUseCasesProvider não encontrado")
  return useCases
}
