import type { LucideIcon } from "lucide-react"
import { PageHeader } from "@/components/page-header"

type PlaceholderPageProps = {
  title: string
  description: string
  icon: LucideIcon
}

export function PlaceholderPage({ description, icon: Icon, title }: PlaceholderPageProps) {
  return (
    <section>
      <PageHeader description={description} title={title} />

      <div className="mt-8 flex min-h-80 flex-col items-center justify-center border bg-card px-6 py-12 text-center shadow-sm">
        <span className="flex size-14 items-center justify-center bg-primary/10 text-primary">
          <Icon aria-hidden="true" className="size-6" />
        </span>

        <h2 className="mt-5 text-lg font-bold">Em desenvolvimento</h2>

        <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
          Esta funcionalidade será disponibilizada nas próximas etapas do projeto
        </p>
      </div>
    </section>
  )
}
