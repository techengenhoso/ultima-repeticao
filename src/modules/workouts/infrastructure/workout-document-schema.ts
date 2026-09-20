import { Timestamp } from "firebase/firestore"
import { z } from "zod"
import { workoutDaySchema } from "@/modules/workouts/domain/schemas"

export const workoutDocumentSchema = z.object({
  name: z.string().min(3).max(100),
  description: z.string().max(500).nullable(),
  isActive: z.boolean(),
  days: z.array(workoutDaySchema).min(1).max(14),
  createdAt: z.instanceof(Timestamp),
  updatedAt: z.instanceof(Timestamp),
})
