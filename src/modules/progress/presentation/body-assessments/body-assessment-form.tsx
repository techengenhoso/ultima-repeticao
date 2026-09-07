"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { CalendarIcon, LoaderCircleIcon, RulerIcon, ScaleIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { type FieldPath, useForm } from "react-hook-form"
import { z } from "zod"
import { TextField } from "@/components/text-field"
import { Button } from "@/components/ui/button"
import { DialogFooter } from "@/components/ui/dialog"
import {
  formatBrazilianDateInput,
  formatIsoDateToBrazilian,
  parseBrazilianDate,
} from "@/lib/date"
import { dateSchema } from "@/lib/schemas-zod"
import {
  assessmentInputSchema,
  type BodyAssessment,
  type BodyAssessmentInput,
} from "@/modules/body-assessments/domain/body-assessment"
import {
  type AssessmentGroup,
  assessmentFields,
  groups,
} from "@/modules/body-assessments/presentation/fields"
import { useProgressUseCases } from "../progress-use-cases-context"

type FormValues = {
  assessmentDate: string
  values: Record<string, Record<string, string>>
}
const number = (value: string) =>
  value.trim() === "" ? null : Number(value.replace(",", "."))
const fieldValue = (values: FormValues, group: AssessmentGroup, key: string) =>
  values.values[group]?.[key] ?? ""
const emptyValues = (item?: BodyAssessment): FormValues => ({
  assessmentDate: item ? formatIsoDateToBrazilian(item.assessmentDate) : "",
  values: Object.fromEntries(
    groups.map(group => [
      group.key,
      Object.fromEntries(
        assessmentFields
          .filter(field => field.group === group.key)
          .map(field => [
            field.key,
            item ? String(item[group.key][field.key as never] ?? "") : "",
          ])
      ),
    ])
  ),
})
const inputFrom = (values: FormValues): BodyAssessmentInput => {
  const section = (group: AssessmentGroup) =>
    Object.fromEntries(
      assessmentFields
        .filter(field => field.group === group)
        .map(field => [
          field.key,
          field.text
            ? fieldValue(values, group, field.key).trim() || null
            : number(fieldValue(values, group, field.key)),
        ])
    )
  return {
    assessmentDate: parseBrazilianDate(values.assessmentDate) ?? "",
    bodyIndex: section("bodyIndex"),
    circumferences: section("circumferences"),
    skinfolds: section("skinfolds"),
  } as BodyAssessmentInput
}
const schema = z
  .object({
    assessmentDate: dateSchema.refine(Boolean, "Informe a data da avaliação"),
    values: z.record(z.string(), z.record(z.string(), z.string())),
  })
  .superRefine((values, context) => {
    const parsed = assessmentInputSchema.safeParse(inputFrom(values))
    if (!parsed.success)
      context.addIssue({
        code: "custom",
        message: parsed.error.issues[0]?.message ?? "Revise os dados informados",
      })
  })

export function BodyAssessmentForm({
  item,
  group,
  onDone,
  onCancel,
  onDirtyChange,
}: {
  item?: BodyAssessment
  group?: AssessmentGroup
  onDone: (item: BodyAssessment) => void
  onCancel: () => void
  onDirtyChange?: (value: boolean) => void
}) {
  const progressUseCases = useProgressUseCases()
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: emptyValues(item),
  })
  const [saving, setSaving] = useState(false)
  const [failure, setFailure] = useState("")
  const visibleGroups = group ? [group] : groups.map(value => value.key)
  useEffect(() => form.reset(emptyValues(item)), [form, item])
  useEffect(
    () => onDirtyChange?.(form.formState.isDirty),
    [form.formState.isDirty, onDirtyChange]
  )
  async function submit(values: FormValues) {
    const parsed = assessmentInputSchema.safeParse(inputFrom(values))
    if (!parsed.success)
      return setFailure(parsed.error.issues[0]?.message ?? "Revise os dados informados")
    setSaving(true)
    setFailure("")
    try {
      onDone(
        item
          ? await progressUseCases.saveAssessment(parsed.data, item)
          : await progressUseCases.saveAssessment(parsed.data)
      )
    } catch (error) {
      setFailure(error instanceof Error ? error.message : "Não foi possível salvar")
    } finally {
      setSaving(false)
    }
  }
  return (
    <form className="space-y-5" onSubmit={form.handleSubmit(submit)}>
      <fieldset className="grid gap-5 sm:grid-cols-2" disabled={saving}>
        {visibleGroups.includes("bodyIndex") && (
          <TextField
            {...form.register("assessmentDate")}
            error={form.formState.errors.assessmentDate}
            icon={<CalendarIcon />}
            id="assessment-date"
            label="Data da avaliação"
            onChange={event => {
              event.target.value = formatBrazilianDateInput(event.target.value)
              form.setValue("assessmentDate", event.target.value, { shouldDirty: true })
            }}
            placeholder="DD/MM/AAAA"
          />
        )}
        {assessmentFields
          .filter(field => visibleGroups.includes(field.group))
          .map(field => {
            const name = `values.${field.group}.${field.key}` as FieldPath<FormValues>
            return (
              <TextField
                {...form.register(name)}
                error={form.formState.errors.values?.[field.group]?.[field.key]}
                icon={field.group === "bodyIndex" ? <ScaleIcon /> : <RulerIcon />}
                id={name}
                key={name}
                label={field.label}
                placeholder={field.placeholder ?? "Ex: 86,2"}
              />
            )
          })}
      </fieldset>
      {failure && (
        <p className="text-sm text-destructive" role="alert">
          {failure}
        </p>
      )}
      <DialogFooter>
        <Button disabled={saving} onClick={onCancel} type="button" variant="outline">
          Cancelar
        </Button>
        <Button disabled={saving} type="submit">
          {saving && <LoaderCircleIcon className="animate-spin" />}
          {item ? "Alterar" : "Criar"}
        </Button>
      </DialogFooter>
    </form>
  )
}
