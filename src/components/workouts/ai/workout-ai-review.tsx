"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { AlignLeftIcon, DumbbellIcon } from "lucide-react"
import { type RefObject, useMemo, useRef, useState } from "react"
import { FormProvider, useFieldArray, useForm, useWatch } from "react-hook-form"
import { TextField } from "@/components/text-field"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { useWorkout } from "@/contexts/workout-context"
import { muscleGroupLabel } from "@/modules/exercises/domain/exercise"
import type {
  AiWorkoutInput,
  AiWorkoutResult,
} from "@/modules/workouts/application/workout-generation-schema"
import { workoutFormSchema } from "@/modules/workouts/domain/schemas"
import type { Workout, WorkoutFormValues } from "@/modules/workouts/domain/workout"
import { useWorkoutGenerationUseCases } from "@/modules/workouts/presentation/workout-generation-use-cases-context"
import { WorkoutDayForm } from "../workout-day-form"
import { WorkoutExerciseSelector } from "../workout-exercise-selector"
import { WorkoutReviewContext, WorkoutReviewMessages } from "./workout-review-context"

export function WorkoutAiReview({
  result,
  input,
  busy,
  error,
  onCancel,
  onRegenerate,
  onSavingChange,
  onSaved,
}: {
  result: AiWorkoutResult
  input: AiWorkoutInput
  heading: RefObject<HTMLHeadingElement | null>
  busy: boolean
  error: string
  onCancel: () => void
  onRegenerate: () => Promise<void>
  onSavingChange: (value: boolean) => void
  onSaved: (workout: Workout) => void
}) {
  const { exercises, createGeneratedWorkout } = useWorkout()
  const workoutGenerationUseCases = useWorkoutGenerationUseCases()
  const prescription = useMemo(
    () => workoutGenerationUseCases.prescribe(input),
    [input, workoutGenerationUseCases]
  )
  const available = useMemo(
    () => workoutGenerationUseCases.available(exercises, input),
    [exercises, input, workoutGenerationUseCases]
  )
  const library = useMemo(
    () => new Map(available.map(item => [`${item.source}:${item.id}`, item])),
    [available]
  )
  const form = useForm<WorkoutFormValues>({
    resolver: zodResolver(workoutFormSchema),
    defaultValues: result.plan,
    mode: "onChange",
  })
  const values = useWatch({ control: form.control }) as WorkoutFormValues
  const review = useMemo(
    () => workoutGenerationUseCases.review(values, prescription, library),
    [values, prescription, library, workoutGenerationUseCases]
  )
  const volume = workoutGenerationUseCases.weeklyVolume(review.plan.days)
  const errors = review.issues.filter(item => item.severity === "error")
  const warnings = review.issues.filter(item => item.severity === "warning")
  const days = useFieldArray({ control: form.control, name: "days" })
  const [target, setTarget] = useState<{
    dayIndex: number
    exerciseIndex?: number
  } | null>(null)
  const [confirmation, setConfirmation] = useState<"regenerate" | "warnings" | null>(null)
  const [saveError, setSaveError] = useState("")
  const saving = useRef(false)
  const creationId = useRef<string | null>(null)
  const pending = busy || form.formState.isSubmitting

  async function save(acceptWarnings = false) {
    if (saving.current || busy) return
    const final = workoutGenerationUseCases.review(form.getValues(), prescription, library)
    if (final.issues.some(item => item.severity === "error")) {
      setConfirmation(null)
      setSaveError("Corrija os erros indicados antes de salvar")
      await form.trigger(undefined, { shouldFocus: true })
      return
    }
    if (!acceptWarnings && final.issues.some(item => item.severity === "warning")) {
      setConfirmation("warnings")
      return
    }
    saving.current = true
    onSavingChange(true)
    setConfirmation(null)
    setSaveError("")
    creationId.current ??= crypto.randomUUID()
    try {
      const parsed = workoutFormSchema.parse(final.plan)
      const saved = await createGeneratedWorkout(
        { ...parsed, description: parsed.description || null },
        creationId.current
      )
      onSaved(saved)
    } catch {
      setSaveError(
        "Não foi possível confirmar o salvamento, sua ficha foi mantida para nova tentativa"
      )
    } finally {
      saving.current = false
      onSavingChange(false)
    }
  }

  return (
    <WorkoutReviewContext.Provider value={{ prescription, issues: review.issues }}>
      <FormProvider {...form}>
        <form className="min-w-0 space-y-5" onSubmit={form.handleSubmit(() => save())}>
          <fieldset className="min-w-0 space-y-5" disabled={pending}>
            <TextField
              error={form.formState.errors.name}
              icon={<DumbbellIcon />}
              id="ai-plan-name"
              label="Nome da ficha"
              {...form.register("name")}
            />
            <WorkoutReviewMessages path={["name"]} />
            <TextField
              error={form.formState.errors.description}
              icon={<AlignLeftIcon />}
              id="ai-plan-description"
              label="Descrição"
              maxLength={500}
              {...form.register("description")}
            />
            <WorkoutReviewMessages path={["description"]} />
            <section aria-label="Divisão semanal" className="space-y-3">
              <h3 className="font-semibold">
                Divisão semanal · {values.days.length} dias
              </h3>
              <p className="text-xs text-muted-foreground">
                A recuperação considera esta sequência semanal
              </p>
              <ol className="grid gap-2 sm:grid-cols-2">
                {review.plan.days.map((day, index) => {
                  const minutes = workoutGenerationUseCases.estimateDuration(day)
                  return (
                    <li
                      className="min-w-0 border p-3 text-sm wrap-break-word"
                      key={day.id}
                    >
                      <p className="font-medium">
                        {
                          [
                            "Segunda",
                            "Terça",
                            "Quarta",
                            "Quinta",
                            "Sexta",
                            "Sábado",
                            "Domingo",
                          ][prescription.trainingWeekdays[index]]
                        }{" "}
                        · {day.name}
                      </p>
                      <p>
                        {day.exercises.length} exercícios ·{" "}
                        {minutes !== null && Number.isFinite(minutes)
                          ? `${minutes} min estimados`
                          : "Duração a calcular"}
                      </p>
                      <p className="text-muted-foreground">
                        {day.muscleGroups.map(group => muscleGroupLabel[group]).join(", ")}
                      </p>
                    </li>
                  )
                })}
              </ol>
            </section>
            <WorkoutReviewMessages path={["days"]} />
            {days.fields.map((day, index) => (
              <WorkoutDayForm
                canRemove={false}
                exercisesByReference={library}
                index={index}
                key={day.id}
                onAddExercise={() => setTarget({ dayIndex: index })}
                onDown={() => days.move(index, index + 1)}
                onDuplicate={() => undefined}
                onRemove={() => undefined}
                onReplaceExercise={exerciseIndex =>
                  setTarget({ dayIndex: index, exerciseIndex })
                }
                onUp={() => days.move(index, index - 1)}
                total={days.fields.length}
              />
            ))}
            <section aria-label="Volume semanal" className="space-y-3">
              <h3 className="font-semibold">Séries semanais por grupo muscular</h3>
              <div className="grid gap-2 sm:grid-cols-2">
                {Object.entries(prescription.weeklyVolumeByMuscleGroup).map(
                  ([key, range]) => {
                    const group = key as keyof typeof volume
                    if (!range.max && !volume[group]) return null
                    return (
                      <div className="min-w-0 border p-3 text-sm" key={group}>
                        <p className="font-medium">
                          {muscleGroupLabel[group]} ·{" "}
                          {Number.isFinite(volume[group]) ? volume[group] : "A calcular"}
                        </p>
                        <p className="text-muted-foreground">
                          Faixa {range.min}–{range.max} · Alvo {range.target}
                        </p>
                        <WorkoutReviewMessages
                          path={["weeklyVolumeByMuscleGroup", group]}
                        />
                      </div>
                    )
                  }
                )}
              </div>
            </section>
          </fieldset>
          <p aria-live="polite" className="text-sm">
            {errors.length
              ? `${errors.length} erro(s) impedem o salvamento`
              : warnings.length
                ? `${warnings.length} aviso(s) precisam de confirmação para salvar`
                : null}
          </p>
          {(error || saveError) && (
            <p className="text-sm text-destructive" role="alert">
              {error || saveError}
            </p>
          )}
          {pending && (
            <output className="block text-sm text-muted-foreground">
              {saving.current ? "Salvando ficha" : "Gerando uma nova ficha, aguarde"}
            </output>
          )}
          <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:flex-wrap">
            <Button disabled={pending} onClick={onCancel} type="button" variant="outline">
              Cancelar
            </Button>
            <Button
              disabled={pending}
              onClick={() => {
                if (form.formState.isDirty) setConfirmation("regenerate")
                else void onRegenerate()
              }}
              type="button"
              variant="outline"
            >
              Gerar nova ficha
            </Button>
            <Button disabled={pending || errors.length > 0} type="submit">
              Confirmar e salvar
            </Button>
          </div>
        </form>
        <WorkoutExerciseSelector
          exercises={available}
          onClose={() => setTarget(null)}
          target={target}
        />
        <AlertDialog
          onOpenChange={open => !open && setConfirmation(null)}
          open={confirmation !== null}
        >
          <AlertDialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto">
            <AlertDialogHeader>
              <AlertDialogTitle>
                {confirmation === "regenerate"
                  ? "Substituir suas edições"
                  : "Salvar com avisos"}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {confirmation === "regenerate"
                  ? "A nova geração usará suas respostas originais e substituirá as edições somente se for concluída com sucesso"
                  : "A ficha está dentro dos limites permitidos, mas possui recomendações pendentes"}
              </AlertDialogDescription>
            </AlertDialogHeader>
            {confirmation === "warnings" && (
              <ul className="list-inside list-disc space-y-2 text-sm">
                {warnings.map(issue => (
                  <li key={`${issue.path.join(".")}:${issue.code}`}>
                    {issue.path[0] === "weeklyVolumeByMuscleGroup"
                      ? `${muscleGroupLabel[issue.path[1] as keyof typeof muscleGroupLabel]}: `
                      : ""}
                    {issue.message}
                  </li>
                ))}
              </ul>
            )}
            <AlertDialogFooter>
              <AlertDialogCancel>Continuar editando</AlertDialogCancel>
              <Button
                onClick={() => {
                  if (confirmation === "warnings") void save(true)
                  else {
                    setConfirmation(null)
                    void onRegenerate()
                  }
                }}
                type="button"
              >
                {confirmation === "warnings" ? "Confirmar e salvar" : "Gerar nova ficha"}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </FormProvider>
    </WorkoutReviewContext.Provider>
  )
}
