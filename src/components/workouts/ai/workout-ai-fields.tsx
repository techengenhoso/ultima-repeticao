"use client"

import {
  BicepsFlexedIcon,
  ClockIcon,
  DumbbellIcon,
  GaugeIcon,
  TargetIcon,
} from "lucide-react"
import { Controller, useFormContext } from "react-hook-form"
import { MultiSelectField } from "@/components/multi-select-field"
import { SelectField } from "@/components/select-field"
import { TextField } from "@/components/text-field"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import type { Exercise } from "@/lib/exercises/types"
import { experiences, goals, muscleGroups } from "@/lib/options-select"
import { type AiWorkoutInput, safetyQuestions } from "@/lib/workouts/ai/schemas"

function selectionError(error: unknown): { message: string } | undefined {
  if (!error || typeof error !== "object") return undefined
  if ("message" in error && typeof error.message === "string")
    return { message: error.message }
  if ("root" in error) {
    const root = selectionError(error.root)
    if (root) return root
  }
  if (Array.isArray(error)) {
    for (const item of error) {
      const nested = selectionError(item)
      if (nested) return nested
    }
  }
  return undefined
}

export function WorkoutAiBasics() {
  const {
    register,
    control,
    formState: { errors, isSubmitting },
  } = useFormContext<AiWorkoutInput>()

  return (
    <div className="grid min-w-0 gap-5 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <TextField
          error={errors.name}
          icon={<DumbbellIcon />}
          id="ai-name"
          label="Nome da ficha"
          maxLength={100}
          placeholder="Ex: Treino de hipertrofia"
          {...register("name")}
        />
      </div>

      <Controller
        control={control}
        name="goal"
        render={({ field }) => (
          <SelectField
            disabled={isSubmitting}
            error={errors.goal}
            icon={<TargetIcon />}
            id="ai-goal"
            label="Objetivo"
            onChange={field.onChange}
            options={goals}
            value={field.value}
          />
        )}
      />

      <Controller
        control={control}
        name="experienceLevel"
        render={({ field }) => (
          <SelectField
            disabled={isSubmitting}
            error={errors.experienceLevel}
            icon={<GaugeIcon />}
            id="ai-experience"
            label="Experiência"
            onChange={field.onChange}
            options={experiences}
            value={field.value}
          />
        )}
      />

      <TextField
        error={errors.daysPerWeek}
        icon={<DumbbellIcon />}
        id="ai-days"
        inputMode="numeric"
        label="Dias por semana"
        placeholder="Ex: 3 (de 2 a 7 dias)"
        step={1}
        type="number"
        {...register("daysPerWeek", { valueAsNumber: true })}
      />

      <TextField
        error={errors.durationMinutes}
        icon={<ClockIcon />}
        id="ai-duration"
        inputMode="numeric"
        label="Minutos por treino"
        placeholder="Ex: 60 (de 20 a 180 minutos)"
        type="number"
        {...register("durationMinutes", { valueAsNumber: true })}
      />
    </div>
  )
}

export function WorkoutAiPreferences({ exercises }: { exercises: Exercise[] }) {
  const {
    control,
    formState: { errors, isSubmitting },
  } = useFormContext<AiWorkoutInput>()

  const exerciseOptions = exercises.map(exercise => ({
    label: `${exercise.name} (${exercise.source === "default" ? "Padrão" : "Personalizado"})`,
    value: `${exercise.source}:${exercise.id}`,
  }))

  const movementOptions = [...new Set(exercises.map(exercise => exercise.movementPattern))]
    .sort((a, b) => a.localeCompare(b, "pt-BR"))
    .map(pattern => ({ label: pattern, value: pattern }))

  return (
    <div className="grid min-w-0 gap-5">
      {(["priorityMuscleGroups", "excludedMuscleGroups"] as const).map(name => (
        <Controller
          control={control}
          key={name}
          name={name}
          render={({ field }) => (
            <MultiSelectField
              disabled={isSubmitting}
              error={selectionError(errors[name])}
              icon={<BicepsFlexedIcon />}
              id={`ai-${name}`}
              label={
                name === "priorityMuscleGroups"
                  ? "Grupos musculares prioritários"
                  : "Grupos musculares a excluir"
              }
              onChange={field.onChange}
              options={muscleGroups}
              value={field.value}
            />
          )}
        />
      ))}

      {(["preferredExercises", "avoidedExercises"] as const).map(name => (
        <Controller
          control={control}
          key={name}
          name={name}
          render={({ field }) => (
            <MultiSelectField
              disabled={isSubmitting}
              error={selectionError(errors[name])}
              icon={<DumbbellIcon />}
              id={`ai-${name}`}
              label={
                name === "preferredExercises"
                  ? "Exercícios preferidos"
                  : "Exercícios a evitar"
              }
              onChange={field.onChange}
              options={exerciseOptions}
              value={field.value}
            />
          )}
        />
      ))}

      <Controller
        control={control}
        name="excludedMovementPatterns"
        render={({ field }) => (
          <MultiSelectField
            disabled={isSubmitting}
            error={selectionError(errors.excludedMovementPatterns)}
            icon={<DumbbellIcon />}
            id="ai-movements"
            label="Movimentos que você não pode realizar"
            onChange={field.onChange}
            options={movementOptions}
            value={field.value}
          />
        )}
      />
    </div>
  )
}

export function WorkoutAiSafety() {
  const {
    control,
    formState: { errors, isSubmitting },
  } = useFormContext<AiWorkoutInput>()

  return (
    <div className="space-y-5">
      <fieldset className="space-y-3">
        <legend className="mb-3 font-medium">
          Marque todas as situações que se aplicam a você
        </legend>

        <Controller
          control={control}
          name="safetyFlags"
          render={({ field }) => (
            <div className="space-y-4">
              {safetyQuestions.map(question => (
                <div className="flex items-start gap-3" key={question.value}>
                  <Checkbox
                    checked={field.value.includes(question.value)}
                    disabled={isSubmitting}
                    id={`ai-${question.value}`}
                    onCheckedChange={checked =>
                      field.onChange(
                        checked
                          ? [...field.value, question.value]
                          : field.value.filter(value => value !== question.value)
                      )
                    }
                  />

                  <FieldLabel
                    className="block min-w-0 text-sm leading-5"
                    htmlFor={`ai-${question.value}`}
                  >
                    {question.label}
                  </FieldLabel>
                </div>
              ))}
            </div>
          )}
        />
      </fieldset>

      <fieldset className="mt-8 space-y-3">
        <legend className="mb-3 font-medium">
          Leia e confirme a informação de segurança
        </legend>

        <Controller
          control={control}
          name="safetyConfirmed"
          render={({ field }) => (
            <Field>
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={field.value}
                  disabled={isSubmitting}
                  id="ai-confirm"
                  onCheckedChange={value => field.onChange(value === true)}
                />

                <FieldLabel
                  className="block min-w-0 text-sm leading-5"
                  htmlFor="ai-confirm"
                >
                  Revisei todas as situações acima e informei as que se aplicam a mim;
                  entendo que o assistente não avalia nem trata condições de saúde
                </FieldLabel>
              </div>

              <FieldError errors={[errors.safetyConfirmed]} />
            </Field>
          )}
        />
      </fieldset>
    </div>
  )
}
