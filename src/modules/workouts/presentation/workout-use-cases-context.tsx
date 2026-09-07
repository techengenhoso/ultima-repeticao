"use client"

import { createContext, type ReactNode, useContext } from "react"
import type { WorkoutUseCases } from "../application/workout-use-cases"

const WorkoutUseCasesContext = createContext<WorkoutUseCases | null>(null)

export function WorkoutUseCasesProvider({
  children,
  useCases,
}: {
  children: ReactNode
  useCases: WorkoutUseCases
}) {
  return (
    <WorkoutUseCasesContext.Provider value={useCases}>
      {children}
    </WorkoutUseCasesContext.Provider>
  )
}

export function useWorkoutUseCases() {
  const useCases = useContext(WorkoutUseCasesContext)
  if (!useCases) throw new Error("WorkoutUseCasesProvider não encontrado")
  return useCases
}
