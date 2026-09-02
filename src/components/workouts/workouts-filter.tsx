"use client"

import { CircleDotIcon, SearchIcon } from "lucide-react"
import { useState } from "react"
import { SelectField } from "@/components/select-field"
import { TextField } from "@/components/text-field"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { useWorkout } from "@/contexts/workout-context"
import { statuses } from "@/lib/options-select"
import { emptyWorkoutFilters, type WorkoutFilters } from "@/lib/workouts/catalog"

export function WorkoutsFilter() {
  const {
    filteredWorkouts,
    setFilters: onFiltersChange,
    setFormWorkout: onCreate,
  } = useWorkout()

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
      <CardContent className="grid gap-5 md:grid-cols-2">
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
          icon={<CircleDotIcon aria-hidden="true" />}
          id="workoutStatus"
          label="Status"
          onChange={value => updateFilters({ status: value as WorkoutFilters["status"] })}
          options={statuses}
          value={filters.status}
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

        <div className="order-1 grid w-full grid-cols-2 gap-5 lg:order-2 lg:flex lg:w-auto">
          <Button
            disabled={!hasFilters}
            onClick={clearFilters}
            type="button"
            variant="secondary"
          >
            Limpar filtros
          </Button>

          <Button onClick={() => onCreate(null)} type="button">
            Nova ficha
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
