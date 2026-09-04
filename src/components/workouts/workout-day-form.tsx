"use client"

import {
  ArrowDownIcon,
  ArrowUpIcon,
  BicepsFlexedIcon,
  ChevronDownIcon,
  CopyIcon,
  DumbbellIcon,
  Trash2Icon,
} from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { useFieldArray, useFormContext, useWatch } from "react-hook-form"
import { MultiSelectField } from "@/components/multi-select-field"
import { TextField } from "@/components/text-field"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { FieldError } from "@/components/ui/field"
import { type Exercise } from "@/lib/exercises/types"
import { muscleGroups, muscles } from "@/lib/options-select"
import type { WorkoutFormValues } from "@/lib/workouts/types"
import { WorkoutExerciseForm } from "./workout-exercise-form"

export function WorkoutDayForm({
  exercisesByReference,
  index,
  total,
  canRemove,
  onAddExercise,
  onDown,
  onDuplicate,
  onRemove,
  onReplaceExercise,
  onUp,
}: {
  exercisesByReference: Map<string, Exercise>
  index: number
  total: number
  canRemove: boolean
  onAddExercise: () => void
  onDown: () => void
  onDuplicate: () => void
  onRemove: () => void
  onReplaceExercise: (exerciseIndex: number) => void
  onUp: () => void
}) {
  const [isOpen, setIsOpen] = useState(true)
  const {
    control,
    getValues,
    register,
    setValue,
    formState: { errors },
  } = useFormContext<WorkoutFormValues>()
  const exercises = useFieldArray({ control, name: `days.${index}.exercises` })
  const selectedExercises = useWatch({
    control,
    name: `days.${index}.exercises`,
  })
  const automaticMuscleGroups = useMemo(
    () => [
      ...new Set(selectedExercises.map(exercise => exercise.exerciseSnapshot.muscleGroup)),
    ],
    [selectedExercises]
  )
  const primaryMuscles = useMemo(
    () => [
      ...new Set(
        selectedExercises.flatMap(
          exercise =>
            exercisesByReference.get(
              `${exercise.exerciseReference.source}:${exercise.exerciseReference.exerciseId}`
            )?.primaryMuscles ?? []
        )
      ),
    ],
    [exercisesByReference, selectedExercises]
  )
  const secondaryMuscles = useMemo(
    () => [
      ...new Set(
        selectedExercises.flatMap(
          exercise =>
            exercisesByReference.get(
              `${exercise.exerciseReference.source}:${exercise.exerciseReference.exerciseId}`
            )?.secondaryMuscles ?? []
        )
      ),
    ],
    [exercisesByReference, selectedExercises]
  )

  useEffect(() => {
    const current = getValues(`days.${index}.muscleGroups`)
    if (
      current.length !== automaticMuscleGroups.length ||
      current.some(group => !automaticMuscleGroups.includes(group))
    )
      setValue(`days.${index}.muscleGroups`, automaticMuscleGroups, {
        shouldDirty: true,
        shouldValidate: true,
      })
  }, [automaticMuscleGroups, getValues, index, setValue])

  return (
    <Collapsible onOpenChange={setIsOpen} open={isOpen}>
      <Card
        className="gap-0 border border-border border-l-2 border-l-primary py-0"
        size="sm"
      >
        <CardHeader className="border-b bg-muted/40 py-4 [.border-b]:pb-4">
          <div className="flex items-center justify-between gap-2">
            <CollapsibleTrigger asChild>
              <button
                aria-label={`${isOpen ? "Ocultar" : "Exibir"} dia ${index + 1}`}
                className="group flex min-w-0 flex-1 items-center gap-3 text-left"
                type="button"
              >
                <span className="flex size-9 shrink-0 items-center justify-center bg-primary text-sm font-bold text-primary-foreground">
                  {index + 1}
                </span>

                <span className="min-w-0 flex-1">
                  <CardTitle className="text-base">Treino</CardTitle>

                  <span className="block text-xs text-muted-foreground">
                    {selectedExercises.length === 0
                      ? "Nenhum exercício"
                      : `${selectedExercises.length} ${selectedExercises.length === 1 ? "exercício" : "exercícios"}`}
                  </span>
                </span>

                <ChevronDownIcon
                  aria-hidden="true"
                  className="size-4 shrink-0 text-muted-foreground transition-transform group-aria-expanded:rotate-180"
                />
              </button>
            </CollapsibleTrigger>

            <div className="flex shrink-0 gap-1">
              <Button
                aria-label="Mover dia para cima"
                disabled={index === 0}
                onClick={onUp}
                size="icon-sm"
                type="button"
                variant="ghost"
              >
                <ArrowUpIcon />
              </Button>

              <Button
                aria-label="Mover dia para baixo"
                disabled={index === total - 1}
                onClick={onDown}
                size="icon-sm"
                type="button"
                variant="ghost"
              >
                <ArrowDownIcon />
              </Button>

              <Button
                aria-label="Duplicar dia"
                onClick={onDuplicate}
                size="icon-sm"
                type="button"
                variant="ghost"
              >
                <CopyIcon />
              </Button>

              <Button
                aria-label="Remover dia"
                disabled={!canRemove}
                onClick={onRemove}
                size="icon-sm"
                type="button"
                variant="destructive"
              >
                <Trash2Icon />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CollapsibleContent>
          <CardContent className="space-y-6 py-5">
            <div>
              <h4 className="font-semibold">Configuração do dia de treino</h4>

              <p className="text-xs text-muted-foreground">
                Defina o nome e confira os músculos trabalhados, os músculos são carregados
                automaticamente depois de adicionar um exercício
              </p>
            </div>

            <div className="space-y-5">
              <TextField
                error={errors.days?.[index]?.name}
                icon={<DumbbellIcon />}
                id={`day-${index}-name`}
                label="Nome do dia"
                placeholder="Segunda-feira"
                {...register(`days.${index}.name`)}
              />

              <MultiSelectField
                disabled
                icon={<DumbbellIcon aria-hidden="true" />}
                id={`day-${index}-groups`}
                label="Grupos musculares"
                onChange={() => undefined}
                options={muscleGroups}
                placeholder="Seleção automática"
                value={automaticMuscleGroups}
              />
            </div>

            <div className="space-y-5">
              <MultiSelectField
                disabled
                icon={<BicepsFlexedIcon aria-hidden="true" />}
                id={`day-${index}-primary-muscles`}
                label="Músculos principais"
                onChange={() => undefined}
                options={muscles}
                placeholder="Seleção automática"
                value={primaryMuscles}
              />

              <MultiSelectField
                disabled
                icon={<BicepsFlexedIcon aria-hidden="true" />}
                id={`day-${index}-secondary-muscles`}
                label="Músculos secundários"
                onChange={() => undefined}
                options={muscles}
                placeholder="Seleção automática"
                value={secondaryMuscles}
              />
            </div>

            <div className="-mx-(--card-spacing) flex flex-wrap items-center justify-between gap-3 border-t px-(--card-spacing) pt-5">
              <div>
                <h4 className="font-semibold">Exercícios do treino</h4>

                <p className="text-xs text-muted-foreground">
                  Organize a sequência e ajuste séries e repetições de cada exercício
                </p>
              </div>

              <Button onClick={onAddExercise} size="sm" type="button" variant="outline">
                Adicionar exercício
              </Button>
            </div>

            {exercises.fields.length === 0 ? (
              <div className="flex flex-col items-center gap-2 border border-dashed bg-muted/20 px-5 py-8 text-center">
                <span className="flex size-10 items-center justify-center bg-muted">
                  <DumbbellIcon
                    aria-hidden="true"
                    className="size-5 text-muted-foreground"
                  />
                </span>

                <div>
                  <p className="text-sm font-medium">Seu treino ainda está vazio</p>

                  <p className="text-xs text-muted-foreground">
                    Adicione o primeiro exercício para montar a sequência
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {exercises.fields.map((exercise, exerciseIndex) => (
                  <WorkoutExerciseForm
                    dayIndex={index}
                    exerciseIndex={exerciseIndex}
                    exercisesByReference={exercisesByReference}
                    key={exercise.id}
                    onDown={() => exercises.move(exerciseIndex, exerciseIndex + 1)}
                    onRemove={() => exercises.remove(exerciseIndex)}
                    onReplace={() => onReplaceExercise(exerciseIndex)}
                    onUp={() => exercises.move(exerciseIndex, exerciseIndex - 1)}
                    total={exercises.fields.length}
                  />
                ))}
              </div>
            )}

            <FieldError
              errors={[
                errors.days?.[index]?.exercises,
                errors.days?.[index]?.exercises?.root,
              ]}
            />
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  )
}
