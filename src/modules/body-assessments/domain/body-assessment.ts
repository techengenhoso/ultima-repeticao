import { z } from "zod"

const measurementNumber = z
  .number({ error: "Informe um número válido" })
  .finite("Informe um número válido")
  .min(0, "Informe um número igual ou maior que zero")
  .max(100000, "Informe um número dentro do limite permitido")
  .multipleOf(0.01, "Use no máximo duas casas decimais")
const measurementInteger = z
  .number({ error: "Informe um número inteiro válido" })
  .finite("Informe um número inteiro válido")
  .int("Informe um número inteiro")
  .min(0, "Informe um número igual ou maior que zero")
  .max(100000, "Informe um número dentro do limite permitido")
const measurementText = z.string().trim().max(100)
const obesityLevelInput = measurementText.max(
  10,
  "O nível de obesidade deve ter no máximo 10 caracteres"
)
const bodyTypeInput = measurementText.max(
  15,
  "O tipo de corpo deve ter no máximo 15 caracteres"
)

export const bodyIndexSchema = z
  .object({
    weight: measurementNumber,
    bmi: measurementNumber,
    bodyFatPercentage: measurementNumber,
    muscleRatePercentage: measurementNumber,
    leanBodyMass: measurementNumber,
    subcutaneousFatPercentage: measurementNumber,
    visceralFat: measurementNumber,
    bodyWaterPercentage: measurementNumber,
    skeletalMusclePercentage: measurementNumber,
    muscleMass: measurementNumber,
    boneMass: measurementNumber,
    proteinPercentage: measurementNumber,
    dailyCalories: measurementInteger,
    bodyAge: measurementInteger,
    fatMass: measurementNumber,
    waterWeight: measurementNumber,
    proteinMass: measurementNumber,
    idealBodyWeight: measurementNumber,
    obesityLevel: measurementText,
    bodyType: measurementText,
  })
  .partial()
  .strict()

const bodyIndexInputSchema = bodyIndexSchema.extend({
  obesityLevel: obesityLevelInput.optional(),
  bodyType: bodyTypeInput.optional(),
})

export const circumferencesSchema = z
  .object({
    chest: measurementNumber,
    contractedArmLeft: measurementNumber,
    contractedArmRight: measurementNumber,
    hip: measurementNumber,
    relaxedArmLeft: measurementNumber,
    relaxedArmRight: measurementNumber,
    abdomen: measurementNumber,
    waist: measurementNumber,
    forearmLeft: measurementNumber,
    forearmRight: measurementNumber,
    thighLeft: measurementNumber,
    thighRight: measurementNumber,
    scapular: measurementNumber,
    calfLeft: measurementNumber,
    calfRight: measurementNumber,
  })
  .partial()
  .strict()

export const skinfoldsSchema = z
  .object({
    triceps: measurementNumber,
    subscapular: measurementNumber,
    midAxillary: measurementNumber,
    abdominal: measurementNumber,
    thigh: measurementNumber,
    calf: measurementNumber,
    biceps: measurementNumber,
    suprailiac: measurementNumber,
  })
  .partial()
  .strict()

const assessmentSchema = z
  .object({
    assessmentDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    bodyIndex: bodyIndexSchema,
    circumferences: circumferencesSchema,
    skinfolds: skinfoldsSchema,
  })
  .strict()

export const assessmentInputSchema = assessmentSchema
  .extend({ bodyIndex: bodyIndexInputSchema })
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
        .some(item => item !== undefined)
    )
      context.addIssue({ code: "custom", message: "Informe ao menos uma medição" })
  })

export const bodyAssessmentSchema = assessmentSchema.extend({
  id: z.string().min(1).max(150),
})
export const bodyAssessmentListSchema = z.object({
  assessments: z.array(bodyAssessmentSchema).max(100),
})
export type BodyAssessment = z.infer<typeof bodyAssessmentSchema>
export type BodyAssessmentInput = z.infer<typeof assessmentInputSchema>
