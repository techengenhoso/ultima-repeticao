"use client"

import { BicepsFlexedIcon, GaugeIcon, SearchIcon } from "lucide-react"
import { useMemo, useState } from "react"
import { useFormContext } from "react-hook-form"
import { SelectField } from "@/components/select-field"
import { TextField } from "@/components/text-field"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  type ExerciseFilters,
  emptyExerciseFilters,
  filterExercises,
} from "@/lib/exercises/catalog"
import {
  type Exercise,
  exerciseDifficultyLabel,
  muscleGroupLabel,
  muscleLabel,
} from "@/lib/exercises/types"
import { difficulties, muscleGroups, muscles, origins } from "@/lib/options-select"
import type { WorkoutFormValues } from "@/lib/workouts/types"

export function WorkoutExerciseSelector({
  exercises,
  onClose,
  target,
}: {
  exercises: Exercise[]
  onClose: () => void
  target: { dayIndex: number; exerciseIndex?: number } | null
}) {
  const { getValues, setValue } = useFormContext<WorkoutFormValues>()
  const [filters, setFilters] = useState<ExerciseFilters>(emptyExerciseFilters)
  const results = useMemo(() => filterExercises(exercises, filters), [exercises, filters])
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
      sets: 3,
      repetitions: "8-12",
      initialLoad: 0,
    }
    const next = [...current]
    if (target.exerciseIndex === undefined) next.push(nextExercise)
    else next[target.exerciseIndex] = nextExercise
    setValue(`days.${target.dayIndex}.exercises`, next, {
      shouldDirty: true,
      shouldValidate: true,
    })
    setFilters(emptyExerciseFilters)
    onClose()
  }

  return (
    <Dialog onOpenChange={open => !open && onClose()} open={target !== null}>
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
        <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto">
          <div className="space-y-2">
            {results.map(exercise => {
              const isSelected = target
                ? getValues(`days.${target.dayIndex}.exercises`).some(
                    item =>
                      item.exerciseReference.source === exercise.source &&
                      item.exerciseReference.exerciseId === exercise.id
                  )
                : false

              return (
                <button
                  className={
                    isSelected
                      ? "flex w-full items-center justify-between gap-4 border border-primary bg-muted p-3 text-left"
                      : "flex w-full items-center justify-between gap-4 border p-3 text-left hover:bg-muted"
                  }
                  key={`${exercise.source}:${exercise.id}`}
                  onClick={() => select(exercise)}
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
                    {isSelected
                      ? "Selecionado"
                      : exercise.source === "default"
                        ? "Padrão"
                        : "Personalizado"}
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
      </DialogContent>
    </Dialog>
  )
}
