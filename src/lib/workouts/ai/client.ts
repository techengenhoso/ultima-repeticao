import type { Exercise } from "@/lib/exercises/types"
import { buildAdaptedWorkout, buildWorkout } from "@/lib/workouts/methodology/generator"
import { createWorkoutPrescription } from "@/lib/workouts/methodology/prescription"
import { validateWorkoutPlan } from "@/lib/workouts/methodology/validation"
import { filterAvailableExercises } from "./available-exercises"
import { getSafetyBlock } from "./safety"
import {
  type AiWorkoutInput,
  aiWorkoutInputSchema,
  aiWorkoutResultSchema,
} from "./schemas"

export class GenerationClientError extends Error {}
let variant = 0

export async function requestWorkout(
  input: AiWorkoutInput,
  library: Exercise[],
  signal: AbortSignal
) {
  signal.throwIfAborted()
  const validated = aiWorkoutInputSchema.parse(input)
  const safety = getSafetyBlock(validated)
  if (safety) throw new GenerationClientError(safety)
  const prescription = createWorkoutPrescription(validated)
  const available = filterAvailableExercises(library, validated)
  const keys = new Set(available.map(item => `${item.source}:${item.exerciseId}`))
  const notices = [...prescription.feasibilityWarnings]
  if (validated.preferredExercises.some(key => !keys.has(key)))
    notices.push(
      "Alguns exercícios preferidos foram omitidos por incompatibilidade com as exclusões ou a experiência informada"
    )
  // Permite que o navegador apresente o estado de montagem antes da busca limitada.
  await new Promise<void>(resolve => setTimeout(resolve, 0))
  signal.throwIfAborted()
  const build = prescription.feasibilityWarnings.length
    ? buildAdaptedWorkout
    : buildWorkout
  const plan = build(validated, prescription, available, variant++)
  signal.throwIfAborted()
  if (!plan)
    throw new GenerationClientError(
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
    throw new GenerationClientError(
      "A combinação não passou pela validação, revise as opções"
    )
  return aiWorkoutResultSchema.parse({
    plan,
    notices: [...new Set([...notices, ...issues.map(issue => issue.message)])].slice(
      0,
      30
    ),
  })
}
