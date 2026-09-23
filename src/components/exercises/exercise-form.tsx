"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { cn } from "cn"
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
import { Controller, useForm } from "react-hook-form"
import z from "zod"
import { Button } from "@/components/ui/button"
import { DialogFooter } from "@/components/ui/dialog"
import { useScrollPadding } from "@/hooks/use-scroll-padding"
import { difficulties, muscleGroups, muscles } from "@/lib/options-select"
import {
  difficultiesSchema,
  muscleGroupSchema,
  primaryMusclesSchema,
  secondaryMusclesSchema,
  textSchema,
} from "@/lib/schemas-zod"
import type { Exercise, ExerciseInput } from "@/modules/exercises/domain/exercise"
import { normalizeExerciseFields } from "@/modules/exercises/domain/normalization"
import { LongTextField } from "../long-text-field"
import { MultiSelectField } from "../multi-select-field"
import { SelectField } from "../select-field"
import { TextField } from "../text-field"

const optionalTextSchema = z.string().trim().max(100, "Deve ter no máximo 100 caracteres")
const optionalLongTextSchema = z
  .string()
  .trim()
  .max(1000, "Deve ter no máximo 1000 caracteres")

const exerciseSchema = z
  .object({
    name: textSchema,
    muscleGroup: muscleGroupSchema,
    primaryMuscles: primaryMusclesSchema,
    secondaryMuscles: secondaryMusclesSchema,
    difficulty: difficultiesSchema,
    movementPattern: optionalTextSchema,
    startingPosition: optionalLongTextSchema,
    movementExecution: optionalLongTextSchema,
    importantCautions: optionalLongTextSchema,
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

const emptyExerciseValues: ExerciseFormValues = {
  name: "",
  muscleGroup: "",
  primaryMuscles: [],
  secondaryMuscles: [],
  difficulty: "",
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
  const { hasVerticalOverflow, ref: scrollRef } = useScrollPadding()
  const initialValues = exercise
    ? normalizeExerciseFields({ ...exercise })
    : emptyExerciseValues
  const {
    control,
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<ExerciseFormValues>({
    resolver: zodResolver(exerciseSchema),
    defaultValues: initialValues,
  })

  async function handleValidSubmit(values: ExerciseFormValues) {
    if (!values.muscleGroup || !values.difficulty) return

    await onSubmit({
      ...values,
      muscleGroup: values.muscleGroup,
      difficulty: values.difficulty,
    })
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit(handleValidSubmit)}>
      <div
        className={cn(
          "max-h-[calc(100dvh-15rem)] overflow-y-auto overscroll-contain",
          hasVerticalOverflow && "pr-3"
        )}
        ref={scrollRef}
      >
        <fieldset className="grid content-start gap-5" disabled={isSubmitting}>
          <div>
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
          </div>

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

          <div>
            <TextField
              error={errors.movementPattern}
              icon={<ActivityIcon aria-hidden="true" />}
              id="movementPattern"
              label="Padrão de movimento"
              placeholder="Informe o movimento"
              {...register("movementPattern")}
            />
          </div>

          <div>
            <LongTextField
              error={errors.startingPosition}
              icon={<MapPinIcon aria-hidden="true" />}
              id="startingPosition"
              label="Posição inicial"
              placeholder="Descreva a posição inicial"
              {...register("startingPosition")}
            />
          </div>

          <div>
            <LongTextField
              error={errors.movementExecution}
              icon={<ListChecksIcon aria-hidden="true" />}
              id="movementExecution"
              label="Execução do movimento"
              placeholder="Descreva como executar o movimento"
              {...register("movementExecution")}
            />
          </div>

          <div>
            <LongTextField
              error={errors.importantCautions}
              icon={<TriangleAlertIcon aria-hidden="true" />}
              id="importantCautions"
              label="Cuidados importantes"
              placeholder="Informe os cuidados necessários"
              {...register("importantCautions")}
            />
          </div>
        </fieldset>
      </div>

      <DialogFooter className="border-t pt-4">
        <Button
          disabled={isSubmitting}
          onClick={onCancel}
          type="button"
          variant="secondary"
        >
          Cancelar
        </Button>

        <Button disabled={isSubmitting} type="submit">
          {isSubmitting && <LoaderCircleIcon className="animate-spin" />}
          {isSubmitting ? "Salvando" : exercise ? "Salvar" : "Criar"}
        </Button>
      </DialogFooter>
    </form>
  )
}
