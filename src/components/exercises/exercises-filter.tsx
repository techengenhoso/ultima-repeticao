"use client"

import {
  BicepsFlexedIcon,
  GaugeIcon,
  SearchIcon,
  SlidersHorizontalIcon,
} from "lucide-react"
import { useState } from "react"
import { ComboboxField } from "@/components/combobox-field"
import { TextField } from "@/components/text-field"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useExercise } from "@/contexts/exercise-context"
import { difficulties, muscleGroups, muscles, origins } from "@/lib/options-select"
import {
  type ExerciseDifficulty,
  type ExerciseSource,
  type Muscle,
  type MuscleGroup,
} from "@/modules/exercises/domain/exercise"
import {
  emptyExerciseFilters,
  type ExerciseFilters as Filters,
} from "@/modules/exercises/domain/exercise-library"
import { Badge } from "../ui/badge"

interface ExerciseFilterFieldsProps {
  filters: Filters
  onFiltersChange: (values: Partial<Filters>) => void
}

function ExerciseFilterFields({ filters, onFiltersChange }: ExerciseFilterFieldsProps) {
  return (
    <>
      <TextField
        icon={<SearchIcon aria-hidden="true" />}
        id="name"
        label="Nome do exercício"
        onChange={event => onFiltersChange({ search: event.target.value })}
        placeholder="Buscar pelo nome"
        type="text"
        value={filters.search}
      />

      <ComboboxField
        icon={<SearchIcon aria-hidden="true" />}
        id="muscleGroup"
        label="Grupo muscular"
        onChange={value => onFiltersChange({ muscle: value as "" | MuscleGroup })}
        options={muscleGroups}
        value={filters.muscle}
      />

      <ComboboxField
        icon={<BicepsFlexedIcon aria-hidden="true" />}
        id="primaryMuscles"
        label="Músculo principal"
        onChange={value => onFiltersChange({ primaryMuscle: value as "" | Muscle })}
        options={[...muscles]}
        value={filters.primaryMuscle}
      />

      <ComboboxField
        icon={<BicepsFlexedIcon aria-hidden="true" />}
        id="secondaryMuscles"
        label="Músculo secundário"
        onChange={value => onFiltersChange({ secondaryMuscle: value as "" | Muscle })}
        options={[...muscles]}
        value={filters.secondaryMuscle}
      />

      <ComboboxField
        icon={<GaugeIcon aria-hidden="true" />}
        id="difficulty"
        label="Dificuldade"
        onChange={value =>
          onFiltersChange({ difficulty: value as "" | ExerciseDifficulty })
        }
        options={difficulties}
        value={filters.difficulty}
      />

      <ComboboxField
        icon={<SearchIcon aria-hidden="true" />}
        id="source"
        label="Origem"
        onChange={value => onFiltersChange({ source: value as "" | ExerciseSource })}
        options={origins}
        value={filters.source}
      />
    </>
  )
}

export function ExercisesFilter() {
  const {
    filteredExercises,
    setFilters: onFiltersChange,
    setFormExercise: onCreate,
  } = useExercise()

  const [filters, setFilters] = useState(emptyExerciseFilters)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [sheetFilters, setSheetFilters] = useState(emptyExerciseFilters)
  const hasFilters = Object.values(filters).some(Boolean)
  const hasSheetFilters = Object.values(sheetFilters).some(Boolean)

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

  function updateSheetFilters(values: Partial<Filters>) {
    setSheetFilters(currentFilters => ({ ...currentFilters, ...values }))
  }

  function clearSheetFilters() {
    setSheetFilters(emptyExerciseFilters)
    clearFilters()
    setIsSheetOpen(false)
  }

  function applySheetFilters() {
    setFilters(sheetFilters)
    onFiltersChange(sheetFilters)
    setIsSheetOpen(false)
  }

  function handleSheetOpenChange(open: boolean) {
    if (open) setSheetFilters(filters)
    setIsSheetOpen(open)
  }

  return (
    <>
      <Card className="md:hidden">
        <CardHeader>
          <CardTitle>Filtrar exercícios</CardTitle>

          <CardDescription>
            Refine a lista para encontrar o exercício desejado
          </CardDescription>
        </CardHeader>

        <CardContent className="grid gap-4">
          <div className="grid grid-cols-2 gap-3">
            <Sheet onOpenChange={handleSheetOpenChange} open={isSheetOpen}>
              <SheetTrigger asChild>
                <Button className="w-full" type="button" variant="secondary">
                  <SlidersHorizontalIcon aria-hidden="true" />
                  Filtros
                </Button>
              </SheetTrigger>

              <SheetContent className="data-[side=right]:w-[min(100%,24rem)]">
                <SheetHeader>
                  <SheetTitle>Filtrar exercícios</SheetTitle>

                  <SheetDescription>
                    Refine a lista para encontrar o exercício desejado
                  </SheetDescription>
                </SheetHeader>

                <div className="min-h-0 flex-1 overflow-y-auto px-8 pb-5">
                  <div className="grid gap-5">
                    <ExerciseFilterFields
                      filters={sheetFilters}
                      onFiltersChange={updateSheetFilters}
                    />
                  </div>
                </div>

                <SheetFooter className="border-t">
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      disabled={!hasFilters && !hasSheetFilters}
                      onClick={clearSheetFilters}
                      type="button"
                      variant="secondary"
                    >
                      Limpar
                    </Button>

                    <Button onClick={applySheetFilters} type="button">
                      Filtrar
                    </Button>
                  </div>
                </SheetFooter>
              </SheetContent>
            </Sheet>

            <Button onClick={() => onCreate(null)} type="button">
              Novo exercício
            </Button>
          </div>

          <Badge aria-live="polite" className="justify-self-center" variant="secondary">
            {resultCount}
            {" resultado"}
            {resultCount !== 1 && "s"}
          </Badge>
        </CardContent>
      </Card>

      <Card className="hidden md:block">
        <CardHeader className="mb-5">
          <CardTitle>Filtrar exercícios</CardTitle>

          <CardDescription>
            Refine a lista para encontrar o exercício desejado
          </CardDescription>
        </CardHeader>

        <CardContent className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <ExerciseFilterFields filters={filters} onFiltersChange={updateFilters} />
        </CardContent>

        <CardFooter className="mt-3 flex-col items-stretch gap-5 lg:flex-row lg:items-center lg:justify-between">
          <Badge
            aria-live="polite"
            className="order-2 self-center lg:order-1 lg:self-auto"
            variant="secondary"
          >
            {resultCount}
            {" resultado"}
            {resultCount !== 1 && "s"}
          </Badge>

          <div className="order-1 flex w-full justify-end gap-3 lg:order-2 lg:w-auto">
            <Button
              disabled={!hasFilters}
              onClick={clearFilters}
              type="button"
              variant="secondary"
            >
              Limpar
            </Button>
            <Button onClick={() => onCreate(null)} type="button">
              Novo exercício
            </Button>
          </div>
        </CardFooter>
      </Card>
    </>
  )
}
