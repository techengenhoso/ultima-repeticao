import { fieldFor } from "./fields"
import type { BodyAssessment } from "./schemas"
export type Metric = { group: "bodyIndex" | "circumferences" | "skinfolds"; key: string }
export const sortAssessments = (items: BodyAssessment[]) =>
  [...items].sort((a, b) => b.assessmentDate.localeCompare(a.assessmentDate))
export function metricValue(item: BodyAssessment, metric: Metric): number | null {
  const value = item[metric.group][metric.key as never]
  return typeof value === "number" ? value : null
}
export const metricHistory = (items: BodyAssessment[], metric: Metric) =>
  [...items]
    .sort((a, b) => a.assessmentDate.localeCompare(b.assessmentDate))
    .flatMap(item => {
      const value = metricValue(item, metric)
      return value === null ? [] : [{ date: item.assessmentDate, value }]
    })
export function comparison(items: BodyAssessment[], metric: Metric) {
  const values = sortAssessments(items).flatMap(item => {
    const value = metricValue(item, metric)
    return value === null ? [] : [{ item, value }]
  })
  if (values.length < 2) return null
  const difference = values[0].value - values[1].value
  return {
    difference,
    percentage: values[1].value === 0 ? null : (difference / values[1].value) * 100,
  }
}
export const metricLabel = (metric: Metric) =>
  fieldFor(metric.group, metric.key)?.label ?? metric.key
