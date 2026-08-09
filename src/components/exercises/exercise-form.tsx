"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import {
  ActivityIcon,
  BicepsFlexedIcon,
  DumbbellIcon,
  GaugeIcon,
  ListChecksIcon,
  LoaderCircleIcon,
  MapPinIcon,
  TriangleAlertIcon,
  TrophyIcon,
} from "lucide-react"
import { useEffect } from "react"
import { Controller, useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { DialogFooter } from "@/components/ui/dialog"
import { type ExerciseFormValues, exerciseSchema } from "@/lib/exercises/schema"
import { muscleOptions } from "@/lib/exercises/system-exercises"
import {
  type Exercise,
  type ExerciseInput,
  exerciseLevels,
  muscleGroups,
} from "@/lib/exercises/types"
import { LongTextField } from "../long-text-field"
import { MultiSelectField } from "../multi-select-field"
import { SelectField } from "../select-field"
import { TextField } from "../text-field"

const emptyValues: ExerciseFormValues = {
  name: "",
  muscleGroup: "",
  primaryMuscles: [],
  secondaryMuscles: [],
  level: "",
  movementPattern: "",
  startingPosition: "",
  movementExecution: "",
  importantCautions: "",
}

interface Props {
  exercise?: Exercise | null
  onCancel: () => void
  onSubmit: (values: ExerciseInput) => Promise<void>
}

export function ExerciseForm({ exercise, onCancel, onSubmit }: Props) {
  const {
    control,
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ExerciseFormValues>({
    resolver: zodResolver(exerciseSchema),
    defaultValues: emptyValues,
  })

  useEffect(() => {
    reset(
      exercise
        ? {
            name: exercise.name,
            muscleGroup: exercise.muscleGroup,
            primaryMuscles: exercise.primaryMuscles,
            secondaryMuscles: exercise.secondaryMuscles,
            level: exercise.level,
            movementPattern: exercise.movementPattern,
            startingPosition: exercise.startingPosition,
            movementExecution: exercise.movementExecution,
            importantCautions: exercise.importantCautions,
          }
        : emptyValues
    )
  }, [exercise, reset])

  return (
    <form className="flex flex-col min-h-0" onSubmit={handleSubmit(onSubmit)}>
      <div className="no-scrollbar max-h-[65vh] space-y-5 overflow-y-auto pb-5">
        <TextField
          autoComplete="name"
          error={errors.name}
          icon={<TrophyIcon aria-hidden="true" />}
          id="name"
          label="Nome do exercício"
          placeholder="Digite o nome"
          type="text"
          {...register("name")}
        />

        <Controller
          control={control}
          name="muscleGroup"
          render={({ field, fieldState }) => (
            <SelectField
              error={fieldState.error}
              icon={<DumbbellIcon aria-hidden="true" />}
              id="muscle-group"
              label="Grupo muscular"
              onChange={field.onChange}
              options={muscleGroups}
              value={field.value}
            />
          )}
        />

        <Controller
          control={control}
          name="primaryMuscles"
          render={({ field, fieldState }) => (
            <MultiSelectField
              error={fieldState.error}
              icon={<BicepsFlexedIcon aria-hidden="true" />}
              id="primaryMuscles"
              label="Músculos principais"
              onChange={field.onChange}
              options={muscleOptions}
              value={field.value}
            />
          )}
        />

        <Controller
          control={control}
          name="secondaryMuscles"
          render={({ field, fieldState }) => (
            <MultiSelectField
              error={fieldState.error}
              icon={<BicepsFlexedIcon aria-hidden="true" />}
              id="secondaryMuscles"
              label="Músculos secundários"
              onChange={field.onChange}
              options={muscleOptions}
              value={field.value}
            />
          )}
        />

        <Controller
          control={control}
          name="level"
          render={({ field, fieldState }) => (
            <SelectField
              error={fieldState.error}
              icon={<GaugeIcon aria-hidden="true" />}
              id="level"
              label="Nível"
              onChange={field.onChange}
              options={[...exerciseLevels]}
              value={field.value}
            />
          )}
        />

        <TextField
          error={errors.movementPattern}
          icon={<ActivityIcon aria-hidden="true" />}
          id="movementPattern"
          label="Padrão de movimento"
          placeholder="Informe o movimento"
          {...register("movementPattern")}
        />

        <LongTextField
          error={errors.startingPosition}
          icon={<MapPinIcon aria-hidden="true" />}
          id="starting-position"
          label="Posição inicial"
          {...register("startingPosition")}
        />

        <LongTextField
          error={errors.movementExecution}
          icon={<ListChecksIcon aria-hidden="true" />}
          id="movement-execution"
          label="Execução do movimento"
          {...register("movementExecution")}
        />

        <LongTextField
          error={errors.importantCautions}
          icon={<TriangleAlertIcon aria-hidden="true" />}
          id="important-cautions"
          label="Cuidados importantes"
          {...register("importantCautions")}
        />
      </div>

      <DialogFooter className="border-t pt-5">
        <Button disabled={isSubmitting} onClick={onCancel} type="button" variant="outline">
          Cancelar
        </Button>

        <Button disabled={isSubmitting} type="submit">
          {isSubmitting && <LoaderCircleIcon className="animate-spin" />}
          {isSubmitting ? "Salvando" : exercise ? "Salvar alterações" : "Criar exercício"}
        </Button>
      </DialogFooter>
    </form>
  )
}
