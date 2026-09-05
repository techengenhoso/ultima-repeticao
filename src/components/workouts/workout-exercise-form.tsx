"use client"

import { ArrowDownIcon, ArrowUpIcon, DumbbellIcon, Trash2Icon } from "lucide-react"
import { useFormContext } from "react-hook-form"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { type Exercise, muscleGroupLabel } from "@/lib/exercises/types"
import type { WorkoutFormValues } from "@/lib/workouts/types"

import { useWorkoutReview, WorkoutReviewMessages } from "./ai/workout-review-context"

interface Props {
  dayIndex: number
  exerciseIndex: number
  exercisesByReference: Map<string, Exercise>
  total: number
  onDown: () => void
  onRemove: () => void
  onReplace: () => void
  onUp: () => void
}

export function WorkoutExerciseForm({
  dayIndex,
  exerciseIndex,
  exercisesByReference,
  total,
  onDown,
  onRemove,
  onReplace,
  onUp,
}: Props) {
  const {
    register,
    getValues,
    formState: { errors },
  } = useFormContext<WorkoutFormValues>()

  const review = useWorkoutReview()
  const path = ["days", dayIndex, "exercises", exerciseIndex]
  const item = getValues(`days.${dayIndex}.exercises.${exerciseIndex}`)

  const current = exercisesByReference.get(
    `${item.exerciseReference.source}:${item.exerciseReference.exerciseId}`
  )

  return (
    <article className="min-w-0 border bg-background">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b bg-muted/30 p-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex size-8 shrink-0 items-center justify-center bg-primary text-xs font-bold text-primary-foreground">
            {exerciseIndex + 1}
          </span>

          <div className="min-w-0">
            <p className="wrap-break-word font-semibold">
              {current?.name ?? item.exerciseSnapshot.name}
            </p>

            <p className="text-xs text-muted-foreground">
              {muscleGroupLabel[current?.muscleGroup ?? item.exerciseSnapshot.muscleGroup]}{" "}
              · {item.exerciseReference.source === "default" ? "Padrão" : "Personalizado"}
            </p>

            {!current && (
              <Badge className="mt-2 self-start" variant="secondary">
                Indisponível
              </Badge>
            )}
          </div>
        </div>

        <div className="flex shrink-0 gap-1">
          <Button
            aria-label="Substituir exercício"
            onClick={onReplace}
            size="icon-sm"
            type="button"
            variant="ghost"
          >
            <DumbbellIcon />
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
        </div>
      </header>

      <div className="px-4 pt-2">
        <WorkoutReviewMessages path={path} />
      </div>
      <div className="grid min-w-0 gap-4 p-4 sm:grid-cols-3 *:min-w-0">
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

          <FieldError
            errors={[errors.days?.[dayIndex]?.exercises?.[exerciseIndex]?.sets]}
          />
          <WorkoutReviewMessages path={[...path, "sets"]} />
        </Field>

        <Field>
          <FieldLabel htmlFor={`reps-${dayIndex}-${exerciseIndex}`}>Repetições</FieldLabel>

          <Input
            id={`reps-${dayIndex}-${exerciseIndex}`}
            placeholder="8-12"
            type="text"
            {...register(`days.${dayIndex}.exercises.${exerciseIndex}.repetitions`)}
          />

          <FieldError
            errors={[errors.days?.[dayIndex]?.exercises?.[exerciseIndex]?.repetitions]}
          />
          <WorkoutReviewMessages path={[...path, "repetitions"]} />
        </Field>

        <Field>
          <FieldLabel htmlFor={`load-${dayIndex}-${exerciseIndex}`}>
            Carga inicial
          </FieldLabel>

          <Input
            id={`load-${dayIndex}-${exerciseIndex}`}
            inputMode="decimal"
            min={0}
            placeholder="20,00"
            step={0.01}
            type="number"
            {...register(`days.${dayIndex}.exercises.${exerciseIndex}.initialLoad`, {
              valueAsNumber: true,
            })}
          />

          <FieldError
            errors={[errors.days?.[dayIndex]?.exercises?.[exerciseIndex]?.initialLoad]}
          />
        </Field>
        {(
          [
            { name: "restSeconds", label: "Descanso" },
            { name: "targetRir", label: "RIR desejado" },
          ] as const
        ).map(metric => (
          <Field key={metric.name}>
            <FieldLabel htmlFor={`${metric.name}-${dayIndex}-${exerciseIndex}`}>
              {metric.label}
            </FieldLabel>
            <Input
              id={`${metric.name}-${dayIndex}-${exerciseIndex}`}
              inputMode="numeric"
              placeholder={review ? "Obrigatório" : "Opcional"}
              step={metric.name === "targetRir" ? 1 : "any"}
              type="number"
              {...register(`days.${dayIndex}.exercises.${exerciseIndex}.${metric.name}`, {
                setValueAs: value => (value === "" ? undefined : Number(value)),
              })}
            />
            <FieldError
              errors={[errors.days?.[dayIndex]?.exercises?.[exerciseIndex]?.[metric.name]]}
            />
            <WorkoutReviewMessages path={[...path, metric.name]} />
          </Field>
        ))}
      </div>
    </article>
  )
}
