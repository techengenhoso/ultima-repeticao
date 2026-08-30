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
import z from "zod"
import { Button } from "@/components/ui/button"
import { DialogFooter } from "@/components/ui/dialog"
import { type Exercise, type ExerciseInput } from "@/lib/exercises/types"
import { difficulties, muscleGroups, muscles } from "@/lib/options-select"
import {
  difficultiesSchema,
  muscleGroupSchema,
  primaryMusclesSchema,
  secondaryMusclesSchema,
  textLongSchema,
  textSchema,
} from "@/lib/schemas-zod"
import { LongTextField } from "../long-text-field"
import { MultiSelectField } from "../multi-select-field"
import { SelectField } from "../select-field"
import { TextField } from "../text-field"

const exerciseSchema = z
  .object({
    name: textSchema,
    muscleGroup: muscleGroupSchema,
    primaryMuscles: primaryMusclesSchema,
    secondaryMuscles: secondaryMusclesSchema,
    difficulty: difficultiesSchema,
    movementPattern: textSchema,
    startingPosition: textLongSchema,
    movementExecution: textLongSchema,
    importantCautions: textLongSchema,
  })
  .refine(
    values =>
      !values.secondaryMuscles.some(secondary =>
        values.primaryMuscles.includes(secondary)
      ),
    {
      message: "Um músculo principal não pode ser selecionado como secundário",
      path: ["secondaryMuscles"],
    }
  )

type ExerciseFormValues = z.infer<typeof exerciseSchema>

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
    defaultValues: {
      name: "",
      muscleGroup: "",
      primaryMuscles: [],
      secondaryMuscles: [],
      difficulty: "",
      movementPattern: "",
      startingPosition: "",
      movementExecution: "",
      importantCautions: "",
    },
  })

  useEffect(() => {
    reset({
      name: exercise?.name ?? "",
      muscleGroup: exercise?.muscleGroup ?? "",
      primaryMuscles: exercise?.primaryMuscles ?? [],
      secondaryMuscles: exercise?.secondaryMuscles ?? [],
      difficulty: exercise?.difficulty ?? "",
      movementPattern: exercise?.movementPattern ?? "",
      startingPosition: exercise?.startingPosition ?? "",
      movementExecution: exercise?.movementExecution ?? "",
      importantCautions: exercise?.importantCautions ?? "",
    })
  }, [exercise, reset])

  async function handleValidSubmit(values: ExerciseFormValues) {
    if (!values.muscleGroup || !values.difficulty) return

    await onSubmit({
      ...values,
      muscleGroup: values.muscleGroup,
      difficulty: values.difficulty,
    })
  }

  return (
    <form className="flex flex-col min-h-0" onSubmit={handleSubmit(handleValidSubmit)}>
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
              id="muscleGroup"
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
              options={muscles}
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
              options={muscles}
              value={field.value}
            />
          )}
        />

        <Controller
          control={control}
          name="difficulty"
          render={({ field, fieldState }) => (
            <SelectField
              error={fieldState.error}
              icon={<GaugeIcon aria-hidden="true" />}
              id="difficulty"
              label="Dificuldade"
              onChange={field.onChange}
              options={[...difficulties]}
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
          id="startingPosition"
          label="Posição inicial"
          {...register("startingPosition")}
        />

        <LongTextField
          error={errors.movementExecution}
          icon={<ListChecksIcon aria-hidden="true" />}
          id="movementExecution"
          label="Execução do movimento"
          {...register("movementExecution")}
        />

        <LongTextField
          error={errors.importantCautions}
          icon={<TriangleAlertIcon aria-hidden="true" />}
          id="importantCautions"
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
