"use client"

import { ArrowDownIcon, ArrowUpIcon, DumbbellIcon, Trash2Icon } from "lucide-react"
import { useFormContext } from "react-hook-form"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { type Exercise, muscleGroupLabel } from "@/lib/exercises/types"
import type { WorkoutFormValues } from "@/lib/workouts/types"

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

  const item = getValues(`days.${dayIndex}.exercises.${exerciseIndex}`)

  const current = exercisesByReference.get(
    `${item.exerciseReference.source}:${item.exerciseReference.exerciseId}`
  )

  return (
    <article className="border bg-background">
      <header className="flex items-center justify-between gap-3 border-b bg-muted/30 p-3">
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

      <div className="grid gap-4 p-4 sm:grid-cols-3">
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
        </Field>

        <Field>
          <FieldLabel htmlFor={`reps-${dayIndex}-${exerciseIndex}`}>Repetições</FieldLabel>

          <Input
            id={`reps-${dayIndex}-${exerciseIndex}`}
            inputMode="numeric"
            min={1}
            placeholder="12"
            step={1}
            type="number"
            {...register(`days.${dayIndex}.exercises.${exerciseIndex}.repetitions`, {
              valueAsNumber: true,
            })}
          />

          <FieldError
            errors={[errors.days?.[dayIndex]?.exercises?.[exerciseIndex]?.repetitions]}
          />
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
      </div>
    </article>
  )
}
