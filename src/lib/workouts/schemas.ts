import { Timestamp } from "firebase/firestore"
import { z } from "zod"
import { muscleGroupValues } from "@/lib/values-zod"

const compactText = (minimum: number, maximum: number) =>
  z
    .string()
    .trim()
    .transform(value => value.replace(/\s+/g, " "))
    .pipe(
      z
        .string()
        .min(minimum, `Deve ter no mínimo ${minimum} caracteres`)
        .max(maximum, `Deve ter no máximo ${maximum} caracteres`)
    )

export const workoutExerciseSchema = z.object({
  id: z.string().min(1),
  order: z.number().int().min(0),
  exerciseReference: z.object({
    source: z.enum(["default", "custom"]),
    exerciseId: z.string().min(1),
  }),
  exerciseSnapshot: z.object({
    name: compactText(1, 100),
    muscleGroup: z.enum(muscleGroupValues),
  }),
  sets: z
    .number({ error: "Informe a quantidade de séries" })
    .int("Informe um número inteiro")
    .min(1, "Informe no mínimo 1 série")
    .max(20, "Informe no máximo 20 séries"),
  repetitions: compactText(1, 30),
  initialLoad: z
    .number({ error: "Informe a carga inicial" })
    .min(0, "A carga não pode ser negativa")
    .max(1000, "Informe uma carga de até 1000 kg"),
})

export const workoutDaySchema = z.object({
  id: z.string().min(1),
  name: compactText(2, 50),
  order: z.number().int().min(0),
  muscleGroups: z.array(z.enum(muscleGroupValues)),
  exercises: z
    .array(workoutExerciseSchema)
    .min(1, "Adicione pelo menos um exercício")
    .max(30, "Cada dia pode ter no máximo 30 exercícios"),
})

const workoutFields = z
  .object({
    name: compactText(3, 100),
    description: z
      .string()
      .trim()
      .max(500, "Deve ter no máximo 500 caracteres")
      .transform(value => value.replace(/\s+/g, " ")),
    days: z
      .array(workoutDaySchema)
      .min(1, "Adicione pelo menos um dia")
      .max(14, "Uma ficha pode ter no máximo 14 dias"),
  })
  .superRefine((value, context) => {
    const names = new Map<string, number>()
    value.days.forEach((day, index) => {
      const normalized = day.name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLocaleLowerCase("pt-BR")
      if (names.has(normalized)) {
        context.addIssue({
          code: "custom",
          message: "Os dias devem ter nomes diferentes",
          path: ["days", index, "name"],
        })
      }
      names.set(normalized, index)
    })
  })

export const workoutFormSchema = workoutFields

const workoutDocumentDaySchema = workoutDaySchema.extend({
  exercises: z.array(
    workoutExerciseSchema.extend({
      initialLoad: workoutExerciseSchema.shape.initialLoad.default(0),
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

export function normalizeWorkoutOrders<T extends { order: number }>(items: T[]) {
  return items.map((item, order) => ({ ...item, order }))
}
