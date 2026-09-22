"use client"

import {
  BicepsFlexedIcon,
  CalendarDaysIcon,
  Clock3Icon,
  DumbbellIcon,
  SearchIcon,
  SlidersHorizontalIcon,
} from "lucide-react"
import { useState } from "react"
import { SelectField } from "@/components/select-field"
import { TextField } from "@/components/text-field"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { WorkoutCreateChoice } from "@/components/workouts/workout-create-choice"
import { useWorkout } from "@/contexts/workout-context"
import { muscleGroups } from "@/lib/options-select"
import type { MuscleGroup } from "@/modules/exercises/domain/exercise"
import {
  emptyWorkoutFilters,
  type WorkoutFilters,
} from "@/modules/workouts/domain/workout-library"

interface WorkoutFilterFieldsProps {
  filters: WorkoutFilters
  onFiltersChange: (values: Partial<WorkoutFilters>) => void
}

function WorkoutFilterFields({ filters, onFiltersChange }: WorkoutFilterFieldsProps) {
  return (
    <>
      <TextField
        icon={<SearchIcon aria-hidden="true" />}
        id="workoutName"
        label="Nome da ficha"
        onChange={event => onFiltersChange({ search: event.target.value })}
        placeholder="Buscar pelo nome"
        type="text"
        value={filters.search}
      />

      <SelectField
        icon={<BicepsFlexedIcon aria-hidden="true" />}
        id="workoutMuscleGroup"
        label="Grupo muscular"
        onChange={value => onFiltersChange({ muscleGroup: value as "" | MuscleGroup })}
        options={muscleGroups}
        value={filters.muscleGroup}
      />

      <TextField
        icon={<DumbbellIcon aria-hidden="true" />}
        id="workoutExercise"
        label="Exercício incluído"
        onChange={event => onFiltersChange({ exerciseSearch: event.target.value })}
        placeholder="Buscar pelo exercício"
        type="text"
        value={filters.exerciseSearch}
      />

      <TextField
        icon={<SearchIcon aria-hidden="true" />}
        id="workoutDay"
        label="Nome do treino"
        onChange={event => onFiltersChange({ daySearch: event.target.value })}
        placeholder="Buscar pelo nome"
        type="text"
        value={filters.daySearch}
      />

      <SelectField
        icon={<CalendarDaysIcon aria-hidden="true" />}
        id="workoutDaysPerWeek"
        label="Dias de treino"
        onChange={value =>
          onFiltersChange({ daysPerWeek: value as WorkoutFilters["daysPerWeek"] })
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
        icon={<Clock3Icon aria-hidden="true" />}
        id="workoutEstimatedDuration"
        label="Duração por treino"
        onChange={value =>
          onFiltersChange({
            estimatedDuration: value as WorkoutFilters["estimatedDuration"],
          })
        }
        options={[
          { label: "Até 30 min", value: "up-to-30" },
          { label: "31 a 45 min", value: "31-to-45" },
          { label: "46 a 60 min", value: "46-to-60" },
          { label: "Mais de 60 min", value: "over-60" },
        ]}
        value={filters.estimatedDuration}
      />
    </>
  )
}

export function WorkoutsFilter() {
  const { filteredWorkouts, setFilters: onFiltersChange } = useWorkout()

  const [filters, setFilters] = useState(emptyWorkoutFilters)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [sheetFilters, setSheetFilters] = useState(emptyWorkoutFilters)
  const hasFilters = Object.values(filters).some(Boolean)
  const hasSheetFilters = Object.values(sheetFilters).some(Boolean)
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

  function updateSheetFilters(values: Partial<WorkoutFilters>) {
    setSheetFilters(currentFilters => ({ ...currentFilters, ...values }))
  }

  function clearSheetFilters() {
    setSheetFilters(emptyWorkoutFilters)
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
        <CardContent className="grid grid-cols-2 gap-5">
          <div className="col-span-2 grid grid-cols-2 gap-3">
            <Sheet onOpenChange={handleSheetOpenChange} open={isSheetOpen}>
              <SheetTrigger asChild>
                <Button type="button" variant="secondary">
                  <SlidersHorizontalIcon aria-hidden="true" />
                  Filtros
                </Button>
              </SheetTrigger>

              <SheetContent className="data-[side=right]:w-[min(100%,24rem)]">
                <SheetHeader>
                  <SheetTitle>Filtrar fichas</SheetTitle>
                  <SheetDescription>
                    Refine a lista para encontrar a ficha desejada
                  </SheetDescription>
                </SheetHeader>

                <div className="min-h-0 flex-1 overflow-y-auto px-8 pb-5">
                  <div className="grid gap-5">
                    <WorkoutFilterFields
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

            <WorkoutCreateChoice />
          </div>

          <Badge
            aria-live="polite"
            className="col-span-2 justify-self-center"
            variant="secondary"
          >
            {resultCount}
            {" resultado"}
            {resultCount !== 1 && "s"}
          </Badge>
        </CardContent>
      </Card>

      <Card className="hidden md:block">
        <CardContent className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <WorkoutFilterFields filters={filters} onFiltersChange={updateFilters} />
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

          <div className="order-1 grid w-full grid-cols-2 gap-5 lg:order-2 lg:flex lg:w-auto">
            <Button
              disabled={!hasFilters}
              onClick={clearFilters}
              type="button"
              variant="secondary"
            >
              Limpar
            </Button>

            <WorkoutCreateChoice />
          </div>
        </CardFooter>
      </Card>
    </>
  )
}
