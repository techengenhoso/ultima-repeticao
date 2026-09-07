export type AssessmentGroup = "bodyIndex" | "circumferences" | "skinfolds"

export type FieldDefinition = {
  group: AssessmentGroup
  key: string
  label: string
  unit?: string
  placeholder?: string
  integer?: boolean
  text?: boolean
}

const integerFields = new Set(["dailyCalories", "bodyAge"])

const placeholders: Record<string, string> = {
  weight: "Ex: 99,20",
  bmi: "Ex: 25,80",
  bodyFatPercentage: "Ex: 16,60",
  muscleRatePercentage: "Ex: 77,80",
  leanBodyMass: "Ex: 82,70",
  subcutaneousFatPercentage: "Ex: 11,90",
  visceralFat: "Ex: 5,00",
  bodyWaterPercentage: "Ex: 61,10",
  skeletalMusclePercentage: "Ex: 48,30",
  muscleMass: "Ex: 77,20",
  boneMass: "Ex: 5,50",
  proteinPercentage: "Ex: 16,70",
  dailyCalories: "Ex: 2156",
  bodyAge: "Ex: 31",
  fatMass: "Ex: 16,50",
  waterWeight: "Ex: 60,60",
  proteinMass: "Ex: 16,60",
  idealBodyWeight: "Ex: 84,50",
  obesityLevel: "Ex: Alto",
  bodyType: "Ex: Ligeira obesidade",
  chest: "Ex: 101,00",
  hip: "Ex: 106,50",
  abdomen: "Ex: 89,50",
  waist: "Ex: 94,00",
  scapular: "Ex: 0,00",
  contractedArmLeft: "Ex: 36,50",
  contractedArmRight: "Ex: 36,00",
  relaxedArmLeft: "Ex: 35,50",
  relaxedArmRight: "Ex: 35,50",
  forearmLeft: "Ex: 29,00",
  forearmRight: "Ex: 29,50",
  thighLeft: "Ex: 63,00",
  thighRight: "Ex: 63,50",
  calfLeft: "Ex: 45,20",
  calfRight: "Ex: 42,00",
  triceps: "Ex: 20,00",
  subscapular: "Ex: 12,00",
  midAxillary: "Ex: 10,00",
  abdominal: "Ex: 20,00",
  thigh: "Ex: 17,00",
  calf: "Ex: 0,00",
  biceps: "Ex: 10,00",
  suprailiac: "Ex: 15,00",
}

const fields = (
  group: AssessmentGroup,
  items: Array<[string, string, string?]>
): FieldDefinition[] =>
  items.map(([key, label, unit]) => ({
    group,
    key,
    label,
    ...(unit ? { unit } : {}),
    ...(placeholders[key] ? { placeholder: placeholders[key] } : {}),
    ...(integerFields.has(key) ? { integer: true } : {}),
  }))

export const assessmentFields: FieldDefinition[] = [
  ...fields("bodyIndex", [
    ["weight", "Peso", "kg"],
    ["bmi", "IMC"],
    ["bodyFatPercentage", "Gordura corporal", "%"],
    ["muscleRatePercentage", "Taxa muscular", "%"],
    ["leanBodyMass", "Massa corporal magra", "kg"],
    ["subcutaneousFatPercentage", "Gordura subcutânea", "%"],
    ["visceralFat", "Gordura visceral"],
    ["bodyWaterPercentage", "Água corporal", "%"],
    ["skeletalMusclePercentage", "Músculo esquelético", "%"],
    ["muscleMass", "Massa muscular", "kg"],
    ["boneMass", "Massa óssea", "kg"],
    ["proteinPercentage", "Proteína", "%"],
    ["dailyCalories", "Calorias diárias", "kcal"],
    ["bodyAge", "Idade corporal", "anos"],
    ["fatMass", "Massa gorda", "kg"],
    ["waterWeight", "Peso da água", "kg"],
    ["proteinMass", "Massa de proteína", "kg"],
    ["idealBodyWeight", "Peso corporal ideal", "kg"],
    ["obesityLevel", "Nível de obesidade"],
    ["bodyType", "Tipo de corpo"],
  ]).map(item =>
    item.key === "obesityLevel" || item.key === "bodyType" ? { ...item, text: true } : item
  ),
  ...fields("circumferences", [
    ["contractedArmLeft", "Braço contraído esquerdo", "cm"],
    ["contractedArmRight", "Braço contraído direito", "cm"],
    ["relaxedArmLeft", "Braço relaxado esquerdo", "cm"],
    ["relaxedArmRight", "Braço relaxado direito", "cm"],
    ["forearmLeft", "Antebraço esquerdo", "cm"],
    ["forearmRight", "Antebraço direito", "cm"],
    ["thighLeft", "Coxa esquerda", "cm"],
    ["thighRight", "Coxa direita", "cm"],
    ["calfLeft", "Panturrilha esquerda", "cm"],
    ["calfRight", "Panturrilha direita", "cm"],
    ["chest", "Tórax", "cm"],
    ["hip", "Quadril", "cm"],
    ["abdomen", "Abdômen", "cm"],
    ["waist", "Cintura", "cm"],
    ["scapular", "Escapular", "cm"],
  ]),
  ...fields("skinfolds", [
    ["triceps", "Tricipital", "%"],
    ["subscapular", "Subescapular", "%"],
    ["midAxillary", "Axilar média", "%"],
    ["abdominal", "Abdominal", "%"],
    ["thigh", "Coxa", "%"],
    ["calf", "Panturrilha", "%"],
    ["biceps", "Bicipital", "%"],
    ["suprailiac", "Supra-ilíaca", "%"],
  ]),
]

export const groups: Array<{ key: AssessmentGroup; label: string }> = [
  { key: "bodyIndex", label: "Índice corporal" },
  { key: "circumferences", label: "Circunferências" },
  { key: "skinfolds", label: "Dobras cutâneas" },
]

export const fieldFor = (group: AssessmentGroup, key: string) =>
  assessmentFields.find(item => item.group === group && item.key === key)
