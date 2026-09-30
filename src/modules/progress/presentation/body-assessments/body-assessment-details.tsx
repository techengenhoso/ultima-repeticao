import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "@/components/ui/item"
import type { BodyAssessment } from "@/modules/body-assessments/domain/body-assessment"
import { assessmentFields, groups } from "@/modules/body-assessments/presentation/fields"
import { BodyAssessmentGroupsAccordion } from "./body-assessment-groups-accordion"

export function BodyAssessmentDetails({ item }: { item: BodyAssessment }) {
  const filledGroups = groups
    .map(group => ({
      ...group,
      fields: assessmentFields.filter(
        field =>
          field.group === group.key && item[field.group][field.key as never] !== undefined
      ),
    }))
    .filter(group => group.fields.length)

  return (
    <BodyAssessmentGroupsAccordion
      groups={filledGroups.map(group => ({
        key: group.key,
        label: group.label,
        measureCount: group.fields.length,
      }))}
      renderContent={assessmentGroup => {
        const group = filledGroups.find(item => item.key === assessmentGroup)

        return (
          <ItemGroup className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {group?.fields.map(field => (
              <Item className="items-start" key={field.key} size="sm" variant="muted">
                <ItemContent className="min-w-0">
                  <ItemDescription className="leading-tight">
                    {field.label}
                  </ItemDescription>

                  <ItemTitle className="leading-tight whitespace-nowrap">
                    {String(item[field.group][field.key as never])} {field.unit}
                  </ItemTitle>
                </ItemContent>
              </Item>
            ))}
          </ItemGroup>
        )
      }}
      scrollContent
    />
  )
}
