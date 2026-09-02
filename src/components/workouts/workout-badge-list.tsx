import { Badge } from "@/components/ui/badge"

interface Props {
  emptyLabel: string
  labels: string[]
}

export function WorkoutBadgeList({ emptyLabel, labels }: Props) {
  if (labels.length === 0)
    return <span className="text-muted-foreground">{emptyLabel}</span>

  return (
    <span className="flex flex-wrap gap-1">
      {labels.map(label => (
        <Badge key={label} variant="secondary">
          {label}
        </Badge>
      ))}
    </span>
  )
}
