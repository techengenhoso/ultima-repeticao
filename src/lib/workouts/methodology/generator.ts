import type { MuscleGroup } from "@/lib/exercises/types"
import type { AvailableExercise } from "@/lib/workouts/ai/available-exercises"
import type { AiWorkoutInput } from "@/lib/workouts/ai/schemas"
import type { WorkoutExercise, WorkoutFormValues } from "@/lib/workouts/types"
import type { WorkoutPrescription } from "./types"
import { estimateSessionMinutes, validateWorkoutPlan } from "./validation"

type Pack = WorkoutExercise[]
type Distribution = { day: number; pack: Pack }[]
const key = (item: AvailableExercise) => `${item.source}:${item.exerciseId}`
const lower: MuscleGroup[] = [
  "quadriceps",
  "hamstrings",
  "glutes",
  "calves",
  "adductors",
  "lowerBack",
]
const push: MuscleGroup[] = ["chest", "shoulders", "triceps"]
const pull: MuscleGroup[] = ["back", "biceps", "forearms"]

function eligible(group: MuscleGroup, name: string) {
  if (group === "core" || group === "fullBody") return true
  if (name.startsWith("Superior")) return !lower.includes(group)
  if (name.startsWith("Inferior") || name.startsWith("Pernas"))
    return lower.includes(group)
  if (name.startsWith("Empurrar")) return push.includes(group)
  if (name.startsWith("Puxar")) return pull.includes(group)
  return true
}

function makeExercise(
  item: AvailableExercise,
  sets: number,
  prescription: WorkoutPrescription
): WorkoutExercise {
  const rules =
    item.kind === "compound"
      ? prescription.compoundExerciseRules
      : prescription.isolationExerciseRules
  return {
    id: key(item),
    order: 0,
    exerciseReference: { source: item.source, exerciseId: item.exerciseId },
    exerciseSnapshot: { name: item.name, muscleGroup: item.muscleGroup },
    sets,
    repetitions: rules.repetitions[0],
    restSeconds: rules.restSeconds.min,
    targetRir: rules.targetRir.max,
    initialLoad: Number.NaN,
  }
}

function packsFor(
  total: number,
  candidates: AvailableExercise[],
  prescription: WorkoutPrescription
): Pack[] {
  const results: Pack[] = []
  let visited = 0
  function search(remaining: number, start: number, pack: Pack) {
    if (++visited > 500 || results.length >= 3) return
    if (!remaining) {
      results.push(pack)
      return
    }
    if (pack.length >= 4) return
    for (let index = start; index < candidates.length; index++) {
      const item = candidates[index]
      const rules =
        item.kind === "compound"
          ? prescription.compoundExerciseRules
          : prescription.isolationExerciseRules
      for (let sets = Math.min(remaining, rules.sets.max); sets >= rules.sets.min; sets--)
        search(remaining - sets, index + 1, [
          ...pack,
          makeExercise(item, sets, prescription),
        ])
    }
  }
  search(total, 0, [])
  return results.sort((a, b) => a.length - b.length)
}

function distributions(
  group: MuscleGroup,
  total: number,
  candidates: AvailableExercise[],
  prescription: WorkoutPrescription,
  frequency: number
) {
  const choices: Distribution[] = []
  const days = prescription.trainingWeekdays
    .map((_, index) => index)
    .filter(index => eligible(group, prescription.suggestedSplit[index]))
  const cache = new Map<number, Pack[]>()
  let visited = 0
  function search(position: number, remaining: number, selected: Distribution) {
    if (++visited > 12000 || choices.length >= 600) return
    if (!remaining) {
      if (selected.length >= frequency) choices.push(selected)
      return
    }
    if (position === days.length) return
    const day = days[position]
    const weekday = prescription.trainingWeekdays[day]
    const adjacent = selected.some(
      item => Math.abs(prescription.trainingWeekdays[item.day] - weekday) === 1
    )
    if (!adjacent) allocate(position, remaining, selected, day)
    search(position + 1, remaining, selected)
  }
  function allocate(
    position: number,
    remaining: number,
    selected: Distribution,
    day: number
  ) {
    for (let sets = 1; sets <= remaining; sets++) {
      if (!cache.has(sets)) cache.set(sets, packsFor(sets, candidates, prescription))
      for (const pack of cache.get(sets) ?? [])
        search(position + 1, remaining - sets, [...selected, { day, pack }])
    }
  }
  search(0, total, [])
  return choices
}

function planFrom(
  days: Pack[],
  input: AiWorkoutInput,
  prescription: WorkoutPrescription,
  classifications: Map<string, string>
): WorkoutFormValues {
  return {
    name: input.name,
    description: "Ficha montada automaticamente pelas regras de planejamento",
    days: days.map((exercises, index) => ({
      id: `day-${index}`,
      name: prescription.suggestedSplit[index],
      order: index,
      muscleGroups: [...new Set(exercises.map(item => item.exerciseSnapshot.muscleGroup))],
      exercises: [...exercises]
        .sort(
          (a, b) =>
            Number(classifications.get(b.id) === "compound") -
            Number(classifications.get(a.id) === "compound")
        )
        .map((item, order) => ({ ...item, id: `day-${index}-${item.id}`, order })),
    })),
  }
}

// Tenta primeiro a distribuição dos alvos; usa uma montagem adaptada se necessário.
export function buildWorkout(
  input: AiWorkoutInput,
  prescription: WorkoutPrescription,
  available: AvailableExercise[],
  variant = 0
): WorkoutFormValues | null {
  const preferred = new Set(input.preferredExercises)
  const classifications = new Map(available.map(item => [key(item), item.kind]))
  const groups = Object.entries(prescription.weeklyVolumeByMuscleGroup)
    .flatMap(([name, volume]) => {
      const group = name as MuscleGroup
      const candidates = available.filter(item => item.muscleGroup === group)
      const rotated = candidates
        .map((item, index) => ({
          item,
          rank: (index + variant) % Math.max(1, candidates.length),
        }))
        .sort(
          (a, b) =>
            Number(preferred.has(key(b.item))) - Number(preferred.has(key(a.item))) ||
            Number(b.item.kind === "compound") - Number(a.item.kind === "compound") ||
            a.rank - b.rank
        )
        .slice(0, 12)
        .map(value => value.item)
      const hasPreferred = candidates.some(item => preferred.has(key(item)))
      if (!volume.min && !hasPreferred) return []
      const minimum =
        volume.min ||
        Math.min(
          prescription.compoundExerciseRules.sets.min,
          prescription.isolationExerciseRules.sets.min
        )
      const options = distributions(
        group,
        Math.max(minimum, volume.target),
        rotated,
        prescription,
        volume.min > 0 ? Math.min(2, prescription.trainingWeekdays.length) : 1
      )
      return [{ group, options }]
    })
    .sort((a, b) => a.options.length - b.options.length)
  let visited = 0
  const deadline = Date.now() + 1500
  const days: Pack[] = prescription.trainingWeekdays.map(() => [])
  function search(index: number): WorkoutFormValues | null {
    if (++visited > 15000 || Date.now() > deadline) return null
    if (index === groups.length) return validatedPlan()
    const options = [...groups[index].options].sort((a, b) => cost(a) - cost(b))
    for (const option of options) {
      if (!fits(option)) continue
      apply(option, false)
      const result = search(index + 1)
      apply(option, true)
      if (result) return result
    }
    return null
  }
  function validatedPlan() {
    const plan = planFrom(days, input, prescription, classifications)
    return validateWorkoutPlan(plan, prescription, classifications).some(
      issue => issue.severity === "error"
    )
      ? null
      : plan
  }
  function apply(option: Distribution, revert: boolean) {
    for (const item of option) {
      if (revert)
        days[item.day].splice(days[item.day].length - item.pack.length, item.pack.length)
      else days[item.day].push(...item.pack)
    }
  }
  function cost(option: Distribution) {
    return option.reduce(
      (sum, item) => sum + (days[item.day].length + item.pack.length) ** 2,
      0
    )
  }
  function fits(option: Distribution) {
    return option.every(item => {
      const exercises = [...days[item.day], ...item.pack]
      const minutes = estimateSessionMinutes({
        id: "candidate",
        name: "Dia",
        order: item.day,
        muscleGroups: [],
        exercises,
      })
      return (
        exercises.length <= prescription.maxExercisesPerDay &&
        minutes !== null &&
        minutes <= prescription.durationMinutes
      )
    })
  }
  return search(0) ?? buildAdaptedWorkout(input, prescription, available, variant)
}

// Mantém exercícios reais e exclusões, adaptando o volume ao tempo disponível.
export function buildAdaptedWorkout(
  input: AiWorkoutInput,
  prescription: WorkoutPrescription,
  available: AvailableExercise[],
  variant = 0
): WorkoutFormValues | null {
  if (!available.length) return null
  const preferred = new Set(input.preferredExercises)
  const usage = new Map<string, number>()
  const volume = new Map<MuscleGroup, number>()
  const days: Pack[] = []
  const volumeFor = (group: MuscleGroup) => volume.get(group) ?? 0
  const usageFor = (item: AvailableExercise) => usage.get(key(item)) ?? 0
  function buildDay(index: number) {
    const exercises: Pack = []
    const candidates = [...available].sort((a, b) => {
      const rank = (item: AvailableExercise) =>
        usageFor(item) * 100 +
        volumeFor(item.muscleGroup) * 10 -
        Number(preferred.has(key(item))) * 50 -
        Number(input.priorityMuscleGroups.includes(item.muscleGroup)) * 20 -
        Number(eligible(item.muscleGroup, prescription.suggestedSplit[index])) * 10
      return (
        rank(a) - rank(b) ||
        ((available.indexOf(a) + variant) % available.length) -
          ((available.indexOf(b) + variant) % available.length)
      )
    })
    candidates.forEach(item => {
      if (exercises.length >= prescription.maxExercisesPerDay) return
      const rules =
        item.kind === "compound"
          ? prescription.compoundExerciseRules
          : prescription.isolationExerciseRules
      const exercise = makeExercise(item, rules.sets.min, prescription)
      const target = prescription.weeklyVolumeByMuscleGroup[item.muscleGroup].target
      if (exercises.length && volumeFor(item.muscleGroup) >= target) return
      const minutes = estimateSessionMinutes({
        id: "candidate",
        name: "Dia",
        order: index,
        muscleGroups: [],
        exercises: [...exercises, exercise],
      })
      if (minutes === null || minutes > prescription.durationMinutes) return
      exercises.push(exercise)
      usage.set(key(item), usageFor(item) + 1)
      volume.set(item.muscleGroup, volumeFor(item.muscleGroup) + exercise.sets)
    })
    return exercises
  }
  for (let index = 0; index < prescription.trainingWeekdays.length; index++) {
    const exercises = buildDay(index)
    if (!exercises.length) return null
    days.push(exercises)
  }
  const plan = planFrom(
    days,
    input,
    prescription,
    new Map(available.map(item => [key(item), item.kind]))
  )
  plan.days.forEach((day, index) => {
    day.name = `Treino ${index + 1}`
  })
  plan.description =
    "Ficha adaptada ao tempo e aos exercícios disponíveis, revise os avisos antes de salvar"
  return plan
}
