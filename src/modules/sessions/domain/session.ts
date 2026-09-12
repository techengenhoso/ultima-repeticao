import { z } from "zod"
import { muscleGroupValues } from "@/lib/values-zod"
import { repetitionsSchema } from "@/modules/workouts/domain/repetitions"

export const documentIdSchema = z
  .string()
  .min(1)
  .max(150)
  .regex(/^[^/]+$/)
export const loadSchema = z
  .number({ error: "Informe a carga utilizada" })
  .min(0)
  .max(1000)
  .multipleOf(0.01)
export const rirSchema = z.number().int().min(0).max(5)
export const referenceSchema = z
  .object({ source: z.enum(["default", "custom"]), exerciseId: documentIdSchema })
  .strict()
export const referenceKey = (value: z.infer<typeof referenceSchema>) =>
  `${value.source}:${value.exerciseId}`
export const completedSetSchema = z
  .object({
    setNumber: z.number().int().min(1).max(25),
    targetRepetitions: repetitionsSchema,
    performedRepetitions: z
      .number({ error: "Informe as repetições realizadas" })
      .int()
      .min(0)
      .max(100),
    load: loadSchema,
    perceivedRir: rirSchema.optional(),
    completed: z.boolean(),
    warmup: z.boolean().default(false),
  })
  .strict()
export const incrementSchema = z
  .object({
    roundingStep: z.number().positive().max(100).multipleOf(0.01).optional(),
    increment: z.number().positive().max(100).multipleOf(0.01).optional(),
    equipmentIncrement: z.number().positive().max(100).multipleOf(0.01).optional(),
    percentage: z.number().min(0.5).max(5).default(2.5),
  })
  .strict()
export const suggestionSchema = z
  .object({
    action: z.enum(["increase", "maintain", "decrease", "insufficientData"]),
    currentLoad: loadSchema,
    suggestedLoad: loadSchema.optional(),
    reason: z.string().max(1000),
    basedOnSessionIds: z.array(documentIdSchema).max(20),
    confidence: z.enum(["low", "normal"]),
  })
  .strict()
export const decisionSchema = z
  .object({
    choice: z.enum(["accept", "maintain", "custom"]),
    load: loadSchema,
    settings: incrementSchema,
    suggestion: suggestionSchema,
    decidedAt: z.number().int().positive(),
  })
  .strict()
export const sessionExerciseSchema = z
  .object({
    exerciseReference: referenceSchema,
    exerciseSnapshot: z
      .object({ name: z.string().min(1).max(100), muscleGroup: z.enum(muscleGroupValues) })
      .strict(),
    targetSets: z.number().int().min(1).max(20),
    targetRepetitions: repetitionsSchema,
    targetRir: rirSchema.optional(),
    restSeconds: z.number().min(30).max(600).optional(),
    initialLoad: loadSchema,
    referenceLoad: loadSchema.optional(),
    incrementSettings: incrementSchema.optional(),
    painReported: z.boolean(),
    sets: z.array(completedSetSchema).min(1).max(25),
    decision: decisionSchema.optional(),
  })
  .strict()
  .superRefine((exercise, context) => {
    if (
      exercise.sets.filter(set => !set.warmup).length !== exercise.targetSets ||
      exercise.sets.filter(set => set.warmup).length > 5
    )
      context.addIssue({
        code: "custom",
        path: ["sets"],
        message: "Preserve as séries de trabalho e use até cinco séries de aquecimento",
      })
    exercise.sets.forEach((set, index) => {
      if (
        set.setNumber !== index + 1 ||
        set.targetRepetitions !== exercise.targetRepetitions
      )
        context.addIssue({
          code: "custom",
          path: ["sets", index],
          message: "Sequência ou meta da série inválida",
        })
    })
  })
export const sessionSchema = z
  .object({
    id: documentIdSchema,
    userId: documentIdSchema,
    workoutPlanId: documentIdSchema,
    workoutDayId: documentIdSchema,
    workoutPlanName: z.string().min(1).max(100),
    workoutDayName: z.string().min(1).max(50),
    startedAt: z.number().int().positive(),
    completedAt: z.number().int().positive().optional(),
    status: z.enum(["inProgress", "completed", "cancelled"]),
    version: z.number().int().min(0),
    exercises: z.array(sessionExerciseSchema).min(1).max(30),
  })
  .strict()
  .superRefine((session, context) => {
    if (
      (session.status === "inProgress") !== (session.completedAt === undefined) ||
      (session.completedAt !== undefined && session.completedAt < session.startedAt)
    )
      context.addIssue({
        code: "custom",
        path: ["completedAt"],
        message: "Datas incompatíveis com o estado da sessão",
      })
  })
export const sessionFormSchema = z.object({
  exercises: z.array(sessionExerciseSchema).min(1).max(30),
})
export const sessionCommandSchema = z.discriminatedUnion("action", [
  z
    .object({
      action: z.literal("start"),
      id: z.string().uuid(),
      workoutPlanId: documentIdSchema,
      workoutDayId: documentIdSchema,
    })
    .strict(),
  z
    .object({
      action: z.literal("save"),
      id: documentIdSchema,
      version: z.number().int().min(0),
      status: z.enum(["inProgress", "completed", "cancelled"]),
      exercises: z.array(sessionExerciseSchema).min(1).max(30),
    })
    .strict(),
  z
    .object({
      action: z.literal("suggest"),
      id: documentIdSchema,
      exerciseIndex: z.number().int().min(0).max(29),
      settings: incrementSchema,
    })
    .strict(),
  z
    .object({
      action: z.literal("decide"),
      id: documentIdSchema,
      version: z.number().int().min(0),
      exerciseIndex: z.number().int().min(0).max(29),
      settings: incrementSchema,
      choice: z.enum(["accept", "maintain", "custom"]),
      load: loadSchema,
    })
    .strict(),
])
export type CompletedSet = z.infer<typeof completedSetSchema>
export type WorkoutSession = z.infer<typeof sessionSchema>
export type SessionExercise = z.infer<typeof sessionExerciseSchema>
export type LoadSuggestion = z.infer<typeof suggestionSchema>
export type IncrementSettings = z.infer<typeof incrementSchema>
export type SessionCommand = z.infer<typeof sessionCommandSchema>
export type SessionFormValues = z.infer<typeof sessionFormSchema>
