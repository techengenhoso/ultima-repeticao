interface Props {
  label: string
  value: string
}

export function WorkoutExerciseMetric({ label, value }: Props) {
  return (
    <div className="space-y-2">
      <p className="font-medium">{label}</p>
      <p className="flex min-h-9 items-center border bg-muted/20 px-3 text-sm">{value}</p>
    </div>
  )
}
