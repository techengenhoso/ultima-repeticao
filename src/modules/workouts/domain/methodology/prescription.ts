import { muscleGroupValues } from "@/lib/values-zod"
import type { MuscleGroup } from "@/modules/exercises/domain/exercise"
import {
  type ExerciseRules,
  type Goal,
  type MethodologyInput,
  methodologyInputSchema,
  type WorkoutPrescription,
} from "./types"

const rules = (
  sets: [number, number],
  repetitions: string,
  rest: [number, number],
  rir: [number, number]
): ExerciseRules => ({
  sets: { min: sets[0], max: sets[1] },
  repetitions: [repetitions],
  restSeconds: { min: Math.min(rest[0], 60), max: Math.min(rest[1], 60) },
  targetRir: { min: rir[0], max: rir[1] },
})
const goalRules: Record<
  Goal,
  { compound: ExerciseRules; isolation: ExerciseRules; guidance: string[] }
> = {
  hypertrophy: {
    compound: rules([3, 4], "6-12", [90, 180], [1, 3]),
    isolation: rules([2, 4], "10-20", [60, 120], [1, 3]),
    guidance: ["Começar pelo volume conservador e priorizar boa execução"],
  },
  strength: {
    compound: rules([3, 5], "3-6", [180, 300], [1, 3]),
    isolation: rules([2, 4], "6-12", [90, 180], [1, 3]),
    guidance: ["Priorizar exercícios compostos como movimentos principais"],
  },
  weightLoss: {
    compound: rules([2, 4], "6-15", [60, 150], [2, 4]),
    isolation: rules([2, 4], "10-20", [60, 150], [2, 4]),
    guidance: [
      "Manter fundamentos de força e hipertrofia sem transformar o treino em circuito",
      "Não prescrever dieta ou déficit calórico",
    ],
  },
  conditioning: {
    compound: rules([2, 3], "8-20", [45, 120], [2, 4]),
    isolation: rules([2, 3], "8-20", [45, 120], [2, 4]),
    guidance: [
      "Priorizar movimentos globais",
      "Evitar movimentos tecnicamente complexos sob fadiga",
      "Circuitos são opcionais e dependem de experiência e execução adequada",
    ],
  },
  qualityOfLife: {
    compound: rules([1, 3], "8-15", [60, 120], [2, 4]),
    isolation: rules([1, 3], "8-15", [60, 120], [2, 4]),
    guidance: [
      "Priorizar segurança, simplicidade e aderência",
      "Cobrir agachar, dobrar o quadril, empurrar, puxar e estabilizar sem complexidade desnecessária",
    ],
  },
}
const volumeByExperience = {
  beginner: [6, 10],
  basic: [8, 12],
  intermediate: [10, 16],
  advanced: [12, 18],
  expert: [12, 18],
} as const
const mainGroups: MuscleGroup[] = [
  "chest",
  "back",
  "quadriceps",
  "hamstrings",
  "glutes",
  "shoulders",
]

function volumeLimits({
  goal,
  experienceLevel,
  daysPerWeek,
  durationMinutes,
}: MethodologyInput) {
  const [baseMin, baseMax] = volumeByExperience[experienceLevel]
  const min =
    goal === "qualityOfLife"
      ? Math.min(baseMin, 4)
      : goal === "hypertrophy"
        ? baseMin
        : Math.min(baseMin, 8)
  const max =
    goal === "qualityOfLife"
      ? 8
      : goal === "hypertrophy"
        ? experienceLevel === "expert" && daysPerWeek >= 4 && durationMinutes >= 60
          ? 20
          : baseMax
        : Math.min(baseMax, 14)
  return { min, max }
}

export function createWorkoutPrescription(
  rawInput: MethodologyInput
): WorkoutPrescription {
  const input = methodologyInputSchema.parse(rawInput)
  const {
    goal,
    experienceLevel,
    daysPerWeek,
    durationMinutes,
    priorityMuscleGroups,
    excludedMuscleGroups,
  } = input
  const selected = structuredClone(goalRules[goal])
  const novice = experienceLevel === "beginner" || experienceLevel === "basic"
  const splits: Record<number, string[]> = {
    1: ["Corpo inteiro"],
    2: ["Corpo inteiro A", "Corpo inteiro B"],
    3:
      novice || durationMinutes < 45
        ? ["Corpo inteiro A", "Corpo inteiro B", "Corpo inteiro C"]
        : ["Superior", "Inferior", "Corpo inteiro"],
    4: ["Superior A", "Inferior A", "Superior B", "Inferior B"],
    5: ["Superior", "Inferior", "Empurrar", "Puxar", "Pernas"],
    6: ["Empurrar A", "Puxar A", "Pernas A", "Empurrar B", "Puxar B", "Pernas B"],
    7: [
      "Empurrar A",
      "Puxar A",
      "Pernas A",
      "Empurrar B",
      "Puxar B",
      "Pernas B",
      "Complementar",
    ],
  }
  const trainingWeekdays = (
    {
      1: [0],
      2: [0, 3],
      3: [0, 2, 4],
      4: [0, 1, 3, 4],
      5: [0, 1, 3, 4, 5],
      6: [0, 1, 2, 3, 4, 5],
      7: [0, 1, 2, 3, 4, 5, 6],
    } as Record<number, number[]>
  )[daysPerWeek]
  const { min, max } = volumeLimits(input)
  const maxExercisesPerDay = Math.max(
    1,
    Math.min(
      novice ? 6 : 10,
      Math.floor(
        (durationMinutes * 60 - 300) /
          (selected.compound.sets.min * (60 + selected.compound.restSeconds.min) + 60)
      )
    )
  )
  const weeklyVolumeByMuscleGroup = Object.fromEntries(
    muscleGroupValues.map(group => {
      const excluded = excludedMuscleGroups.includes(group)
      const required = mainGroups.includes(group) || priorityMuscleGroups.includes(group)
      return [
        group,
        excluded
          ? { min: 0, target: 0, max: 0 }
          : {
              min: required ? min : 0,
              target: required
                ? Math.min(max, min + (priorityMuscleGroups.includes(group) ? 2 : 0))
                : 0,
              max,
            },
      ]
    })
  ) as WorkoutPrescription["weeklyVolumeByMuscleGroup"]
  const feasibilityWarnings: string[] = []
  const requiredSets = Object.values(weeklyVolumeByMuscleGroup).reduce(
    (sum, volume) => sum + volume.target,
    0
  )
  const conservativeSetSeconds = 60 + selected.compound.restSeconds.min
  if (
    requiredSets * conservativeSetSeconds >
      trainingWeekdays.length * (durationMinutes * 60 - 300) ||
    requiredSets >
      trainingWeekdays.length * maxExercisesPerDay * selected.compound.sets.max
  )
    feasibilityWarnings.push(
      "O volume foi adaptado ao tempo disponível, confira a distribuição dos grupos musculares antes de salvar"
    )
  return {
    goal,
    experienceLevel,
    daysPerWeek,
    durationMinutes,
    suggestedSplit: splits[daysPerWeek],
    trainingWeekdays,
    weeklyVolumeByMuscleGroup,
    compoundExerciseRules: selected.compound,
    isolationExerciseRules: selected.isolation,
    preferredFrequencyByMuscleGroup: 2,
    maxExercisesPerDay,
    priorityMuscleGroups,
    excludedMuscleGroups,
    guidance: [
      ...selected.guidance,
      "Distribuir os estímulos intensos com pelo menos um dia de recuperação por grupo",
      ...(novice && daysPerWeek >= 5
        ? ["Dias adicionais devem ser leves, com volume reduzido e foco na técnica"]
        : []),
      ...(priorityMuscleGroups.length
        ? [
            "Distribuir o volume prioritário entre as sessões compatíveis, sem somar sessões intensas consecutivas",
          ]
        : []),
    ],
    feasibilityWarnings,
  }
}
