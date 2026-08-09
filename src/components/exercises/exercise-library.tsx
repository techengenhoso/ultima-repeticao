"use client"

import { useMemo, useState } from "react"
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty"
import { useExerciseLibrary } from "@/hooks/use-exercise-library"
import {
  type ExerciseFilters,
  emptyExerciseFilters,
  filterExercises,
} from "@/lib/exercises/catalog"
import type { CustomExercise, Exercise, ExerciseInput } from "@/lib/exercises/types"
import { Skeletons } from "../skeleton"
import { ExerciseCard } from "./exercise-card"
import { ExerciseCreateOrEdit } from "./exercise-create-or-edit"
import { ExerciseDelete } from "./exercise-delete"
import { ExerciseDetails } from "./exercise-details"
import { ExercisesFilter } from "./exercises-filter"

export function ExerciseLibrary() {
  const { exercises, isDeleting, isLoading, removeExercise, saveExercise } =
    useExerciseLibrary()
  const [filters, setFilters] = useState<ExerciseFilters>(emptyExerciseFilters)
  const [formExercise, setFormExercise] = useState<Exercise | null | undefined>()
  const [details, setDetails] = useState<Exercise | null>(null)
  const [deleting, setDeleting] = useState<CustomExercise | null>(null)

  const filteredExercises = useMemo(
    () => filterExercises(exercises, filters),
    [exercises, filters]
  )

  async function handleSaveExercise(values: ExerciseInput) {
    if (await saveExercise(formExercise, values)) setFormExercise(undefined)
  }

  async function confirmDelete() {
    if (deleting && (await removeExercise(deleting))) setDeleting(null)
  }

  return (
    <div className="space-y-8">
      <ExercisesFilter
        onCreate={() => setFormExercise(null)}
        onFiltersChange={setFilters}
        resultCount={filteredExercises.length}
      />

      {isLoading ? (
        <Skeletons />
      ) : filteredExercises.length === 0 ? (
        <Empty className="border">
          <EmptyHeader>
            <EmptyTitle>Nenhum resultado encontrado</EmptyTitle>

            <EmptyDescription>
              Tente mudar, limpar os filtros ou crie um exercício
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {filteredExercises.map(exercise => (
            <ExerciseCard
              exercise={exercise}
              key={`${exercise.source}-${exercise.id}`}
              onDelete={setDeleting}
              onDetails={setDetails}
              onEdit={setFormExercise}
            />
          ))}
        </div>
      )}

      <ExerciseCreateOrEdit
        exercise={formExercise}
        onClose={() => setFormExercise(undefined)}
        onSubmit={handleSaveExercise}
      />

      <ExerciseDetails exercise={details} onClose={() => setDetails(null)} />

      <ExerciseDelete
        exercise={deleting}
        isDeleting={isDeleting}
        onClose={() => setDeleting(null)}
        onConfirm={confirmDelete}
      />
    </div>
  )
}
