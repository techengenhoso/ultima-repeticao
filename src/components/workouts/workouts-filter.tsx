"use client"

import { BicepsFlexedIcon, CalendarDaysIcon, SearchIcon } from "lucide-react"
import { useState } from "react"
import { SelectField } from "@/components/select-field"
import { TextField } from "@/components/text-field"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { WorkoutCreateChoice } from "@/components/workouts/workout-create-choice"
import { useWorkout } from "@/contexts/workout-context"
import { muscleGroups } from "@/lib/options-select"
import type { MuscleGroup } from "@/modules/exercises/domain/exercise"
import {
  emptyWorkoutFilters,
  type WorkoutFilters,
} from "@/modules/workouts/domain/workout-library"

export function WorkoutsFilter() {
  const { filteredWorkouts, setFilters: onFiltersChange } = useWorkout()

  const [filters, setFilters] = useState(emptyWorkoutFilters)
  const hasFilters = Object.values(filters).some(Boolean)
  const resultCount = filteredWorkouts.length

  function updateFilters(values: Partial<WorkoutFilters>) {
    const nextFilters = { ...filters, ...values }
    setFilters(nextFilters)
    onFiltersChange(nextFilters)
  }

  function clearFilters() {
    setFilters(emptyWorkoutFilters)
    onFiltersChange(emptyWorkoutFilters)
  }

  return (
    <Card>
      <CardContent className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        <TextField
          icon={<SearchIcon aria-hidden="true" />}
          id="workoutName"
          label="Nome da ficha"
          onChange={event => updateFilters({ search: event.target.value })}
          placeholder="Buscar pelo nome"
          type="text"
          value={filters.search}
        />

        <SelectField
          icon={<CalendarDaysIcon aria-hidden="true" />}
          id="workoutDaysPerWeek"
          label="Dias de treino"
          onChange={value =>
            updateFilters({ daysPerWeek: value as WorkoutFilters["daysPerWeek"] })
          }
          options={[
            { label: "1 dia", value: "1" },
            { label: "2 dias", value: "2" },
            { label: "3 dias", value: "3" },
            { label: "4 dias", value: "4" },
            { label: "5 ou mais dias", value: "5+" },
          ]}
          value={filters.daysPerWeek}
        />

        <SelectField
          icon={<BicepsFlexedIcon aria-hidden="true" />}
          id="workoutMuscleGroup"
          label="Grupo muscular"
          onChange={value => updateFilters({ muscleGroup: value as "" | MuscleGroup })}
          options={muscleGroups}
          value={filters.muscleGroup}
        />
      </CardContent>

      <CardFooter className="flex-col items-stretch gap-5 lg:flex-row lg:items-center lg:justify-between">
        <Badge
          aria-live="polite"
          className="order-2 self-center lg:order-1 lg:self-auto"
          variant="secondary"
        >
          {resultCount}
          {" resultado"}
          {resultCount !== 1 && "s"}
        </Badge>

        <div className="order-1 grid w-full gap-3 sm:grid-cols-2 lg:order-2 lg:flex lg:w-auto">
          <Button
            disabled={!hasFilters}
            onClick={clearFilters}
            type="button"
            variant="secondary"
          >
            Limpar filtros
          </Button>

          <WorkoutCreateChoice />
        </div>
      </CardFooter>
    </Card>
  )
}
