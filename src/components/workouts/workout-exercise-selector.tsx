"use client"

import { BicepsFlexedIcon, GaugeIcon, SearchIcon } from "lucide-react"
import { useMemo, useState } from "react"
import { useFormContext } from "react-hook-form"
import { SelectField } from "@/components/select-field"
import { TextField } from "@/components/text-field"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { difficulties, muscleGroups, muscles, origins } from "@/lib/options-select"
import {
  type Exercise,
  exerciseDifficultyLabel,
  muscleGroupLabel,
  muscleLabel,
} from "@/modules/exercises/domain/exercise"
import {
  type ExerciseFilters,
  emptyExerciseFilters,
  filterExercises,
} from "@/modules/exercises/domain/exercise-library"
import type { WorkoutFormValues } from "@/modules/workouts/domain/workout"
import { useWorkoutGenerationUseCases } from "@/modules/workouts/presentation/workout-generation-use-cases-context"
import { useWorkoutReview } from "./ai/workout-review-context"

function exerciseBadgeLabel({
  isAlreadyAdded,
  isPending,
  source,
}: {
  isAlreadyAdded: boolean
  isPending: boolean
  source: Exercise["source"]
}) {
  if (isAlreadyAdded) return "Adicionado"
  if (isPending) return "Selecionado"
  return source === "default" ? "Padrão" : "Personalizado"
}

function referenceOf(exercise: Exercise) {
  return `${exercise.source}:${exercise.id}`
}

export function WorkoutExerciseSelector({
  exercises,
  onClose,
  target,
}: {
  exercises: Exercise[]
  onClose: () => void
  target: { dayIndex: number; exerciseIndex?: number } | null
}) {
  const review = useWorkoutReview()
  const workoutGenerationUseCases = useWorkoutGenerationUseCases()
  const { getValues, setValue } = useFormContext<WorkoutFormValues>()
  const [filters, setFilters] = useState<ExerciseFilters>(emptyExerciseFilters)
  const [selectedReferences, setSelectedReferences] = useState<string[]>([])

  const results = useMemo(() => filterExercises(exercises, filters), [exercises, filters])
  const exercisesByReference = useMemo(
    () => new Map(exercises.map(exercise => [referenceOf(exercise), exercise])),
    [exercises]
  )
  const currentExerciseCount = target
    ? getValues(`days.${target.dayIndex}.exercises`).length
    : 0
  const remainingSelections = Math.max(
    0,
    (review?.prescription.maxExercisesPerDay ?? 30) - currentExerciseCount
  )

  function close() {
    setFilters(emptyExerciseFilters)
    setSelectedReferences([])
    onClose()
  }

  function addSelectedExercises() {
    if (!target || target.exerciseIndex !== undefined) return
    const current = getValues(`days.${target.dayIndex}.exercises`)
    const selected = selectedReferences.flatMap(reference => {
      const exercise = exercisesByReference.get(reference)
      return exercise ? [exercise] : []
    })
    if (selected.length === 0) return

    setValue(
      `days.${target.dayIndex}.exercises`,
      [
        ...current,
        ...selected.map((exercise, index) => ({
          id: crypto.randomUUID(),
          order: current.length + index,
          exerciseReference: { source: exercise.source, exerciseId: exercise.id },
          exerciseSnapshot: { name: exercise.name, muscleGroup: exercise.muscleGroup },
          ...workoutGenerationUseCases.exerciseDefaults(exercise, review?.prescription),
        })),
      ],
      { shouldDirty: true, shouldValidate: true }
    )
    close()
  }

  function select(exercise: Exercise) {
    if (!target) return
    const current = getValues(`days.${target.dayIndex}.exercises`)
    if (
      current.some(
        (item, index) =>
          index !== target.exerciseIndex &&
          item.exerciseReference.source === exercise.source &&
          item.exerciseReference.exerciseId === exercise.id
      )
    )
      return
    const nextExercise = {
      id: crypto.randomUUID(),
      order: target.exerciseIndex ?? current.length,
      exerciseReference: { source: exercise.source, exerciseId: exercise.id },
      exerciseSnapshot: { name: exercise.name, muscleGroup: exercise.muscleGroup },
      ...workoutGenerationUseCases.exerciseDefaults(exercise, review?.prescription),
    }
    const next = [...current]
    if (target.exerciseIndex === undefined) next.push(nextExercise)
    else next[target.exerciseIndex] = nextExercise
    setValue(`days.${target.dayIndex}.exercises`, next, {
      shouldDirty: true,
      shouldValidate: true,
    })
    setFilters(emptyExerciseFilters)
    close()
  }

  function toggleExercise(exercise: Exercise) {
    const reference = referenceOf(exercise)
    setSelectedReferences(current =>
      current.includes(reference)
        ? current.filter(item => item !== reference)
        : [...current, reference]
    )
  }

  return (
    <Dialog onOpenChange={open => !open && close()} open={target !== null}>
      <DialogContent className="flex h-[calc(100svh-1rem)] max-h-192 flex-col overflow-hidden sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Selecionar exercício</DialogTitle>
          <DialogDescription>Escolha um exercício da sua biblioteca</DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <TextField
            icon={<SearchIcon aria-hidden="true" />}
            id="exercise-search"
            label="Nome do exercício"
            onChange={event =>
              setFilters(value => ({ ...value, search: event.target.value }))
            }
            placeholder="Buscar pelo nome"
            type="text"
            value={filters.search}
          />

          <div className="hidden sm:block">
            <SelectField
              icon={<GaugeIcon aria-hidden="true" />}
              id="exercise-difficulty"
              label="Dificuldade"
              onChange={value =>
                setFilters(current => ({
                  ...current,
                  difficulty: value as ExerciseFilters["difficulty"],
                }))
              }
              options={difficulties}
              value={filters.difficulty}
            />
          </div>

          <div className="hidden sm:block">
            <SelectField
              icon={<SearchIcon aria-hidden="true" />}
              id="exercise-source"
              label="Origem"
              onChange={value =>
                setFilters(current => ({
                  ...current,
                  source: value as ExerciseFilters["source"],
                }))
              }
              options={origins}
              value={filters.source}
            />
          </div>

          <SelectField
            icon={<SearchIcon aria-hidden="true" />}
            id="exercise-group"
            label="Grupo muscular"
            onChange={value =>
              setFilters(current => ({
                ...current,
                muscle: value as ExerciseFilters["muscle"],
              }))
            }
            options={muscleGroups}
            value={filters.muscle}
          />

          <div className="hidden sm:block">
            <SelectField
              icon={<BicepsFlexedIcon aria-hidden="true" />}
              id="exercise-primary-muscle"
              label="Músculo principal"
              onChange={value =>
                setFilters(current => ({
                  ...current,
                  primaryMuscle: value as ExerciseFilters["primaryMuscle"],
                }))
              }
              options={muscles}
              value={filters.primaryMuscle}
            />
          </div>

          <div className="hidden sm:block">
            <SelectField
              icon={<BicepsFlexedIcon aria-hidden="true" />}
              id="exercise-secondary-muscle"
              label="Músculo secundário"
              onChange={value =>
                setFilters(current => ({
                  ...current,
                  secondaryMuscle: value as ExerciseFilters["secondaryMuscle"],
                }))
              }
              options={muscles}
              value={filters.secondaryMuscle}
            />
          </div>
        </div>

        <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto">
          <div className="space-y-2">
            {results.map(exercise => {
              const reference = referenceOf(exercise)
              const isAlreadyAdded = target
                ? getValues(`days.${target.dayIndex}.exercises`).some(
                    (item, index) =>
                      index !== target.exerciseIndex &&
                      item.exerciseReference.source === exercise.source &&
                      item.exerciseReference.exerciseId === exercise.id
                  )
                : false
              const isPending = selectedReferences.includes(reference)
              const isSelected = isAlreadyAdded || isPending
              const isAdding = target?.exerciseIndex === undefined
              const isSelectionLimitReached =
                isAdding && !isPending && selectedReferences.length >= remainingSelections

              return (
                <button
                  className={
                    isSelected
                      ? "flex w-full items-center justify-between gap-4 border border-primary bg-muted p-3 text-left"
                      : "flex w-full items-center justify-between gap-4 border p-3 text-left hover:bg-muted"
                  }
                  disabled={isAlreadyAdded || isSelectionLimitReached}
                  key={`${exercise.source}:${exercise.id}`}
                  onClick={() => (isAdding ? toggleExercise(exercise) : select(exercise))}
                  type="button"
                >
                  <span className="min-w-0">
                    <span className="block wrap-break-word font-semibold">
                      {exercise.name}
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      {muscleGroupLabel[exercise.muscleGroup]} ·{" "}
                      {exercise.primaryMuscles
                        .map(muscle => muscleLabel[muscle])
                        .join(", ")}{" "}
                      · {exerciseDifficultyLabel[exercise.difficulty]}
                    </span>
                  </span>
                  <Badge variant={isSelected ? "default" : "secondary"}>
                    {exerciseBadgeLabel({
                      isAlreadyAdded,
                      isPending,
                      source: exercise.source,
                    })}
                  </Badge>
                </button>
              )
            })}

            {results.length === 0 && (
              <p className="p-8 text-center text-muted-foreground">
                Nenhum exercício encontrado
              </p>
            )}
          </div>
        </div>

        {target?.exerciseIndex === undefined && (
          <DialogFooter className="border-t pt-4">
            <p aria-live="polite" className="mr-auto text-sm text-muted-foreground">
              {selectedReferences.length === 0
                ? "Selecione os exercícios que deseja adicionar"
                : `${selectedReferences.length} ${selectedReferences.length === 1 ? "exercício selecionado" : "exercícios selecionados"}`}
            </p>
            <Button
              disabled={selectedReferences.length === 0}
              onClick={addSelectedExercises}
              type="button"
            >
              Adicionar
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}
