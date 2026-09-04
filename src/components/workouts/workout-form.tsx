"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { AlignLeftIcon, DumbbellIcon, LoaderCircleIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { FormProvider, useFieldArray, useForm } from "react-hook-form"
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
import { DialogFooter } from "@/components/ui/dialog"
import { FieldError } from "@/components/ui/field"
import type { Exercise, MuscleGroup } from "@/lib/exercises/types"
import { workoutFormSchema } from "@/lib/workouts/schemas"
import type { Workout, WorkoutFormValues, WorkoutInput } from "@/lib/workouts/types"
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
  onCancel: () => void
  onSubmit: (values: WorkoutInput) => Promise<void>
  workout?: Workout | null
}

export function WorkoutForm({
  exercises,
  exercisesByReference,
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

  const [selectionTarget, setSelectionTarget] = useState<{
    dayIndex: number
    exerciseIndex?: number
  } | null>(null)

  const [removingDayIndex, setRemovingDayIndex] = useState<number | null>(null)
  const [isDiscarding, setIsDiscarding] = useState(false)

  const handleCancel = () => {
    setIsDiscarding(true)
  }

  async function handleValidSubmit(values: WorkoutFormValues) {
    await onSubmit({
      ...values,
      description: values.description || null,
    })
  }

  return (
    <FormProvider {...form}>
      <form
        className="flex min-h-0 min-w-0 flex-1 flex-col"
        onSubmit={handleSubmit(handleValidSubmit)}
      >
        <div className="no-scrollbar max-h-[65vh] min-w-0 space-y-6 overflow-x-hidden overflow-y-auto pb-5">
          <div className="grid gap-5 md:grid-cols-2">
            <TextField
              error={formState.errors.name}
              icon={<DumbbellIcon />}
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
              maxLength={500}
              placeholder="Objetivo ou observações do planejamento"
              {...register("description")}
            />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-lg font-bold">Dias de treino</h3>
              <Button
                disabled={fields.length >= 14}
                onClick={() =>
                  append({ ...createEmptyWorkoutDay(), order: fields.length })
                }
                size="sm"
                type="button"
              >
                Adicionar dia
              </Button>
            </div>
            {fields.map((field, index) => (
              <WorkoutDayForm
                canRemove={fields.length > 1}
                exercisesByReference={exercisesByReference}
                index={index}
                key={field.id}
                onAddExercise={() => setSelectionTarget({ dayIndex: index })}
                onDown={() => move(index, index + 1)}
                onDuplicate={() => {
                  const day = getValues(`days.${index}`)
                  append({
                    ...day,
                    id: crypto.randomUUID(),
                    name: `${day.name} — Cópia`,
                    order: fields.length,
                    exercises: day.exercises.map(item => ({
                      ...item,
                      id: crypto.randomUUID(),
                    })),
                  })
                }}
                onRemove={() => setRemovingDayIndex(index)}
                onReplaceExercise={exerciseIndex =>
                  setSelectionTarget({ dayIndex: index, exerciseIndex })
                }
                onUp={() => move(index, index - 1)}
                total={fields.length}
              />
            ))}
            <FieldError errors={[formState.errors.days?.root]} />
          </div>
        </div>
        <DialogFooter className="border-t pt-5">
          <Button
            disabled={formState.isSubmitting}
            onClick={handleCancel}
            type="button"
            variant="outline"
          >
            Cancelar
          </Button>
          <Button disabled={formState.isSubmitting} type="submit">
            {formState.isSubmitting && <LoaderCircleIcon className="animate-spin" />}
            {formState.isSubmitting ? "Salvando" : "Salvar ficha"}
          </Button>
        </DialogFooter>
      </form>
      <WorkoutExerciseSelector
        exercises={exercises}
        onClose={() => setSelectionTarget(null)}
        target={selectionTarget}
      />
      <AlertDialog
        onOpenChange={open => !open && setRemovingDayIndex(null)}
        open={removingDayIndex !== null}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir dia de treino</AlertDialogTitle>
            <AlertDialogDescription>
              O dia “
              {removingDayIndex === null
                ? ""
                : getValues(`days.${removingDayIndex}.name`) ||
                  `Dia ${removingDayIndex + 1}`}
              ” e todos os seus exercícios serão excluídos. Esta ação não poderá ser
              desfeita
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <Button
              onClick={() => {
                if (removingDayIndex !== null) remove(removingDayIndex)
                setRemovingDayIndex(null)
              }}
              variant="destructive"
            >
              Excluir
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog onOpenChange={setIsDiscarding} open={isDiscarding}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Descartar alterações</AlertDialogTitle>
            <AlertDialogDescription>
              Os dados preenchidos nesta ficha não serão salvos. Esta ação não poderá ser
              desfeita
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continuar editando</AlertDialogCancel>
            <Button onClick={onCancel} variant="destructive">
              Descartar
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </FormProvider>
  )
}
