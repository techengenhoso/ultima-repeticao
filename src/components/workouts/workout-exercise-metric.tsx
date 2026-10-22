import { Item, ItemContent, ItemDescription, ItemTitle } from "@/components/ui/item"

interface Props {
  label: string
  value: string
}

export function WorkoutExerciseMetric({ label, value }: Props) {
  return (
    <Item className="min-w-0" size="sm" variant="muted">
      <ItemContent className="min-w-0">
        <ItemDescription>{label}</ItemDescription>
        <ItemTitle className="line-clamp-none wrap-break-word">{value}</ItemTitle>
      </ItemContent>
    </Item>
  )
}
