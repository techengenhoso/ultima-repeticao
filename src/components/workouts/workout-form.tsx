"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { AlignLeftIcon, DumbbellIcon, LoaderCircleIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { FormProvider, useFieldArray, useForm } from "react-hook-form"
import { ConfirmationDialog } from "@/components/confirmation-dialog"
import { TextField } from "@/components/text-field"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { DialogFooter } from "@/components/ui/dialog"
import { FieldError } from "@/components/ui/field"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Exercise, MuscleGroup } from "@/modules/exercises/domain/exercise"
import type { ExerciseLoadProgression } from "@/modules/progress/domain/performance"
import { workoutFormSchema } from "@/modules/workouts/domain/schemas"
import type {
  Workout,
  WorkoutFormValues,
  WorkoutInput,
} from "@/modules/workouts/domain/workout"
import { WorkoutDayForm } from "./workout-day-form"
import { WorkoutExerciseSelector } from "./workout-exercise-selector"

const createEmptyWorkoutDay = () => ({
  id: crypto.randomUUID(),
  name: "",
  order: 0,
  muscleGroups: [] as MuscleGroup[],
  exercises: [],
})

interface Props {
  exercises: Exercise[]
  exercisesByReference: Map<string, Exercise>
  exerciseProgressions: Map<string, ExerciseLoadProgression>
  onCancel: () => void
  onSubmit: (values: WorkoutInput) => Promise<void>
  workout?: Workout | null
}

export function WorkoutForm({
  exercises,
  exercisesByReference,
  exerciseProgressions,
  onCancel,
  onSubmit,
  workout,
}: Props) {
  const form = useForm<WorkoutFormValues>({
    resolver: zodResolver(workoutFormSchema),
    defaultValues: {
      name: "",
      description: "",
      days: [createEmptyWorkoutDay()],
    },
  })
  const { control, formState, getValues, handleSubmit, register, reset } = form

  useEffect(() => {
    reset({
      name: workout?.name ?? "",
      description: workout?.description ?? "",
      days: workout?.days ?? [createEmptyWorkoutDay()],
    })
  }, [reset, workout])

  const { fields, append, move, remove } = useFieldArray({
    control,
    name: "days",
  })
  const [openSection, setOpenSection] = useState("general")
  const dayIdsKey = fields.map(field => field.id).join(",")

  const [selectionTarget, setSelectionTarget] = useState<{
    dayIndex: number
    exerciseIndex?: number
  } | null>(null)

  const [removingDayIndex, setRemovingDayIndex] = useState<number | null>(null)
  const isEditing = Boolean(workout?.id)

  useEffect(() => {
    const dayIds = dayIdsKey ? dayIdsKey.split(",") : []
    setOpenSection(current =>
      current === "general" || dayIds.includes(current) ? current : "general"
    )
  }, [dayIdsKey])

  async function handleValidSubmit(values: WorkoutFormValues) {
    await onSubmit({
      ...values,
      description: values.description || null,
    })
  }

  function addWorkoutDay() {
    const day = { ...createEmptyWorkoutDay(), order: fields.length }
    append(day)
    setOpenSection(day.id)
  }

  return (
    <FormProvider {...form}>
      <form
        className="flex min-h-0 min-w-0 flex-1 flex-col gap-5"
        onSubmit={handleSubmit(handleValidSubmit)}
      >
        <fieldset className="min-h-0 flex-1" disabled={formState.isSubmitting}>
          <ScrollArea className="h-full min-h-0">
            <Accordion
              collapsible
              onValueChange={setOpenSection}
              type="single"
              value={openSection}
            >
              <AccordionItem className="data-open:bg-card" value="general">
                <AccordionTrigger className="items-center bg-muted/50 px-4 py-4 hover:bg-muted hover:no-underline aria-expanded:bg-muted">
                  <span className="flex min-w-0 items-center gap-3">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground">
                      1
                    </span>
                    <span className="flex min-w-0 flex-col gap-0.5">
                      <span>Informações gerais</span>
                      <span className="text-xs font-normal text-muted-foreground">
                        2 informações
                      </span>
                    </span>
                  </span>
                </AccordionTrigger>

                <AccordionContent className="h-auto pt-4">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <TextField
                      error={formState.errors.name}
                      icon={<DumbbellIcon aria-hidden="true" />}
                      id="name"
                      label="Nome da ficha"
                      placeholder="Treino Hiper"
                      {...register("name")}
                    />
                    <TextField
                      error={formState.errors.description}
                      icon={<AlignLeftIcon aria-hidden="true" />}
                      id="description"
                      label="Descrição"
                      placeholder="Observações da ficha"
                      {...register("description")}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>

              {fields.map((field, index) => (
                <WorkoutDayForm
                  canRemove={fields.length > 1}
                  exercisesByReference={exercisesByReference}
                  index={index}
                  key={field.id}
                  onAddExercise={() => setSelectionTarget({ dayIndex: index })}
                  onDown={() => move(index, index + 1)}
                  onRemove={() => setRemovingDayIndex(index)}
                  onReplaceExercise={exerciseIndex =>
                    setSelectionTarget({ dayIndex: index, exerciseIndex })
                  }
                  onUp={() => move(index, index - 1)}
                  total={fields.length}
                  value={field.id}
                />
              ))}
            </Accordion>
            <FieldError className="mt-4" errors={[formState.errors.days?.root]} />
          </ScrollArea>
        </fieldset>

        <DialogFooter className="shrink-0 gap-2">
          <Button
            disabled={formState.isSubmitting}
            onClick={onCancel}
            type="button"
            variant="secondary"
          >
            Cancelar
          </Button>

          <Button
            disabled={fields.length >= 30 || formState.isSubmitting}
            onClick={addWorkoutDay}
            type="button"
            variant="secondary"
          >
            Adicionar
          </Button>

          <Button disabled={formState.isSubmitting} type="submit">
            {formState.isSubmitting && <LoaderCircleIcon className="animate-spin" />}
            {formState.isSubmitting
              ? isEditing
                ? "Editando"
                : "Criando"
              : isEditing
                ? "Editar"
                : "Criar"}
          </Button>
        </DialogFooter>
      </form>

      <WorkoutExerciseSelector
        exerciseProgressions={exerciseProgressions}
        exercises={exercises}
        onClose={() => setSelectionTarget(null)}
        target={selectionTarget}
      />
      <ConfirmationDialog
        confirmLabel="Excluir"
        description={
          <>
            O “
            {removingDayIndex === null
              ? ""
              : getValues(`days.${removingDayIndex}.name`) ||
                `Treino ${removingDayIndex + 1}`}
            ” e todos os seus exercícios serão excluídos. Esta ação não poderá ser desfeita
          </>
        }
        onConfirm={() => {
          if (removingDayIndex !== null) remove(removingDayIndex)
          setRemovingDayIndex(null)
        }}
        onOpenChange={open => !open && setRemovingDayIndex(null)}
        open={removingDayIndex !== null}
        title="Excluir dia de treino"
      />
    </FormProvider>
  )
}
