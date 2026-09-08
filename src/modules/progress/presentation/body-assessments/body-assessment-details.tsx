import type { BodyAssessment } from "@/modules/body-assessments/domain/body-assessment"
import { assessmentFields, groups } from "@/modules/body-assessments/presentation/fields"
import { BodyAssessmentGroupsAccordion } from "./body-assessment-groups-accordion"

export function BodyAssessmentDetails({ item }: { item: BodyAssessment }) {
  const filledGroups = groups
    .map(group => ({
      ...group,
      fields: assessmentFields.filter(
        field =>
          field.group === group.key && item[field.group][field.key as never] !== null
      ),
    }))
    .filter(group => group.fields.length)

  return (
    <BodyAssessmentGroupsAccordion
      className="gap-3"
      groups={filledGroups.map(group => ({
        key: group.key,
        label: group.label,
        measureCount: group.fields.length,
      }))}
      renderContent={assessmentGroup => {
        const group = filledGroups.find(item => item.key === assessmentGroup)
        return (
          <dl className="grid gap-3 sm:grid-cols-2">
            {group?.fields.map(field => (
              <div
                className="flex justify-between gap-3 border bg-background px-3 py-2"
                key={field.key}
              >
                <dt className="text-muted-foreground">{field.label}</dt>
                <dd className="text-right font-medium">
                  {String(item[field.group][field.key as never])} {field.unit}
                </dd>
              </div>
            ))}
          </dl>
        )
      }}
    />
  )
}
