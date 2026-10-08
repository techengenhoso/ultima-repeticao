import { Item, ItemContent, ItemDescription, ItemTitle } from "@/components/ui/item"

interface DetailSectionProps {
  title: string
  value: string
}

export function DetailSection({ title, value }: DetailSectionProps) {
  return (
    <Item className="items-start" size="sm" variant="muted">
      <ItemContent className="min-w-0">
        <ItemDescription className="leading-tight">{title}</ItemDescription>
        <ItemTitle className="line-clamp-none leading-tight whitespace-pre-wrap">
          {value}
        </ItemTitle>
      </ItemContent>
    </Item>
  )
}
