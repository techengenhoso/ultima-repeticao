import { z } from "zod"

const nullableNumber = z
  .number({ error: "Informe um número válido" })
  .finite("Informe um número válido")
  .min(0, "Informe um número igual ou maior que zero")
  .max(100000, "Informe um número dentro do limite permitido")
  .multipleOf(0.01, "Use no máximo duas casas decimais")
  .nullable()
const nullableInteger = z
  .number({ error: "Informe um número inteiro válido" })
  .finite("Informe um número inteiro válido")
  .int("Informe um número inteiro")
  .min(0, "Informe um número igual ou maior que zero")
  .max(100000, "Informe um número dentro do limite permitido")
  .nullable()
const nullableText = z.string().trim().max(100).nullable()

export const bodyIndexSchema = z
  .object({
    weight: nullableNumber,
    bmi: nullableNumber,
    bodyFatPercentage: nullableNumber,
    muscleRatePercentage: nullableNumber,
    leanBodyMass: nullableNumber,
    subcutaneousFatPercentage: nullableNumber,
    visceralFat: nullableNumber,
    bodyWaterPercentage: nullableNumber,
    skeletalMusclePercentage: nullableNumber,
    muscleMass: nullableNumber,
    boneMass: nullableNumber,
    proteinPercentage: nullableNumber,
    dailyCalories: nullableInteger,
    bodyAge: nullableInteger,
    fatMass: nullableNumber,
    waterWeight: nullableNumber,
    proteinMass: nullableNumber,
    idealBodyWeight: nullableNumber,
    obesityLevel: nullableText,
    bodyType: nullableText,
  })
  .strict()

export const circumferencesSchema = z
  .object({
    chest: nullableNumber,
    contractedArmLeft: nullableNumber,
    contractedArmRight: nullableNumber,
    hip: nullableNumber,
    relaxedArmLeft: nullableNumber,
    relaxedArmRight: nullableNumber,
    abdomen: nullableNumber,
    waist: nullableNumber,
    forearmLeft: nullableNumber,
    forearmRight: nullableNumber,
    thighLeft: nullableNumber,
    thighRight: nullableNumber,
    scapular: nullableNumber,
    calfLeft: nullableNumber,
    calfRight: nullableNumber,
  })
  .strict()

export const skinfoldsSchema = z
  .object({
    triceps: nullableNumber,
    subscapular: nullableNumber,
    midAxillary: nullableNumber,
    abdominal: nullableNumber,
    thigh: nullableNumber,
    calf: nullableNumber,
    biceps: nullableNumber,
    suprailiac: nullableNumber,
  })
  .strict()

export const assessmentInputSchema = z
  .object({
    assessmentDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    bodyIndex: bodyIndexSchema,
    circumferences: circumferencesSchema,
    skinfolds: skinfoldsSchema,
  })
  .strict()
  .superRefine((value, context) => {
    const [year, month, day] = value.assessmentDate.split("-").map(Number)
    const date = new Date(Date.UTC(year, month - 1, day))
    if (
      date.getUTCFullYear() !== year ||
      date.getUTCMonth() !== month - 1 ||
      date.getUTCDate() !== day
    )
      context.addIssue({
        code: "custom",
        path: ["assessmentDate"],
        message: "Informe uma data válida",
      })
    const today = new Date()
    const todayIso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`
    if (value.assessmentDate > todayIso)
      context.addIssue({
        code: "custom",
        path: ["assessmentDate"],
        message: "A data não pode estar no futuro",
      })
    if (
      !Object.values(value.bodyIndex)
        .concat(Object.values(value.circumferences), Object.values(value.skinfolds))
        .some(item => item !== null)
    )
      context.addIssue({ code: "custom", message: "Informe ao menos uma medição" })
  })

export const bodyAssessmentSchema = assessmentInputSchema.extend({
  id: z.string().min(1).max(150),
})
export const bodyAssessmentListSchema = z.object({
  assessments: z.array(bodyAssessmentSchema).max(100),
})
export type BodyAssessment = z.infer<typeof bodyAssessmentSchema>
export type BodyAssessmentInput = z.infer<typeof assessmentInputSchema>
