import type { MuscleGroup } from "@/modules/exercises/domain/exercise"
import type { WorkoutExercise, WorkoutFormValues } from "@/modules/workouts/domain/workout"
import type { AvailableExercise } from "../generation/available-exercises"
import type { WorkoutGenerationInput } from "../generation/types"
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
    initialLoad: 0,
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
  input: WorkoutGenerationInput,
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

function scheduledConsecutively(
  first: number,
  second: number,
  trainingWeekdays: number[]
) {
  const firstWeekday = trainingWeekdays[first]
  const secondWeekday = trainingWeekdays[second]
  return (
    (firstWeekday + 1) % 7 === secondWeekday || (secondWeekday + 1) % 7 === firstWeekday
  )
}

function groupVolume(exercises: Pack, group: MuscleGroup) {
  return exercises
    .filter(exercise => exercise.exerciseSnapshot.muscleGroup === group)
    .reduce((sum, exercise) => sum + exercise.sets, 0)
}

function rulesFor(item: AvailableExercise, prescription: WorkoutPrescription) {
  return item.kind === "compound"
    ? prescription.compoundExerciseRules
    : prescription.isolationExerciseRules
}

function hasExercise(day: Pack, item: AvailableExercise) {
  return day.some(
    exercise =>
      exercise.exerciseReference.source === item.source &&
      exercise.exerciseReference.exerciseId === item.exerciseId
  )
}

function createCompletionMetrics(days: Pack[]) {
  const volume = new Map<MuscleGroup, number>()
  const usage = new Map<string, number>()
  for (const day of days)
    for (const exercise of day) {
      const group = exercise.exerciseSnapshot.muscleGroup
      volume.set(group, (volume.get(group) ?? 0) + exercise.sets)
      const exerciseKey = `${exercise.exerciseReference.source}:${exercise.exerciseReference.exerciseId}`
      usage.set(exerciseKey, (usage.get(exerciseKey) ?? 0) + 1)
    }
  return { volume, usage }
}

type DurationCandidate = {
  item: AvailableExercise
  sets: number
  minutes: number
}

function durationCandidateFor(
  day: Pack,
  dayIndex: number,
  days: Pack[],
  item: AvailableExercise,
  prescription: WorkoutPrescription,
  volume: Map<MuscleGroup, number>
) {
  if (
    !eligible(item.muscleGroup, prescription.suggestedSplit[dayIndex]) ||
    hasExercise(day, item)
  )
    return null

  const rules = rulesFor(item, prescription)
  const remainingWeeklyVolume =
    prescription.weeklyVolumeByMuscleGroup[item.muscleGroup].max -
    (volume.get(item.muscleGroup) ?? 0)

  for (
    let sets = Math.min(rules.sets.max, remainingWeeklyVolume);
    sets >= rules.sets.min;
    sets--
  ) {
    const proposedVolume = groupVolume(day, item.muscleGroup) + sets
    const overloadsConsecutiveSession =
      proposedVolume >= 3 &&
      days.some(
        (otherDay, index) =>
          index !== dayIndex &&
          scheduledConsecutively(index, dayIndex, prescription.trainingWeekdays) &&
          groupVolume(otherDay, item.muscleGroup) >= 3
      )
    if (overloadsConsecutiveSession) continue

    const minutes = estimateSessionMinutes({
      id: "candidate",
      name: "Dia",
      order: dayIndex,
      muscleGroups: [],
      exercises: [...day, makeExercise(item, sets, prescription)],
    })
    if (minutes !== null && minutes <= prescription.durationMinutes)
      return { item, sets, minutes }
  }

  return null
}

function compareDurationCandidates(
  input: WorkoutGenerationInput,
  available: AvailableExercise[],
  volume: Map<MuscleGroup, number>,
  usage: Map<string, number>,
  variant: number
) {
  return (a: DurationCandidate, b: DurationCandidate) => {
    const aKey = key(a.item)
    const bKey = key(b.item)
    return (
      b.minutes - a.minutes ||
      Number(input.preferredExercises.includes(bKey)) -
        Number(input.preferredExercises.includes(aKey)) ||
      (volume.get(a.item.muscleGroup) ?? 0) - (volume.get(b.item.muscleGroup) ?? 0) ||
      (usage.get(aKey) ?? 0) - (usage.get(bKey) ?? 0) ||
      ((available.indexOf(a.item) + variant) % available.length) -
        ((available.indexOf(b.item) + variant) % available.length)
    )
  }
}

function completeSessionsToTargetDuration(
  days: Pack[],
  input: WorkoutGenerationInput,
  prescription: WorkoutPrescription,
  available: AvailableExercise[],
  variant: number
) {
  const { volume, usage } = createCompletionMetrics(days)

  for (let dayIndex = 0; dayIndex < days.length; dayIndex++) {
    while (days[dayIndex].length < prescription.maxExercisesPerDay) {
      const candidate = [...available]
        .map(item =>
          durationCandidateFor(days[dayIndex], dayIndex, days, item, prescription, volume)
        )
        .filter((item): item is DurationCandidate => item !== null)
        .sort(compareDurationCandidates(input, available, volume, usage, variant))[0]
      if (!candidate) break
      const exercise = makeExercise(candidate.item, candidate.sets, prescription)
      days[dayIndex].push(exercise)
      volume.set(
        candidate.item.muscleGroup,
        (volume.get(candidate.item.muscleGroup) ?? 0) + exercise.sets
      )
      const itemKey = key(candidate.item)
      usage.set(itemKey, (usage.get(itemKey) ?? 0) + 1)
    }
  }
}

// Tenta primeiro a distribuição dos alvos; usa uma montagem adaptada se necessário.
export function buildWorkout(
  input: WorkoutGenerationInput,
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
    const completedDays = days.map(day => [...day])
    completeSessionsToTargetDuration(
      completedDays,
      input,
      prescription,
      available,
      variant
    )
    const plan = planFrom(completedDays, input, prescription, classifications)
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
  input: WorkoutGenerationInput,
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
  completeSessionsToTargetDuration(days, input, prescription, available, variant)
  const plan = planFrom(
    days,
    input,
    prescription,
    new Map(available.map(item => [key(item), item.kind]))
  )
  plan.days.forEach((day, index) => {
    day.name = `Treino ${index + 1}`
  })
  plan.description = "Ficha criada automaticamente"
  return plan
}
