"use client"

import {
  ArrowDownIcon,
  ArrowUpIcon,
  ChevronDownIcon,
  RepeatIcon,
  Trash2Icon,
} from "lucide-react"
import { useController, useFormContext } from "react-hook-form"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemTitle,
} from "@/components/ui/item"
import { type Exercise, muscleGroupLabel } from "@/modules/exercises/domain/exercise"
import type { WorkoutFormValues } from "@/modules/workouts/domain/workout"

import {
  useWorkoutReview,
  WorkoutReviewMessages,
} from "./generator/workout-review-context"

interface Props {
  dayIndex: number
  exerciseIndex: number
  exercisesByReference: Map<string, Exercise>
  isOpen: boolean
  total: number
  onOpenChange: (open: boolean) => void
  onDown: () => void
  onRemove: () => void
  onReplace: () => void
  onUp: () => void
}

export function WorkoutExerciseForm({
  dayIndex,
  exerciseIndex,
  exercisesByReference,
  isOpen,
  total,
  onOpenChange,
  onDown,
  onRemove,
  onReplace,
  onUp,
}: Props) {
  const {
    control,
    register,
    getValues,
    formState: { errors },
  } = useFormContext<WorkoutFormValues>()

  const review = useWorkoutReview()
  const path = ["days", dayIndex, "exercises", exerciseIndex]
  const hasReviewError = (field: string) =>
    review?.issues.some(
      issue =>
        issue.severity === "error" &&
        issue.path.length === path.length + 1 &&
        issue.path.every((part, index) => part === [...path, field][index])
    )
  const item = getValues(`days.${dayIndex}.exercises.${exerciseIndex}`)
  const initialLoad = useController({
    control,
    name: `days.${dayIndex}.exercises.${exerciseIndex}.initialLoad`,
  })

  const current = exercisesByReference.get(
    `${item.exerciseReference.source}:${item.exerciseReference.exerciseId}`
  )

  return (
    <Collapsible onOpenChange={onOpenChange} open={isOpen}>
      <Item className="min-w-0 gap-0 overflow-hidden p-0" size="sm" variant="outline">
        <ItemHeader
          className={`grid grid-cols-[auto_minmax(0,1fr)_auto] items-stretch gap-x-3 gap-y-2 bg-muted/50 px-3 py-3 sm:flex sm:items-center sm:gap-3 ${isOpen ? "border-b" : ""}`}
        >
          <div className="row-span-2 flex w-8 items-center justify-center bg-primary text-xs font-bold text-primary-foreground sm:size-8 sm:self-auto">
            {exerciseIndex + 1}
          </div>
          <CollapsibleTrigger asChild>
            <button
              aria-label={`${isOpen ? "Ocultar" : "Exibir"} detalhes do exercício ${current?.name ?? item.exerciseSnapshot.name}`}
              className="col-start-2 flex min-w-0 items-center text-left outline-none focus-visible:ring-2 focus-visible:ring-ring sm:col-auto sm:flex-1"
              type="button"
            >
              <ItemContent className="min-w-0">
                <ItemTitle className="line-clamp-none wrap-break-word">
                  {current?.name ?? item.exerciseSnapshot.name}
                </ItemTitle>

                <ItemDescription>
                  {
                    muscleGroupLabel[
                      current?.muscleGroup ?? item.exerciseSnapshot.muscleGroup
                    ]
                  }{" "}
                  ·{" "}
                  {item.exerciseReference.source === "default"
                    ? "Padrão"
                    : "Personalizado"}
                </ItemDescription>

                {!current && (
                  <Badge className="mt-2 self-start" variant="secondary">
                    Indisponível
                  </Badge>
                )}
              </ItemContent>
            </button>
          </CollapsibleTrigger>

          <CollapsibleTrigger asChild>
            <button
              aria-label={`${isOpen ? "Ocultar" : "Exibir"} detalhes do exercício ${current?.name ?? item.exerciseSnapshot.name}`}
              className="group col-start-3 row-span-2 row-start-1 flex size-8 shrink-0 self-center items-center justify-center rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring sm:col-auto sm:row-auto"
              type="button"
            >
              <ChevronDownIcon
                aria-hidden="true"
                className="size-4 transition-transform group-aria-expanded:rotate-180"
              />
            </button>
          </CollapsibleTrigger>

          <ItemActions className="col-start-2 justify-start gap-1 sm:ml-auto sm:w-auto sm:justify-end">
            <Button
              aria-label="Substituir exercício"
              onClick={onReplace}
              size="icon-sm"
              type="button"
              variant="ghost"
            >
              <RepeatIcon />
            </Button>

            <Button
              aria-label="Mover exercício para cima"
              disabled={exerciseIndex === 0}
              onClick={onUp}
              size="icon-sm"
              type="button"
              variant="ghost"
            >
              <ArrowUpIcon />
            </Button>

            <Button
              aria-label="Mover exercício para baixo"
              disabled={exerciseIndex === total - 1}
              onClick={onDown}
              size="icon-sm"
              type="button"
              variant="ghost"
            >
              <ArrowDownIcon />
            </Button>

            <Button
              aria-label="Remover exercício"
              onClick={onRemove}
              size="icon-sm"
              type="button"
              variant="destructive"
            >
              <Trash2Icon />
            </Button>
          </ItemActions>
        </ItemHeader>

        <CollapsibleContent className="basis-full">
          <div className="px-4 pt-2">
            <WorkoutReviewMessages path={path} />
          </div>
          <div className="grid min-w-0 gap-4 px-4 py-4 sm:grid-cols-2 *:min-w-0">
            <Field>
              <FieldLabel htmlFor={`sets-${dayIndex}-${exerciseIndex}`}>Séries</FieldLabel>

              <Input
                id={`sets-${dayIndex}-${exerciseIndex}`}
                inputMode="numeric"
                min={1}
                placeholder="3"
                step={1}
                type="number"
                {...register(`days.${dayIndex}.exercises.${exerciseIndex}.sets`, {
                  valueAsNumber: true,
                })}
              />

              {!hasReviewError("sets") && (
                <FieldError
                  errors={[errors.days?.[dayIndex]?.exercises?.[exerciseIndex]?.sets]}
                />
              )}
              <WorkoutReviewMessages path={[...path, "sets"]} />
            </Field>

            <Field>
              <FieldLabel htmlFor={`reps-${dayIndex}-${exerciseIndex}`}>
                Repetições
              </FieldLabel>

              <Input
                id={`reps-${dayIndex}-${exerciseIndex}`}
                placeholder="8-12"
                type="text"
                {...register(`days.${dayIndex}.exercises.${exerciseIndex}.repetitions`)}
              />

              {!hasReviewError("repetitions") && (
                <FieldError
                  errors={[
                    errors.days?.[dayIndex]?.exercises?.[exerciseIndex]?.repetitions,
                  ]}
                />
              )}
              <WorkoutReviewMessages path={[...path, "repetitions"]} />
            </Field>

            <Field>
              <FieldLabel htmlFor={`load-${dayIndex}-${exerciseIndex}`}>Carga</FieldLabel>

              <Input
                id={`load-${dayIndex}-${exerciseIndex}`}
                inputMode="decimal"
                min={0}
                placeholder="20,00"
                step={0.01}
                type="number"
                {...initialLoad.field}
                onChange={event =>
                  initialLoad.field.onChange(
                    event.target.value === "" ? Number.NaN : Number(event.target.value)
                  )
                }
                value={
                  Number.isFinite(initialLoad.field.value) ? initialLoad.field.value : ""
                }
              />

              <FieldError
                errors={[errors.days?.[dayIndex]?.exercises?.[exerciseIndex]?.initialLoad]}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor={`restSeconds-${dayIndex}-${exerciseIndex}`}>
                Descanso
              </FieldLabel>
              <Input
                id={`restSeconds-${dayIndex}-${exerciseIndex}`}
                inputMode="numeric"
                placeholder={review ? "Obrigatório" : "Opcional"}
                step="any"
                type="number"
                {...register(`days.${dayIndex}.exercises.${exerciseIndex}.restSeconds`, {
                  setValueAs: value => (value === "" ? undefined : Number(value)),
                })}
              />
              {!hasReviewError("restSeconds") && (
                <FieldError
                  errors={[
                    errors.days?.[dayIndex]?.exercises?.[exerciseIndex]?.restSeconds,
                  ]}
                />
              )}
              <WorkoutReviewMessages path={[...path, "restSeconds"]} />
            </Field>
          </div>
        </CollapsibleContent>
      </Item>
    </Collapsible>
  )
}
