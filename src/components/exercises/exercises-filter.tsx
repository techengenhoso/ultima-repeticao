"use client"

import { BicepsFlexedIcon, GaugeIcon, SearchIcon } from "lucide-react"
import { useState } from "react"
import { SelectField } from "@/components/select-field"
import { TextField } from "@/components/text-field"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { useExercise } from "@/contexts/exercise-context"
import {
  emptyExerciseFilters,
  type ExerciseFilters as Filters,
} from "@/lib/exercises/catalog"
import {
  type ExerciseDifficulty,
  type ExerciseSource,
  type Muscle,
  type MuscleGroup,
} from "@/lib/exercises/types"
import { difficulties, muscleGroups, muscles, origins } from "@/lib/options-select"
import { Badge } from "../ui/badge"

export function ExercisesFilter() {
  const {
    filteredExercises,
    setFilters: onFiltersChange,
    setFormExercise: onCreate,
  } = useExercise()

  const [filters, setFilters] = useState(emptyExerciseFilters)
  const hasFilters = Object.values(filters).some(Boolean)

  const resultCount = filteredExercises.length

  function updateFilters(values: Partial<Filters>) {
    const nextFilters = { ...filters, ...values }
    setFilters(nextFilters)
    onFiltersChange(nextFilters)
  }

  function clearFilters() {
    setFilters(emptyExerciseFilters)
    onFiltersChange(emptyExerciseFilters)
  }

  return (
    <Card>
      <CardContent className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        <TextField
          icon={<SearchIcon aria-hidden="true" />}
          id="name"
          label="Nome do exercício"
          onChange={event => updateFilters({ search: event.target.value })}
          placeholder="Buscar pelo nome"
          type="text"
          value={filters.search}
        />

        <SelectField
          icon={<SearchIcon aria-hidden="true" />}
          id="muscleGroup"
          label="Grupo muscular"
          onChange={value => updateFilters({ muscle: value as "" | MuscleGroup })}
          options={muscleGroups}
          value={filters.muscle}
        />

        <SelectField
          icon={<BicepsFlexedIcon aria-hidden="true" />}
          id="primaryMuscles"
          label="Músculo principal"
          onChange={value => updateFilters({ primaryMuscle: value as "" | Muscle })}
          options={[...muscles]}
          value={filters.primaryMuscle}
        />

        <SelectField
          icon={<BicepsFlexedIcon aria-hidden="true" />}
          id="secondaryMuscles"
          label="Músculo secundário"
          onChange={value => updateFilters({ secondaryMuscle: value as "" | Muscle })}
          options={[...muscles]}
          value={filters.secondaryMuscle}
        />

        <SelectField
          icon={<GaugeIcon aria-hidden="true" />}
          id="difficulty"
          label="Dificuldade"
          onChange={value =>
            updateFilters({ difficulty: value as "" | ExerciseDifficulty })
          }
          options={difficulties}
          value={filters.difficulty}
        />

        <SelectField
          icon={<SearchIcon aria-hidden="true" />}
          id="source"
          label="Origem"
          onChange={value => updateFilters({ source: value as "" | ExerciseSource })}
          options={origins}
          value={filters.source}
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

          <Button
            onClick={() => {
              onCreate(null)
            }}
            type="button"
          >
            Novo exercício
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
