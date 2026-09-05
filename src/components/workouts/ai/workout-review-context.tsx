"use client"

import { createContext, useContext } from "react"
import type { WorkoutPrescription } from "@/lib/workouts/methodology/types"
import type { MethodologyIssue } from "@/lib/workouts/methodology/validation"

export const WorkoutReviewContext = createContext<{
  prescription: WorkoutPrescription
  issues: MethodologyIssue[]
} | null>(null)

export function useWorkoutReview() {
  return useContext(WorkoutReviewContext)
}

export function WorkoutReviewMessages({ path }: { path: (string | number)[] }) {
  const review = useWorkoutReview()
  const messages =
    review?.issues.filter(
      issue =>
        issue.path.length === path.length &&
        issue.path.every((part, index) => part === path[index])
    ) ?? []
  return messages.length ? (
    <ul aria-live="polite" className="space-y-1 text-sm">
      {messages.map(issue => (
        <li
          className={
            issue.severity === "error" ? "text-destructive" : "text-muted-foreground"
          }
          key={`${issue.code}:${issue.message}`}
        >
          {issue.severity === "error" ? "Erro: " : "Aviso: "}
          {issue.message}
        </li>
      ))}
    </ul>
  ) : null
}
