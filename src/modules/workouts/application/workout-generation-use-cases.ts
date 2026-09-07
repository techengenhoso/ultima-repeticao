import type { Exercise } from "@/modules/exercises/domain/exercise"
import { filterAvailableExercises } from "@/modules/workouts/domain/generation/available-exercises"
import { classifyMovement } from "@/modules/workouts/domain/generation/movement-classification"
import { reviewWorkout } from "@/modules/workouts/domain/generation/review"
import { getSafetyBlock } from "@/modules/workouts/domain/generation/safety"
import type { WorkoutGenerationInput } from "@/modules/workouts/domain/generation/types"
import {
  buildAdaptedWorkout,
  buildWorkout,
} from "@/modules/workouts/domain/methodology/generator"
import { createWorkoutPrescription } from "@/modules/workouts/domain/methodology/prescription"
import type { WorkoutPrescription } from "@/modules/workouts/domain/methodology/types"
import {
  calculateWeeklyVolume,
  estimateSessionMinutes,
  validateWorkoutPlan,
} from "@/modules/workouts/domain/methodology/validation"
import type { WorkoutDay, WorkoutFormValues } from "@/modules/workouts/domain/workout"
import {
  type AiWorkoutInput,
  aiWorkoutInputSchema,
  aiWorkoutResultSchema,
} from "./workout-generation-schema"

export class WorkoutGenerationError extends Error {}

export interface WorkoutGenerationUseCases {
  safetyBlock(
    input: Pick<WorkoutGenerationInput, "safetyConfirmed" | "safetyFlags">
  ): string | null
  generate(
    input: AiWorkoutInput,
    library: Exercise[],
    signal: AbortSignal
  ): Promise<{
    plan: WorkoutFormValues
    notices: string[]
  }>
  prescribe(input: WorkoutGenerationInput): WorkoutPrescription
  available(library: Exercise[], input: WorkoutGenerationInput): Exercise[]
  review(
    values: WorkoutFormValues,
    prescription: WorkoutPrescription,
    library: Map<string, Exercise>
  ): ReturnType<typeof reviewWorkout>
  weeklyVolume(days: WorkoutDay[]): ReturnType<typeof calculateWeeklyVolume>
  estimateDuration(day: WorkoutDay): ReturnType<typeof estimateSessionMinutes>
  exerciseDefaults(
    exercise: Exercise,
    prescription?: WorkoutPrescription
  ): {
    sets: number
    repetitions: string
    initialLoad: number
    restSeconds?: number
    targetRir?: number
  }
}

export function createWorkoutGenerationUseCases(): WorkoutGenerationUseCases {
  let variant = 0

  return {
    safetyBlock: getSafetyBlock,
    prescribe: createWorkoutPrescription,
    available(library, input) {
      const keys = new Set(
        filterAvailableExercises(library, input).map(
          item => `${item.source}:${item.exerciseId}`
        )
      )
      return library.filter(item => keys.has(`${item.source}:${item.id}`))
    },
    review: reviewWorkout,
    weeklyVolume: calculateWeeklyVolume,
    estimateDuration: estimateSessionMinutes,
    exerciseDefaults(exercise, prescription) {
      if (!prescription)
        return { sets: Number.NaN, repetitions: "", initialLoad: Number.NaN }
      const rules =
        classifyMovement(exercise.movementPattern) === "compound"
          ? prescription.compoundExerciseRules
          : prescription.isolationExerciseRules
      return {
        sets: rules.sets.min,
        repetitions: rules.repetitions[0],
        initialLoad: Number.NaN,
        restSeconds: rules.restSeconds.min,
        targetRir: rules.targetRir.max,
      }
    },
    async generate(input, library, signal) {
      signal.throwIfAborted()
      const validated = aiWorkoutInputSchema.parse(input)
      const safety = getSafetyBlock(validated)
      if (safety) throw new WorkoutGenerationError(safety)
      const prescription = createWorkoutPrescription(validated)
      const available = filterAvailableExercises(library, validated)
      const keys = new Set(available.map(item => `${item.source}:${item.exerciseId}`))
      const notices = [...prescription.feasibilityWarnings]
      if (validated.preferredExercises.some(key => !keys.has(key)))
        notices.push(
          "Alguns exercícios preferidos foram omitidos por incompatibilidade com as exclusões ou a experiência informada"
        )
      await new Promise<void>(resolve => setTimeout(resolve, 0))
      signal.throwIfAborted()
      const build = prescription.feasibilityWarnings.length
        ? buildAdaptedWorkout
        : buildWorkout
      const plan = build(validated, prescription, available, variant++)
      signal.throwIfAborted()
      if (!plan)
        throw new WorkoutGenerationError(
          "Não há exercícios compatíveis disponíveis para montar a ficha, revise as exclusões ou adicione exercícios à biblioteca"
        )
      for (const day of plan.days) {
        day.id = crypto.randomUUID()
        for (const exercise of day.exercises) exercise.id = crypto.randomUUID()
      }
      const issues = validateWorkoutPlan(
        plan,
        prescription,
        new Map(available.map(item => [`${item.source}:${item.exerciseId}`, item.kind]))
      )
      if (issues.some(issue => issue.severity === "error"))
        throw new WorkoutGenerationError(
          "A combinação não passou pela validação, revise as opções"
        )
      return aiWorkoutResultSchema.parse({
        plan,
        notices: [...new Set([...notices, ...issues.map(issue => issue.message)])].slice(
          0,
          30
        ),
      })
    },
  }
}
