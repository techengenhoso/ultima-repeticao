"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { AlignLeftIcon, DumbbellIcon, LoaderCircleIcon } from "lucide-react"
import { type RefObject, useMemo, useRef, useState } from "react"
import { FormProvider, useFieldArray, useForm, useWatch } from "react-hook-form"
import { ConfirmationDialog } from "@/components/confirmation-dialog"
import { TextField } from "@/components/text-field"
import { Accordion } from "@/components/ui/accordion"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { DialogFooter } from "@/components/ui/dialog"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "@/components/ui/item"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useWorkout } from "@/contexts/workout-context"
import { muscleGroupLabel } from "@/modules/exercises/domain/exercise"
import { DuplicateWorkoutNameError } from "@/modules/workouts/application/ports/workout-repository"
import type {
  WorkoutGeneratorInput,
  WorkoutGeneratorResult,
} from "@/modules/workouts/application/workout-generation-schema"
import { workoutFormSchema } from "@/modules/workouts/domain/schemas"
import type { Workout, WorkoutFormValues } from "@/modules/workouts/domain/workout"
import { useWorkoutGenerationUseCases } from "@/modules/workouts/presentation/workout-generation-use-cases-context"
import { WorkoutDayForm } from "../workout-day-form"
import { WorkoutExerciseSelector } from "../workout-exercise-selector"
import { WorkoutReviewContext, WorkoutReviewMessages } from "./workout-review-context"

export function WorkoutGenerationReview({
  result,
  input,
  busy,
  error,
  onCancel,
  onOpenDayChange,
  onRegenerate,
  onSavingChange,
  onSaved,
}: {
  result: WorkoutGeneratorResult
  input: WorkoutGeneratorInput
  heading: RefObject<HTMLHeadingElement | null>
  busy: boolean
  error: string
  onCancel: () => void
  onOpenDayChange: (value: string) => void
  onRegenerate: () => Promise<void>
  onSavingChange: (value: boolean) => void
  onSaved: (workout: Workout) => void
}) {
  const { exercises, exerciseProgressions, createGeneratedWorkout } = useWorkout()
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
    defaultValues: {
      ...result.plan,
      days: result.plan.days.map(day => ({
        ...day,
        exercises: day.exercises.map(exercise => ({
          ...exercise,
          initialLoad: Number.NaN,
        })),
      })),
    },
    mode: "onChange",
  })
  const values = useWatch({ control: form.control }) as WorkoutFormValues
  const review = useMemo(
    () => workoutGenerationUseCases.review(values, prescription, library),
    [values, prescription, library, workoutGenerationUseCases]
  )
  const days = useFieldArray({ control: form.control, name: "days" })
  const missingInitialLoadCount = values.days.reduce(
    (total, day) =>
      total +
      day.exercises.filter(exercise => !Number.isFinite(exercise.initialLoad)).length,
    0
  )
  const [openDayId, setOpenDayId] = useState("")
  const [target, setTarget] = useState<{
    dayIndex: number
    exerciseIndex?: number
  } | null>(null)
  const [confirmation, setConfirmation] = useState<"regenerate" | null>(null)
  const [saveError, setSaveError] = useState("")
  const saving = useRef(false)
  const creationId = useRef<string | null>(null)
  const pending = busy || form.formState.isSubmitting

  async function save() {
    if (saving.current || busy) return
    const final = workoutGenerationUseCases.review(form.getValues(), prescription, library)
    if (final.issues.some(item => item.severity === "error")) {
      setConfirmation(null)
      setSaveError("Corrija os erros indicados antes de salvar")
      await form.trigger(undefined, { shouldFocus: true })
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
    } catch (error) {
      setSaveError(
        error instanceof DuplicateWorkoutNameError
          ? "Você já possui uma ficha com esse nome"
          : "Não foi possível confirmar o salvamento, sua ficha foi mantida para nova tentativa"
      )
    } finally {
      saving.current = false
      onSavingChange(false)
    }
  }

  return (
    <WorkoutReviewContext.Provider value={{ prescription, issues: review.issues }}>
      <FormProvider {...form}>
        <form
          className="flex h-full min-h-0 min-w-0 flex-col gap-5"
          onSubmit={form.handleSubmit(() => save())}
        >
          <ScrollArea className="min-h-0 flex-1 [&_[data-slot=scroll-area-viewport]]:max-h-[inherit]">
            <fieldset className="min-w-0 space-y-5" disabled={pending}>
              <TextField
                error={form.formState.errors.name}
                icon={<DumbbellIcon />}
                id="generator-plan-name"
                label="Nome da ficha"
                {...form.register("name")}
              />
              <WorkoutReviewMessages path={["name"]} />
              <TextField
                error={form.formState.errors.description}
                icon={<AlignLeftIcon />}
                id="generator-plan-description"
                label="Descrição"
                {...form.register("description")}
              />
              <WorkoutReviewMessages path={["description"]} />
              <section aria-label="Divisão semanal" className="space-y-3">
                <h3 className="font-semibold">
                  Divisão semanal · {values.days.length} dia{values.days.length > 1 && "s"}
                </h3>

                <ItemGroup className="gap-2">
                  {review.plan.days.map((day, index) => {
                    const minutes = workoutGenerationUseCases.estimateDuration(day)
                    return (
                      <Item asChild key={day.id} size="sm" variant="muted">
                        <li>
                          <ItemContent className="min-w-0">
                            <ItemTitle className="line-clamp-none wrap-break-word">
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
                            </ItemTitle>
                            <ItemDescription>
                              {day.exercises.length} exercícios ·{" "}
                              {minutes !== null && Number.isFinite(minutes)
                                ? `${minutes} min`
                                : "Duração a calcular"}
                            </ItemDescription>
                            <ItemDescription className="line-clamp-none">
                              {day.muscleGroups
                                .map(group => muscleGroupLabel[group])
                                .join(", ")}
                            </ItemDescription>
                          </ItemContent>
                        </li>
                      </Item>
                    )
                  })}
                </ItemGroup>
              </section>
              <WorkoutReviewMessages path={["days"]} />
              <Accordion
                collapsible
                onValueChange={value => {
                  setOpenDayId(value)
                  onOpenDayChange(value)
                }}
                type="single"
                value={openDayId}
              >
                {days.fields.map((day, index) => (
                  <WorkoutDayForm
                    canRemove={false}
                    exercisesByReference={library}
                    index={index}
                    key={day.id}
                    numberOffset={1}
                    onAddExercise={() => setTarget({ dayIndex: index })}
                    onDown={() => days.move(index, index + 1)}
                    onRemove={() => undefined}
                    onReplaceExercise={exerciseIndex =>
                      setTarget({ dayIndex: index, exerciseIndex })
                    }
                    onUp={() => days.move(index, index - 1)}
                    total={days.fields.length}
                    value={day.id}
                  />
                ))}
              </Accordion>
            </fieldset>
          </ScrollArea>
          {(error || saveError) && (
            <p className="text-sm text-destructive" role="alert">
              {error || saveError}
            </p>
          )}

          {form.formState.isSubmitted && missingInitialLoadCount > 0 && (
            <Alert variant="destructive">
              <AlertDescription>
                Informe a carga de todos os exercícios, inclusive 0 kg
              </AlertDescription>
            </Alert>
          )}

          <DialogFooter className="shrink-0 gap-3 sm:flex-row sm:flex-wrap">
            <Button
              disabled={pending}
              onClick={onCancel}
              type="button"
              variant="secondary"
            >
              Cancelar
            </Button>

            <Button
              disabled={pending}
              onClick={() => {
                if (form.formState.isDirty) setConfirmation("regenerate")
                else void onRegenerate()
              }}
              type="button"
              variant="secondary"
            >
              {pending && !saving.current && (
                <LoaderCircleIcon aria-hidden="true" className="animate-spin" />
              )}
              {pending && !saving.current ? "Gerando ficha" : "Gerar nova ficha"}
            </Button>

            <Button
              disabled={
                pending || (form.formState.isSubmitted && missingInitialLoadCount > 0)
              }
              type="submit"
            >
              {pending && saving.current && (
                <LoaderCircleIcon aria-hidden="true" className="animate-spin" />
              )}
              Confirmar e salvar
            </Button>
          </DialogFooter>
        </form>
        <WorkoutExerciseSelector
          exerciseProgressions={exerciseProgressions}
          exercises={available}
          onClose={() => setTarget(null)}
          target={target}
        />
        <ConfirmationDialog
          cancelLabel="Continuar editando"
          confirmLabel="Gerar nova ficha"
          description="A nova geração usará suas respostas originais e substituirá as edições somente se for concluída com sucesso"
          onConfirm={() => {
            setConfirmation(null)
            void onRegenerate()
          }}
          onOpenChange={open => !open && setConfirmation(null)}
          open={confirmation !== null}
          title="Substituir suas edições"
        />
      </FormProvider>
    </WorkoutReviewContext.Provider>
  )
}
