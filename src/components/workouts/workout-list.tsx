"use client"

import { RefreshCwIcon } from "lucide-react"
import { Skeletons } from "@/components/skeleton"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"
import { useWorkout } from "@/contexts/workout-context"
import { WorkoutCard } from "./workout-card"

export function WorkoutList() {
  const {
    activateWorkout,
    deactivateWorkout,
    duplicateWorkout,
    filteredWorkouts,
    isActivating,
    isLoading,
    loadingError,
    loadWorkouts,
    workouts,
    setDeleting,
    setDetails,
    setFormWorkout,
  } = useWorkout()
  if (isLoading) return <Skeletons />

  if (loadingError)
    return (
      <Empty className="border">
        <EmptyHeader>
          <EmptyTitle>Não foi possível carregar suas fichas</EmptyTitle>
          <EmptyDescription>Verifique sua conexão e tente novamente</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button onClick={loadWorkouts} variant="outline">
            <RefreshCwIcon />
            Tentar novamente
          </Button>
        </EmptyContent>
      </Empty>
    )

  if (workouts.length === 0)
    return (
      <Empty className="border">
        <EmptyHeader>
          <EmptyTitle>Nenhuma ficha cadastrada</EmptyTitle>
          <EmptyDescription>
            Tente mudar, limpar os filtros ou crie uma ficha
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )

  if (filteredWorkouts.length === 0)
    return (
      <Empty className="border">
        <EmptyHeader>
          <EmptyTitle>Nenhum resultado encontrado</EmptyTitle>
          <EmptyDescription>Tente mudar ou limpar os filtros</EmptyDescription>
        </EmptyHeader>
      </Empty>
    )

  return (
    <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
      {filteredWorkouts.map(workout => (
        <WorkoutCard
          isActivating={isActivating}
          key={workout.id}
          onActivate={activateWorkout}
          onDeactivate={deactivateWorkout}
          onDelete={setDeleting}
          onDetails={setDetails}
          onDuplicate={duplicateWorkout}
          onEdit={setFormWorkout}
          workout={workout}
        />
      ))}
    </div>
  )
}
