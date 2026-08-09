interface DetailSectionProps {
  title: string
  value: string
}

export function DetailSection({ title, value }: DetailSectionProps) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase">{title}</dt>
      <dd className="mt-1 whitespace-pre-wrap text-muted-foreground">{value}</dd>
    </div>
  )
}
