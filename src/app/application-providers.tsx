"use client"

import { type ReactNode } from "react"
import {
  createAssessment,
  listAssessments,
  removeAssessment,
  updateAssessment,
} from "@/modules/body-assessments/infrastructure/http-body-assessment-gateway"
import { createExerciseUseCases } from "@/modules/exercises/application/exercise-use-cases"
import { firebaseExerciseRepository } from "@/modules/exercises/infrastructure/firebase-exercise-repository"
import { ExerciseUseCasesProvider } from "@/modules/exercises/presentation/exercise-use-cases-context"
import { createProgressUseCases } from "@/modules/progress/application/progress-use-cases"
import { loadPerformanceSessions } from "@/modules/progress/infrastructure/http-performance-gateway"
import { createHttpProgressGateway } from "@/modules/progress/infrastructure/http-progress-gateway"
import { ProgressUseCasesProvider } from "@/modules/progress/presentation/progress-use-cases-context"
import { httpSessionGateway } from "@/modules/sessions/infrastructure/http/http-session-gateway"
import { SessionGatewayProvider } from "@/modules/sessions/presentation/session-gateway-context"
import { createAuthenticationUseCases } from "@/modules/users/application/authentication-use-cases"
import { createProfileUseCases } from "@/modules/users/application/profile-use-cases"
import { firebaseAuthenticationGateway } from "@/modules/users/infrastructure/firebase-authentication-gateway"
import { firebaseProfileRepository } from "@/modules/users/infrastructure/firebase-profile-repository"
import { AuthenticationUseCasesProvider } from "@/modules/users/presentation/authentication-use-cases-context"
import { ProfileUseCasesProvider } from "@/modules/users/presentation/profile-use-cases-context"
import { createWorkoutGenerationUseCases } from "@/modules/workouts/application/workout-generation-use-cases"
import { createWorkoutUseCases } from "@/modules/workouts/application/workout-use-cases"
import { firebaseWorkoutRepository } from "@/modules/workouts/infrastructure/firebase-workout-repository"
import { WorkoutGenerationUseCasesProvider } from "@/modules/workouts/presentation/workout-generation-use-cases-context"
import { WorkoutUseCasesProvider } from "@/modules/workouts/presentation/workout-use-cases-context"
import { defaultExercises } from "@/seeds/default-exercises"

const authenticationUseCases = createAuthenticationUseCases(firebaseAuthenticationGateway)
const profileUseCases = createProfileUseCases(firebaseProfileRepository)
const exerciseUseCases = createExerciseUseCases(
  firebaseExerciseRepository,
  defaultExercises
)
const workoutUseCases = createWorkoutUseCases(firebaseWorkoutRepository)
const workoutGenerationUseCases = createWorkoutGenerationUseCases()
const progressUseCases = createProgressUseCases(
  createHttpProgressGateway({
    listAssessments,
    createAssessment,
    updateAssessment,
    removeAssessment,
    listPerformanceSessions: loadPerformanceSessions,
  })
)

export function ApplicationProviders({ children }: { children: ReactNode }) {
  return (
    <AuthenticationUseCasesProvider useCases={authenticationUseCases}>
      <ProfileUseCasesProvider useCases={profileUseCases}>
        <ExerciseUseCasesProvider useCases={exerciseUseCases}>
          <WorkoutGenerationUseCasesProvider useCases={workoutGenerationUseCases}>
            <WorkoutUseCasesProvider useCases={workoutUseCases}>
              <ProgressUseCasesProvider useCases={progressUseCases}>
                <SessionGatewayProvider gateway={httpSessionGateway}>
                  {children}
                </SessionGatewayProvider>
              </ProgressUseCasesProvider>
            </WorkoutUseCasesProvider>
          </WorkoutGenerationUseCasesProvider>
        </ExerciseUseCasesProvider>
      </ProfileUseCasesProvider>
    </AuthenticationUseCasesProvider>
  )
}
