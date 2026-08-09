"use client"

import { SearchIcon } from "lucide-react"
import { useState } from "react"
import { SelectField } from "@/components/select-field"
import { TextField } from "@/components/text-field"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import {
  emptyExerciseFilters,
  type ExerciseFilters as Filters,
} from "@/lib/exercises/catalog"
import {
  type MuscleGroup,
  muscleGroups,
  type SourceGroup,
  sourceGroups,
} from "@/lib/exercises/types"
import { Badge } from "../ui/badge"

interface Props {
  resultCount: number
  onFiltersChange: (filters: Filters) => void
  onCreate: () => void
}

export function ExercisesFilter({ resultCount, onFiltersChange, onCreate }: Props) {
  const [filters, setFilters] = useState(emptyExerciseFilters)
  const hasFilters = !!filters.search || !!filters.muscle || !!filters.source

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
      <CardContent className="grid gap-5 lg:grid-cols-3">
        <TextField
          icon={<SearchIcon aria-hidden="true" />}
          id="exercise-search"
          label="Nome do exercício"
          onChange={event => updateFilters({ search: event.target.value })}
          placeholder="Buscar pelo nome"
          type="text"
          value={filters.search}
        />

        <SelectField
          icon={<SearchIcon aria-hidden="true" />}
          id="muscleGroups"
          label="Grupo muscular"
          onChange={value => updateFilters({ muscle: value as "" | MuscleGroup })}
          options={muscleGroups}
          value={filters.muscle}
        />

        <SelectField
          icon={<SearchIcon aria-hidden="true" />}
          id="source"
          label="Origem"
          onChange={value => updateFilters({ source: value as "" | SourceGroup })}
          options={sourceGroups}
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

          <Button onClick={onCreate} type="button">
            Novo exercício
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
