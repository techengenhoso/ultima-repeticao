import type { LucideIcon } from "lucide-react"

type SummaryCardProps = {
  description: string
  icon: LucideIcon
  label: string
  value: string
}

export function SummaryCard({ description, icon: Icon, label, value }: SummaryCardProps) {
  return (
    <article className="border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight">{value}</p>
        </div>

        <span className="flex size-10 items-center justify-center bg-primary/10 text-primary">
          <Icon aria-hidden="true" className="size-5" />
        </span>
      </div>

      <p className="mt-4 text-xs text-muted-foreground">{description}</p>
    </article>
  )
}
