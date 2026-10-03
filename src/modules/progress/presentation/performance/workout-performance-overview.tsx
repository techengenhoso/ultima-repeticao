import type { WorkoutPerformanceData } from "./performance-types"
import { WorkoutPerformanceChart } from "./workout-performance-chart"
import { WorkoutPerformanceIndicators } from "./workout-performance-indicators"

export function WorkoutPerformanceOverview({ data }: { data: WorkoutPerformanceData }) {
  return (
    <>
      <WorkoutPerformanceIndicators data={data} />
      <WorkoutPerformanceChart data={data} />
    </>
  )
}
