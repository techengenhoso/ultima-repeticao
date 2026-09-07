import type { BodyAssessment } from "@/modules/body-assessments/domain/body-assessment"
import { assessmentFields, groups } from "@/modules/body-assessments/presentation/fields"

export function BodyAssessmentDetails({ item }: { item: BodyAssessment }) {
  return (
    <div className="space-y-4">
      {groups.map(group => {
        const filled = assessmentFields.filter(
          field =>
            field.group === group.key && item[field.group][field.key as never] !== null
        )
        return filled.length ? (
          <section key={group.key}>
            <h3 className="font-semibold">{group.label}</h3>
            <dl className="mt-2 grid gap-2 sm:grid-cols-2">
              {filled.map(field => (
                <div className="flex justify-between gap-3 border p-2" key={field.key}>
                  <dt className="text-muted-foreground">{field.label}</dt>
                  <dd>
                    {String(item[field.group][field.key as never])} {field.unit}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        ) : null
      })}
    </div>
  )
}
