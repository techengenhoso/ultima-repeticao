"use client"

import {
  ArrowDownIcon,
  ArrowUpIcon,
  BicepsFlexedIcon,
  DumbbellIcon,
  Trash2Icon,
} from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { useFieldArray, useFormContext, useWatch } from "react-hook-form"
import { ConfirmationDialog } from "@/components/confirmation-dialog"
import { MultiSelectField } from "@/components/multi-select-field"
import { TextField } from "@/components/text-field"
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { FieldError } from "@/components/ui/field"
import { muscleGroups, muscles } from "@/lib/options-select"
import { type Exercise } from "@/modules/exercises/domain/exercise"
import type { WorkoutFormValues } from "@/modules/workouts/domain/workout"
import {
  useWorkoutReview,
  WorkoutReviewMessages,
} from "./generator/workout-review-context"
import { WorkoutExerciseForm } from "./workout-exercise-form"

export function WorkoutDayForm({
  exercisesByReference,
  index,
  total,
  value,
  canRemove,
  onAddExercise,
  onDown,
  onRemove,
  onReplaceExercise,
  onUp,
  numberOffset = 2,
}: {
  exercisesByReference: Map<string, Exercise>
  index: number
  total: number
  value: string
  canRemove: boolean
  onAddExercise: () => void
  onDown: () => void
  onRemove: () => void
  onReplaceExercise: (exerciseIndex: number) => void
  onUp: () => void
  numberOffset?: number
}) {
  const review = useWorkoutReview()
  const {
    control,
    getValues,
    register,
    setValue,
    formState: { errors },
  } = useFormContext<WorkoutFormValues>()
  const exercises = useFieldArray({ control, name: `days.${index}.exercises` })
  const [openExercises, setOpenExercises] = useState<Record<string, boolean>>({})
  const [removingExerciseIndex, setRemovingExerciseIndex] = useState<number | null>(null)
  const selectedExercises = useWatch({
    control,
    name: `days.${index}.exercises`,
  })
  const dayName = useWatch({ control, name: `days.${index}.name` })
  const automaticMuscleGroups = useMemo(
    () => [
      ...new Set(selectedExercises.map(exercise => exercise.exerciseSnapshot.muscleGroup)),
    ],
    [selectedExercises]
  )
  const primaryMuscles = useMemo(
    () => [
      ...new Set(
        selectedExercises.flatMap(
          exercise =>
            exercisesByReference.get(
              `${exercise.exerciseReference.source}:${exercise.exerciseReference.exerciseId}`
            )?.primaryMuscles ?? []
        )
      ),
    ],
    [exercisesByReference, selectedExercises]
  )
  const secondaryMuscles = useMemo(
    () => [
      ...new Set(
        selectedExercises.flatMap(
          exercise =>
            exercisesByReference.get(
              `${exercise.exerciseReference.source}:${exercise.exerciseReference.exerciseId}`
            )?.secondaryMuscles ?? []
        )
      ),
    ],
    [exercisesByReference, selectedExercises]
  )

  useEffect(() => {
    const current = getValues(`days.${index}.muscleGroups`)
    if (
      current.length !== automaticMuscleGroups.length ||
      current.some(group => !automaticMuscleGroups.includes(group))
    )
      setValue(`days.${index}.muscleGroups`, automaticMuscleGroups, {
        shouldDirty: true,
        shouldValidate: true,
      })
  }, [automaticMuscleGroups, getValues, index, setValue])

  return (
    <AccordionItem className="data-open:bg-card" value={value}>
      <div className="flex items-center gap-1 bg-muted/50 hover:bg-muted">
        <div className="min-w-0 flex-1">
          <AccordionTrigger className="items-center px-4 py-4 hover:no-underline">
            <span className="flex min-w-0 items-center gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center bg-primary text-sm font-bold text-primary-foreground">
                {index + numberOffset}
              </span>

              <span className="flex min-w-0 flex-col gap-0.5">
                <span>{dayName || "Treino"}</span>

                <span className="block text-xs text-muted-foreground">
                  {selectedExercises.length === 0
                    ? "Nenhum exercício"
                    : `${selectedExercises.length} ${selectedExercises.length === 1 ? "exercício" : "exercícios"}`}
                </span>
              </span>
            </span>
          </AccordionTrigger>
        </div>

        <div className="mr-3 flex shrink-0 gap-1">
          <Button
            aria-label="Mover dia para cima"
            disabled={index === 0}
            onClick={onUp}
            size="icon-sm"
            type="button"
            variant="ghost"
          >
            <ArrowUpIcon />
          </Button>

          <Button
            aria-label="Mover dia para baixo"
            disabled={index === total - 1}
            onClick={onDown}
            size="icon-sm"
            type="button"
            variant="ghost"
          >
            <ArrowDownIcon />
          </Button>

          {!review && (
            <Button
              aria-label="Remover dia"
              disabled={!canRemove}
              onClick={onRemove}
              size="icon-sm"
              type="button"
              variant="destructive"
            >
              <Trash2Icon />
            </Button>
          )}
        </div>
      </div>

      <AccordionContent className="h-auto pt-4">
        <div className="min-w-0 space-y-6 pb-1">
          <WorkoutReviewMessages path={["days", index]} />

          <div className="space-y-5">
            <TextField
              error={errors.days?.[index]?.name}
              icon={<DumbbellIcon />}
              id={`day-${index}-name`}
              label="Nome do treino"
              placeholder="Segunda-feira"
              {...register(`days.${index}.name`)}
            />

            <WorkoutReviewMessages path={["days", index, "name"]} />
          </div>

          <Button
            disabled={
              exercises.fields.length >= (review?.prescription.maxExercisesPerDay ?? 30)
            }
            onClick={onAddExercise}
            size="sm"
            type="button"
            variant="secondary"
          >
            Adicionar exercício
          </Button>

          <WorkoutReviewMessages path={["days", index, "exercises"]} />
          {exercises.fields.length === 0 ? (
            <div className="flex flex-col items-center gap-2 border border-dashed bg-muted/20 px-5 py-8 text-center">
              <span className="flex size-10 items-center justify-center bg-muted">
                <DumbbellIcon
                  aria-hidden="true"
                  className="size-5 text-muted-foreground"
                />
              </span>

              <div>
                <p className="text-sm font-medium">Seu treino ainda está vazio</p>

                <p className="text-xs text-muted-foreground">
                  Adicione o primeiro exercício para montar a sequência
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {exercises.fields.map((exercise, exerciseIndex) => {
                const exerciseStateId = selectedExercises[exerciseIndex]?.id ?? exercise.id

                return (
                  <WorkoutExerciseForm
                    dayIndex={index}
                    exerciseIndex={exerciseIndex}
                    exercisesByReference={exercisesByReference}
                    isOpen={openExercises[exerciseStateId] ?? true}
                    key={exercise.id}
                    onDown={() => exercises.move(exerciseIndex, exerciseIndex + 1)}
                    onOpenChange={open =>
                      setOpenExercises(current => ({
                        ...current,
                        [exerciseStateId]: open,
                      }))
                    }
                    onRemove={() => setRemovingExerciseIndex(exerciseIndex)}
                    onReplace={() => onReplaceExercise(exerciseIndex)}
                    onUp={() => exercises.move(exerciseIndex, exerciseIndex - 1)}
                    total={exercises.fields.length}
                  />
                )
              })}
            </div>
          )}

          <FieldError errors={[errors.days?.[index]?.exercises]} />

          <div className="space-y-5">
            <WorkoutReviewMessages path={["days", index, "muscleGroups"]} />
            <MultiSelectField
              disabled
              icon={<DumbbellIcon aria-hidden="true" />}
              id={`day-${index}-groups`}
              label="Grupos musculares"
              onChange={() => undefined}
              options={muscleGroups}
              placeholder="Seleção automática"
              showClear={false}
              showRemove={false}
              value={automaticMuscleGroups}
            />

            <MultiSelectField
              disabled
              icon={<BicepsFlexedIcon aria-hidden="true" />}
              id={`day-${index}-primary-muscles`}
              label="Músculos principais"
              onChange={() => undefined}
              options={muscles}
              placeholder="Seleção automática"
              showClear={false}
              showRemove={false}
              value={primaryMuscles}
            />

            <MultiSelectField
              disabled
              icon={<BicepsFlexedIcon aria-hidden="true" />}
              id={`day-${index}-secondary-muscles`}
              label="Músculos secundários"
              onChange={() => undefined}
              options={muscles}
              placeholder="Seleção automática"
              showClear={false}
              showRemove={false}
              value={secondaryMuscles}
            />
          </div>
        </div>
      </AccordionContent>

      <ConfirmationDialog
        confirmLabel="Excluir"
        description={
          <>
            O exercício “
            {removingExerciseIndex === null
              ? ""
              : selectedExercises[removingExerciseIndex]?.exerciseSnapshot.name}
            ” será excluído deste treino. Esta ação não poderá ser desfeita
          </>
        }
        onConfirm={() => {
          if (removingExerciseIndex !== null) exercises.remove(removingExerciseIndex)
          setRemovingExerciseIndex(null)
        }}
        onOpenChange={open => !open && setRemovingExerciseIndex(null)}
        open={removingExerciseIndex !== null}
        title="Excluir exercício do treino"
      />
    </AccordionItem>
  )
}
