"use client"

import { Skeletons } from "@/components/skeleton"
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty"
import { useExercise } from "@/contexts/exercise-context"
import { ExerciseCard } from "./exercise-card"

export function ExerciseList() {
  const { filteredExercises, isLoading, setDeleting, setDetails, setFormExercise } =
    useExercise()

  return (
    <div className="space-y-8">
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
    </div>
  )
}
