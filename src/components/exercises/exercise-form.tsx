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
import { Controller, useForm } from "react-hook-form"
import z from "zod"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { DialogFooter } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { difficulties, muscleGroups, muscles } from "@/lib/options-select"
import {
  difficultiesSchema,
  muscleGroupSchema,
  primaryMusclesSchema,
  secondaryMusclesSchema,
  textSchema,
} from "@/lib/schemas-zod"
import type { Exercise, ExerciseInput } from "@/modules/exercises/domain/exercise"
import { ComboboxField } from "../combobox-field"
import { LongTextField } from "../long-text-field"
import { MultiSelectField } from "../multi-select-field"
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
  const initialValues: ExerciseFormValues = exercise
    ? {
        name: exercise.name,
        muscleGroup: exercise.muscleGroup,
        primaryMuscles: exercise.primaryMuscles,
        secondaryMuscles: exercise.secondaryMuscles,
        difficulty: exercise.difficulty,
        movementPattern: exercise.movementPattern,
        startingPosition: exercise.startingPosition,
        movementExecution: exercise.movementExecution,
        importantCautions: exercise.importantCautions,
      }
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

  const sections = [
    {
      content: (
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
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
              <ComboboxField
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
            name="difficulty"
            render={({ field, fieldState }) => (
              <ComboboxField
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
        </div>
      ),
      detailCount: "5 informações",
      key: "general",
      label: "Informações gerais",
    },
    {
      content: (
        <div className="grid gap-5">
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
            placeholder="Descreva a posição inicial"
            {...register("startingPosition")}
          />

          <LongTextField
            error={errors.movementExecution}
            icon={<ListChecksIcon aria-hidden="true" />}
            id="movementExecution"
            label="Execução do movimento"
            placeholder="Descreva como executar o movimento"
            {...register("movementExecution")}
          />
        </div>
      ),
      detailCount: "3 instruções",
      key: "movement",
      label: "Movimento",
    },
    {
      content: (
        <LongTextField
          error={errors.importantCautions}
          icon={<TriangleAlertIcon aria-hidden="true" />}
          id="importantCautions"
          label="Cuidados importantes"
          placeholder="Informe os cuidados necessários"
          {...register("importantCautions")}
        />
      ),
      detailCount: "1 orientação",
      key: "cautions",
      label: "Cuidados",
    },
  ]

  return (
    <form className="space-y-5" onSubmit={handleSubmit(handleValidSubmit)}>
      <fieldset disabled={isSubmitting}>
        <Accordion collapsible defaultValue="general" type="single">
          {sections.map((section, index) => (
            <AccordionItem
              className="data-open:bg-card"
              key={section.key}
              value={section.key}
            >
              <AccordionTrigger className="items-center bg-muted/50 px-4 py-4 hover:bg-muted hover:no-underline aria-expanded:bg-muted">
                <span className="flex min-w-0 items-center gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground">
                    {index + 1}
                  </span>
                  <span className="flex min-w-0 flex-col gap-0.5">
                    <span>{section.label}</span>
                    <span className="text-xs font-normal text-muted-foreground">
                      {section.detailCount}
                    </span>
                  </span>
                </span>
              </AccordionTrigger>

              <AccordionContent className="h-auto pt-4">
                <ScrollArea className="h-fit max-h-[min(24rem,calc(100dvh-24rem))] [&_[data-slot=scroll-area-viewport]]:max-h-[inherit]">
                  {section.content}
                </ScrollArea>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </fieldset>

      <DialogFooter className="grid shrink-0 grid-cols-2 gap-2 sm:grid sm:grid-cols-2">
        <Button
          className="w-full"
          disabled={isSubmitting}
          onClick={onCancel}
          type="button"
          variant="secondary"
        >
          Cancelar
        </Button>

        <Button className="w-full" disabled={isSubmitting} type="submit">
          {isSubmitting && <LoaderCircleIcon className="animate-spin" />}
          {isSubmitting ? "Salvando" : exercise ? "Alterar" : "Criar"}
        </Button>
      </DialogFooter>
    </form>
  )
}
