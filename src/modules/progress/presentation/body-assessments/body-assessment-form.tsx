"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { cn } from "cn"
import { CalendarIcon, LoaderCircleIcon, RulerIcon, ScaleIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { type FieldPath, useForm } from "react-hook-form"
import { z } from "zod"
import { TextField } from "@/components/text-field"
import { Button } from "@/components/ui/button"
import { DialogFooter } from "@/components/ui/dialog"
import { useScrollPadding } from "@/hooks/use-scroll-padding"
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
  type FieldDefinition,
  groups,
} from "@/modules/body-assessments/presentation/fields"
import { useProgressUseCases } from "../progress-use-cases-context"
import { BodyAssessmentGroupsAccordion } from "./body-assessment-groups-accordion"

type FormValues = {
  assessmentDate: string
  values: Record<string, Record<string, string>>
}
const number = (value: string) =>
  value.trim() === "" ? undefined : Number(value.replace(",", "."))
const fieldValue = (values: FormValues, group: AssessmentGroup, key: string) =>
  values.values[group]?.[key] ?? ""
const fieldsFor = (group: AssessmentGroup) =>
  assessmentFields.filter(field => field.group === group)
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
        .flatMap(field => {
          const value = field.text
            ? fieldValue(values, group, field.key).trim() || undefined
            : number(fieldValue(values, group, field.key))
          return value === undefined ? [] : [[field.key, value]]
        })
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
    if (!parsed.success) {
      const issue = parsed.error.issues[0]
      const path =
        issue?.path[0] === "assessmentDate"
          ? issue.path
          : issue?.path.length
            ? ["values", ...issue.path]
            : ["root"]
      context.addIssue({
        code: "custom",
        message: issue?.message ?? "Revise os dados informados",
        path,
      })
    }
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
  const { hasVerticalOverflow, ref: scrollRef } = useScrollPadding()
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
  const renderField = (field: FieldDefinition) => {
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
  }

  return (
    <form className="space-y-5" onSubmit={form.handleSubmit(submit)}>
      <div
        className={cn(
          "max-h-[calc(100dvh-15rem)] overflow-y-auto overscroll-contain",
          hasVerticalOverflow && "pr-3"
        )}
        ref={scrollRef}
      >
        <fieldset className="grid content-start gap-5 sm:grid-cols-2" disabled={saving}>
          <div className="sm:col-span-2">
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
          </div>
          <BodyAssessmentGroupsAccordion
            className="sm:col-span-2"
            groups={visibleGroups.map(assessmentGroup => {
              const groupFields = fieldsFor(assessmentGroup)
              return {
                key: assessmentGroup,
                label:
                  groups.find(groupItem => groupItem.key === assessmentGroup)?.label ??
                  assessmentGroup,
                measureCount: groupFields.length,
              }
            })}
            renderContent={assessmentGroup => (
              <div className="grid gap-5 sm:grid-cols-2">
                {fieldsFor(assessmentGroup).map(renderField)}
              </div>
            )}
          />
        </fieldset>
      </div>
      {(failure || form.formState.errors.root?.message) && (
        <p className="text-sm text-destructive" role="alert">
          {failure || form.formState.errors.root?.message}
        </p>
      )}
      <DialogFooter className="border-t pt-4">
        <Button disabled={saving} onClick={onCancel} type="button" variant="secondary">
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
