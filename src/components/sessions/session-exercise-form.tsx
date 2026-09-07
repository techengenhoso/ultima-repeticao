"use client"

import { useFieldArray, useFormContext, useWatch } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import type { SessionFormValues } from "@/modules/sessions/domain/session"
import { RestTimer } from "./rest-timer"

export function SessionExerciseForm({ index }: { index: number }) {
  const {
    register,
    control,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext<SessionFormValues>()
  const exercise = useWatch({ control, name: `exercises.${index}` })
  const sets = useFieldArray({ control, name: `exercises.${index}.sets` })
  const firstLoad = exercise.referenceLoad === undefined && exercise.initialLoad === 0
  return (
    <section
      aria-label={exercise.exerciseSnapshot.name}
      className="min-w-0 space-y-4 border bg-card p-3 sm:p-5"
    >
      <h2 className="wrap-break-word text-lg font-semibold">
        {index + 1} · {exercise.exerciseSnapshot.name}
      </h2>
      <p className="text-sm">
        Meta: {exercise.targetSets} séries de {exercise.targetRepetitions} repetições · RIR{" "}
        {exercise.targetRir ?? "não definido"}
      </p>
      <p className="text-sm text-muted-foreground">
        {firstLoad
          ? "Carga a definir: comece de forma conservadora e informe a carga realmente utilizada"
          : `Referência: ${exercise.referenceLoad ?? exercise.initialLoad} kg · Você pode escolher outra carga`}
      </p>
      <RestTimer seconds={exercise.restSeconds} />
      <div className="flex items-start gap-3">
        <Checkbox
          checked={exercise.painReported}
          id={`pain-${index}`}
          onCheckedChange={value =>
            setValue(`exercises.${index}.painReported`, value === true, {
              shouldDirty: true,
            })
          }
        />
        <label className="text-sm" htmlFor={`pain-${index}`}>
          Senti dor neste exercício
        </label>
      </div>
      {exercise.painReported && (
        <p className="text-sm text-destructive" role="alert">
          Interrompa o exercício em caso de dor aguda e procure orientação profissional ·
          Não será sugerida progressão
        </p>
      )}
      <p className="text-xs text-muted-foreground">
        RIR é o número de repetições que você ainda conseguiria fazer · Opcional,
        recomendado nas séries de trabalho
      </p>
      {sets.fields.map((field, setIndex) => {
        const set = exercise.sets[setIndex]
        const prefix = `exercises.${index}.sets.${setIndex}` as const
        const setErrors = errors.exercises?.[index]?.sets?.[setIndex]
        return (
          <div className="space-y-3 border p-3" key={field.id}>
            <p className="font-medium">
              Série {setIndex + 1}
              {set.warmup ? " · Aquecimento" : " · Trabalho"}
            </p>
            <div className="grid min-w-0 gap-3 sm:grid-cols-3">
              {(
                [
                  { name: "load", label: "Carga (kg)", max: 1000, step: 0.01 },
                  {
                    name: "performedRepetitions",
                    label: "Repetições realizadas",
                    max: 100,
                    step: 1,
                  },
                ] as const
              ).map(metric => (
                <Field key={metric.name}>
                  <FieldLabel htmlFor={`${prefix}-${metric.name}`}>
                    {metric.label}
                  </FieldLabel>
                  <Input
                    id={`${prefix}-${metric.name}`}
                    inputMode={metric.name === "load" ? "decimal" : "numeric"}
                    max={metric.max}
                    min={0}
                    step={metric.step}
                    type="number"
                    {...register(`${prefix}.${metric.name}`, { valueAsNumber: true })}
                  />
                  <FieldError errors={[setErrors?.[metric.name]]} />
                </Field>
              ))}
              <Field>
                <FieldLabel htmlFor={`${prefix}-rir`}>RIR percebido</FieldLabel>
                <Input
                  id={`${prefix}-rir`}
                  inputMode="numeric"
                  max={5}
                  min={0}
                  placeholder="Opcional"
                  step={1}
                  type="number"
                  {...register(`${prefix}.perceivedRir`, {
                    setValueAs: value => (value === "" ? undefined : Number(value)),
                  })}
                />
                <FieldError errors={[setErrors?.perceivedRir]} />
              </Field>
            </div>
            {!set.warmup &&
              set.perceivedRir !== undefined &&
              exercise.targetRir !== undefined && (
                <p className="text-xs text-muted-foreground">
                  {set.perceivedRir < exercise.targetRir
                    ? "Esforço acima do desejado: RIR menor que a meta"
                    : "RIR igual ou acima da meta"}
                </p>
              )}
            <div className="flex flex-wrap items-center gap-3">
              <Checkbox
                checked={set.completed}
                id={`${prefix}-completed`}
                onCheckedChange={value =>
                  setValue(`${prefix}.completed`, value === true, {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
              />
              <label className="text-sm" htmlFor={`${prefix}-completed`}>
                Série concluída
              </label>
              {setIndex > 0 && (
                <Button
                  onClick={() =>
                    setValue(
                      `${prefix}.load`,
                      getValues(`exercises.${index}.sets.${setIndex - 1}.load`),
                      { shouldDirty: true, shouldValidate: true }
                    )
                  }
                  size="sm"
                  type="button"
                  variant="outline"
                >
                  Repetir carga anterior
                </Button>
              )}
            </div>
          </div>
        )
      })}
      <FieldError errors={[errors.exercises?.[index]?.sets?.root]} />
      <Button
        disabled={exercise.sets.filter(set => set.warmup).length >= 5}
        onClick={() =>
          sets.append({
            setNumber: exercise.sets.length + 1,
            targetRepetitions: exercise.targetRepetitions,
            load: 0,
            performedRepetitions: 0,
            completed: false,
            warmup: true,
          })
        }
        type="button"
        variant="outline"
      >
        Adicionar aquecimento
      </Button>
    </section>
  )
}
