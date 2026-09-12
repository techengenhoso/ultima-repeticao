"use client"

import { ArrowLeftIcon, CheckIcon } from "lucide-react"
import { useState } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import type { SessionFormValues } from "@/modules/sessions/domain/session"

function WorkSetNavigator({
  editingSetIndex,
  nextWorkSetIndex,
  onSelect,
  sets,
  workSetIndexes,
}: {
  editingSetIndex: number | null
  nextWorkSetIndex: number
  onSelect: (setIndex: number) => void
  sets: SessionFormValues["exercises"][number]["sets"]
  workSetIndexes: number[]
}) {
  return (
    <fieldset className="flex flex-wrap gap-2">
      <legend className="sr-only">Sequência de séries</legend>
      {workSetIndexes.map(setIndex => {
        const set = sets[setIndex]
        const isSelected = setIndex === (editingSetIndex ?? nextWorkSetIndex)
        return (
          <Button
            aria-current={isSelected ? "step" : undefined}
            aria-label={`Série ${set.setNumber}`}
            disabled={!set.completed && !isSelected}
            key={set.setNumber}
            onClick={() => onSelect(setIndex)}
            size="xs"
            type="button"
            variant={isSelected ? "default" : set.completed ? "secondary" : "outline"}
          >
            {set.completed && <CheckIcon aria-hidden="true" />}
            Série {set.setNumber}
          </Button>
        )
      })}
    </fieldset>
  )
}

function RirFeedback({
  perceivedRir,
  targetRir,
}: {
  perceivedRir?: number
  targetRir?: number
}) {
  if (perceivedRir === undefined || targetRir === undefined) return null
  return (
    <p className="text-sm text-muted-foreground">
      {perceivedRir < targetRir
        ? "Esforço acima do desejado: RIR menor que a meta"
        : "RIR igual ou acima da meta"}
    </p>
  )
}

export function SessionExerciseForm({
  index,
  onBack,
  onWorkSetsCompleted,
  onSeriesCompleted,
  totalExercises,
}: {
  index: number
  onBack: () => void
  onWorkSetsCompleted: () => void
  onSeriesCompleted: (restSeconds?: number) => void
  totalExercises: number
}) {
  const {
    register,
    control,
    setValue,
    getValues,
    trigger,
    formState: { errors },
  } = useFormContext<SessionFormValues>()
  const exercise = useWatch({ control, name: `exercises.${index}` })
  const [editingSetIndex, setEditingSetIndex] = useState<number | null>(null)
  const nextWorkSetIndex = exercise.sets.findIndex(set => !set.warmup && !set.completed)
  const selectedSetIndex = editingSetIndex ?? nextWorkSetIndex
  const selectedSet = selectedSetIndex === -1 ? undefined : exercise.sets[selectedSetIndex]
  const selectedSetErrors =
    selectedSetIndex === -1
      ? undefined
      : errors.exercises?.[index]?.sets?.[selectedSetIndex]
  const workSetIndexes = exercise.sets
    .map((set, setIndex) => (!set.warmup ? setIndex : null))
    .filter((setIndex): setIndex is number => setIndex !== null)

  function selectSet(setIndex: number) {
    setEditingSetIndex(setIndex === nextWorkSetIndex ? null : setIndex)
  }

  function handleCompletedChange(setIndex: number, completed: boolean) {
    const prefix = `exercises.${index}.sets.${setIndex}` as const
    setValue(`${prefix}.completed`, completed, {
      shouldDirty: true,
      shouldValidate: true,
    })
    if (!completed) return
    if (setIndex !== nextWorkSetIndex) {
      void trigger(prefix).then(valid => {
        if (!valid) return
        const nextSetIndex = workSetIndexes.find(
          candidate => candidate > setIndex && !exercise.sets[candidate].completed
        )
        if (nextSetIndex !== undefined) {
          setEditingSetIndex(nextSetIndex === nextWorkSetIndex ? null : nextSetIndex)
          return
        }
        onWorkSetsCompleted()
      })
      return
    }
    void trigger(prefix).then(valid => {
      if (!valid) return
      onSeriesCompleted(exercise.restSeconds)
      const nextSetIndex = workSetIndexes.find(
        candidate => candidate > setIndex && !exercise.sets[candidate].completed
      )
      if (nextSetIndex !== undefined) {
        setValue(
          `exercises.${index}.sets.${nextSetIndex}.performedRepetitions`,
          getValues(`${prefix}.performedRepetitions`),
          { shouldDirty: true, shouldValidate: true }
        )
        setEditingSetIndex(null)
        return
      }
      onWorkSetsCompleted()
    })
  }

  return (
    <section aria-label={exercise.exerciseSnapshot.name} className="min-w-0 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Button onClick={onBack} size="sm" type="button" variant="ghost">
          <ArrowLeftIcon aria-hidden="true" />
          Todos os exercícios
        </Button>
        <span className="text-xs font-medium text-muted-foreground">
          Exercício {index + 1} de {totalExercises}
        </span>
      </div>

      <div className="border border-border border-l-2 border-l-primary bg-card">
        <div className="flex items-center gap-3 p-4">
          <h2 className="min-w-0 wrap-break-word text-lg font-semibold">
            {exercise.exerciseSnapshot.name}
          </h2>
          {exercise.painReported && (
            <p className="ml-auto text-xs text-destructive" role="alert">
              Dor relatada
            </p>
          )}
        </div>

        <div className="space-y-5 border-t border-border p-4">
          <WorkSetNavigator
            editingSetIndex={editingSetIndex}
            nextWorkSetIndex={nextWorkSetIndex}
            onSelect={selectSet}
            sets={exercise.sets}
            workSetIndexes={workSetIndexes}
          />

          {selectedSet ? (
            <div className="space-y-4">
              <div className="grid min-w-0 gap-3 sm:grid-cols-3">
                <Field>
                  <FieldLabel htmlFor={`exercises.${index}.sets.${selectedSetIndex}-load`}>
                    Carga
                  </FieldLabel>
                  <Input
                    id={`exercises.${index}.sets.${selectedSetIndex}-load`}
                    inputMode="decimal"
                    max={1000}
                    min={0}
                    step={0.01}
                    type="number"
                    {...register(`exercises.${index}.sets.${selectedSetIndex}.load`, {
                      valueAsNumber: true,
                    })}
                  />
                  <FieldError errors={[selectedSetErrors?.load]} />
                </Field>
                <Field>
                  <FieldLabel
                    htmlFor={`exercises.${index}.sets.${selectedSetIndex}-repetitions`}
                  >
                    Repetições
                  </FieldLabel>
                  <Input
                    id={`exercises.${index}.sets.${selectedSetIndex}-repetitions`}
                    inputMode="numeric"
                    max={100}
                    min={0}
                    step={1}
                    type="number"
                    {...register(
                      `exercises.${index}.sets.${selectedSetIndex}.performedRepetitions`,
                      {
                        setValueAs: value => (value === "" ? undefined : Number(value)),
                      }
                    )}
                  />
                  <FieldError errors={[selectedSetErrors?.performedRepetitions]} />
                </Field>
                <Field>
                  <FieldLabel htmlFor={`exercises.${index}.sets.${selectedSetIndex}-rir`}>
                    RIR percebido
                  </FieldLabel>
                  <Input
                    id={`exercises.${index}.sets.${selectedSetIndex}-rir`}
                    inputMode="numeric"
                    max={5}
                    min={0}
                    placeholder="Opcional"
                    step={1}
                    type="number"
                    {...register(
                      `exercises.${index}.sets.${selectedSetIndex}.perceivedRir`,
                      {
                        setValueAs: value => (value === "" ? undefined : Number(value)),
                      }
                    )}
                  />
                  <FieldError errors={[selectedSetErrors?.perceivedRir]} />
                </Field>
              </div>
              <RirFeedback
                perceivedRir={selectedSet.perceivedRir}
                targetRir={exercise.targetRir}
              />
              <div className="flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-start">
                <Button
                  aria-pressed={selectedSet.completed}
                  className="sm:order-2 sm:ml-auto"
                  onClick={() => handleCompletedChange(selectedSetIndex, true)}
                  size="sm"
                  type="button"
                  variant={selectedSet.completed ? "secondary" : "default"}
                >
                  {selectedSet.completed ? "Atualizar série" : "Concluir série"}
                </Button>

                <FieldDescription className="sm:order-1">
                  <strong>RIR percebido</strong> é a estimativa de quantas repetições ainda
                  seriam possíveis ao fim da série
                </FieldDescription>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 bg-muted/40 p-4">
              <CheckIcon aria-hidden="true" className="size-5 text-primary" />
              <div>
                <h3 className="font-semibold">Exercício concluído</h3>
                <p className="text-sm text-muted-foreground">
                  Você pode voltar à lista ou revisar uma série acima
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
