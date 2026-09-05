import type { MuscleGroup } from "@/lib/exercises/types"
import { muscleGroupLabel } from "@/lib/exercises/types"
import { muscleGroupValues } from "@/lib/values-zod"
import { parseRepetitions } from "@/lib/workouts/repetitions"
import { workoutFormSchema } from "@/lib/workouts/schemas"
import type { WorkoutDay, WorkoutExercise } from "@/lib/workouts/types"
import type { ExerciseKind, ExerciseRules, Range, WorkoutPrescription } from "./types"

export type MethodologyIssue = {
  code: string
  severity: "error" | "warning"
  path: (string | number)[]
  message: string
  actual?: number
  expected?: Range
}
// Metadados fornecidos pelo chamador, nunca inferidos pelo nome ou pela IA.
export type ExerciseClassification = ReadonlyMap<string, ExerciseKind>
type Path = MethodologyIssue["path"]
const within = (value: number, range: Range) =>
  Number.isFinite(value) && value >= range.min && value <= range.max
const referenceKey = (exercise: WorkoutExercise) =>
  `${exercise.exerciseReference.source}:${exercise.exerciseReference.exerciseId}`
const issue = (
  code: string,
  message: string,
  path: Path,
  severity: "error" | "warning" = "error"
): MethodologyIssue => ({
  code,
  message,
  path,
  severity: ["weekly_volume", "compound_priority", "recovery"].includes(code)
    ? "warning"
    : severity,
})
const hasDuplicate = <T>(items: T[]) => new Set(items).size !== items.length

export function calculateWeeklyVolume(days: WorkoutDay[]) {
  const volume = Object.fromEntries(muscleGroupValues.map(group => [group, 0])) as Record<
    MuscleGroup,
    number
  >
  for (const day of days)
    for (const exercise of day.exercises)
      volume[exercise.exerciseSnapshot.muscleGroup] += exercise.sets
  return volume
}

export function estimateSessionMinutes(day: WorkoutDay) {
  // Cinco minutos iniciais, quatro segundos por repetição e um minuto entre exercícios.
  let seconds = 300 + Math.max(0, day.exercises.length - 1) * 60
  for (const exercise of day.exercises) {
    const repetitions = parseRepetitions(exercise.repetitions)
    if (!repetitions || exercise.restSeconds === undefined) return null
    seconds +=
      exercise.sets * repetitions.max * 4 +
      Math.max(0, exercise.sets - 1) * exercise.restSeconds
  }
  return Math.ceil(seconds / 60)
}

export function validateExercisePrescription(
  exercise: WorkoutExercise,
  rules: ExerciseRules,
  path: Path = []
) {
  const issues: MethodologyIssue[] = []
  const labels = { sets: "séries", restSeconds: "descanso", targetRir: "RIR" }
  for (const field of ["sets", "restSeconds", "targetRir"] as const) {
    const value = exercise[field]
    if (
      value === undefined ||
      !within(value, rules[field]) ||
      (field !== "restSeconds" && !Number.isInteger(value))
    )
      issues.push({
        ...issue(
          field,
          `Use ${labels[field]} entre ${rules[field].min} e ${rules[field].max}`,
          [...path, field]
        ),
        actual: value,
        expected: rules[field],
      })
  }
  const repetitions = parseRepetitions(exercise.repetitions)
  const validRepetitions =
    repetitions &&
    rules.repetitions.some(value => {
      const allowed = parseRepetitions(value)
      return allowed && repetitions.min >= allowed.min && repetitions.max <= allowed.max
    })
  if (!validRepetitions)
    issues.push(
      issue("repetitions", `Use repetições dentro de ${rules.repetitions.join(" ou ")}`, [
        ...path,
        "repetitions",
      ])
    )
  return issues
}

function validateExercise(
  exercise: WorkoutExercise,
  prescription: WorkoutPrescription,
  classifications: ExerciseClassification,
  path: Path
) {
  const issues: MethodologyIssue[] = []
  if (prescription.excludedMuscleGroups.includes(exercise.exerciseSnapshot.muscleGroup))
    issues.push(
      issue("excluded_group", "Este grupo muscular foi excluído da prescrição", path)
    )
  const kind = classifications.get(referenceKey(exercise))
  if (!kind)
    issues.push(
      issue(
        "missing_classification",
        "Informe se o exercício é composto ou isolado para validar a prescrição",
        path
      )
    )
  else
    issues.push(
      ...validateExercisePrescription(
        exercise,
        kind === "compound"
          ? prescription.compoundExerciseRules
          : prescription.isolationExerciseRules,
        path
      )
    )
  return issues
}

function validateDayStructure(
  day: WorkoutDay,
  prescription: WorkoutPrescription,
  classifications: ExerciseClassification,
  path: Path
) {
  const issues: MethodologyIssue[] = []
  if (day.exercises.length > prescription.maxExercisesPerDay)
    issues.push(
      issue(
        "exercise_count",
        `Use no máximo ${prescription.maxExercisesPerDay} exercícios nesta sessão`,
        [...path, "exercises"]
      )
    )
  if (
    hasDuplicate(day.exercises.map(item => item.id)) ||
    hasDuplicate(day.exercises.map(item => item.order))
  )
    issues.push(
      issue(
        "duplicate_order",
        "Os exercícios precisam de identificadores e ordens diferentes",
        [...path, "exercises"]
      )
    )
  const seen = new Set<string>()
  day.exercises.forEach((exercise, index) => {
    const exercisePath = [...path, "exercises", index]
    if (seen.has(referenceKey(exercise)))
      issues.push(
        issue("duplicate_exercise", "Exercício repetido no mesmo dia", exercisePath)
      )
    seen.add(referenceKey(exercise))
    issues.push(...validateExercise(exercise, prescription, classifications, exercisePath))
  })
  const groups = new Set(
    day.exercises.map(exercise => exercise.exerciseSnapshot.muscleGroup)
  )
  if (
    hasDuplicate(day.muscleGroups) ||
    groups.size !== day.muscleGroups.length ||
    day.muscleGroups.some(group => !groups.has(group))
  )
    issues.push(
      issue(
        "muscle_distribution",
        "Os grupos do dia devem corresponder aos exercícios selecionados",
        [...path, "muscleGroups"]
      )
    )
  return issues
}

function validateSession(
  day: WorkoutDay,
  prescription: WorkoutPrescription,
  classifications: ExerciseClassification,
  path: Path
) {
  const issues: MethodologyIssue[] = []
  const compounds = day.exercises.filter(
    exercise => classifications.get(referenceKey(exercise)) === "compound"
  ).length
  if (
    ["strength", "conditioning"].includes(prescription.goal) &&
    compounds < Math.ceil(day.exercises.length / 2)
  )
    issues.push(
      issue("compound_priority", "Priorize movimentos compostos nesta sessão", [
        ...path,
        "exercises",
      ])
    )
  const minutes = estimateSessionMinutes(day)
  if (minutes === null)
    issues.push(
      issue(
        "duration_unknown",
        "Informe repetições e descanso para estimar a duração",
        path
      )
    )
  else if (minutes > prescription.durationMinutes)
    issues.push({
      ...issue(
        "duration",
        `Duração estimada de ${minutes} minutos excede os ${prescription.durationMinutes} disponíveis`,
        path
      ),
      actual: minutes,
    })
  return issues
}

function intenseVolume(day: WorkoutDay) {
  return calculateWeeklyVolume([
    {
      ...day,
      exercises: day.exercises.filter(
        exercise => exercise.targetRir !== undefined && exercise.targetRir <= 3
      ),
    },
  ])
}

export function validateRecovery(days: WorkoutDay[], prescription: WorkoutPrescription) {
  const issues: MethodologyIssue[] = []
  const ordered = days
    .map((day, index) => ({ day, index }))
    .sort((a, b) => a.day.order - b.day.order)
  ordered.forEach(({ day, index }, scheduleIndex) => {
    const weekday = prescription.trainingWeekdays[scheduleIndex]
    const nextIndex = prescription.trainingWeekdays.findIndex(
      value => value === (weekday + 1) % 7
    )
    const next = ordered[nextIndex]?.day
    if (!next) return
    const currentVolume = intenseVolume(day)
    const nextVolume = intenseVolume(next)
    for (const group of muscleGroupValues)
      if (currentVolume[group] >= 3 && nextVolume[group] >= 3)
        issues.push(
          issue(
            "recovery",
            `Evite estímulos intensos de ${muscleGroupLabel[group]} em dias consecutivos`,
            ["days", index, "muscleGroups"]
          )
        )
  })
  return issues
}

export function validateWeeklyVolume(
  days: WorkoutDay[],
  prescription: WorkoutPrescription
) {
  const issues: MethodologyIssue[] = []
  const volume = calculateWeeklyVolume(days)
  for (const group of muscleGroupValues) {
    const allowed = prescription.weeklyVolumeByMuscleGroup[group]
    const path = ["weeklyVolumeByMuscleGroup", group]
    if (!within(volume[group], allowed))
      issues.push({
        ...issue(
          "weekly_volume",
          `Volume de ${muscleGroupLabel[group]}: use entre ${allowed.min} e ${allowed.max} séries semanais`,
          path
        ),
        actual: volume[group],
        expected: allowed,
      })
    else if (volume[group] < allowed.target)
      issues.push(
        issue(
          "target_volume",
          "Volume abaixo do alvo conservador do grupo",
          path,
          "warning"
        )
      )
    const frequency = days.filter(day =>
      day.exercises.some(exercise => exercise.exerciseSnapshot.muscleGroup === group)
    ).length
    if (allowed.min > 0 && frequency < prescription.preferredFrequencyByMuscleGroup)
      issues.push(
        issue(
          "frequency",
          "Distribua o grupo em pelo menos duas sessões semanais",
          path,
          "warning"
        )
      )
  }
  return issues
}

export function validateWorkoutPlan(
  rawPlan: unknown,
  prescription: WorkoutPrescription,
  classifications: ExerciseClassification
) {
  const value =
    rawPlan &&
    typeof rawPlan === "object" &&
    "description" in rawPlan &&
    rawPlan.description === null
      ? { ...rawPlan, description: "" }
      : rawPlan
  const parsed = workoutFormSchema.safeParse(value)
  if (!parsed.success)
    return parsed.error.issues.map(error =>
      issue(
        "invalid_structure",
        error.message,
        error.path.map(part => (typeof part === "number" ? part : String(part)))
      )
    )
  const { days } = parsed.data
  const issues: MethodologyIssue[] = []
  if (days.length !== prescription.trainingWeekdays.length)
    issues.push(
      issue(
        "day_count",
        `Use ${prescription.trainingWeekdays.length} dias de treino e preserve os dias de recuperação`,
        ["days"]
      )
    )
  if (hasDuplicate(days.map(day => day.order)) || hasDuplicate(days.map(day => day.id)))
    issues.push(
      issue("duplicate_day", "Os dias precisam de identificadores e ordens diferentes", [
        "days",
      ])
    )
  days.forEach((day, index) => {
    issues.push(
      ...validateDayStructure(day, prescription, classifications, ["days", index])
    )
    issues.push(...validateSession(day, prescription, classifications, ["days", index]))
  })
  return [
    ...issues,
    ...validateWeeklyVolume(days, prescription),
    ...validateRecovery(days, prescription),
  ]
}
