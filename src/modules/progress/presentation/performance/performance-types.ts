import type { ProgressUseCases } from "../../application/progress-use-cases"

export type PerformanceData = ReturnType<ProgressUseCases["performanceForExercise"]>
export type PerformanceExerciseOption = ReturnType<
  ProgressUseCases["exerciseOptions"]
>[number]
