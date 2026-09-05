import { Timestamp } from "firebase/firestore"
import { z } from "zod"
import { workoutDaySchema, workoutExerciseSchema } from "./schemas"

const workoutDocumentDaySchema = workoutDaySchema.extend({
  exercises: z.array(
    workoutExerciseSchema.extend({
      repetitions: z
        .union([z.number().int().min(1), z.string().min(1).max(30)])
        .transform(String),
      initialLoad: workoutExerciseSchema.shape.initialLoad.default(0),
      restSeconds: workoutExerciseSchema.shape.restSeconds.default(90),
      targetRir: workoutExerciseSchema.shape.targetRir.default(2),
    })
  ),
})

export const workoutDocumentSchema = z.object({
  name: z.string().min(3).max(100),
  description: z.string().max(500).nullable(),
  isActive: z.boolean(),
  days: z.array(workoutDocumentDaySchema).min(1).max(14),
  createdAt: z.instanceof(Timestamp),
  updatedAt: z.instanceof(Timestamp),
})
