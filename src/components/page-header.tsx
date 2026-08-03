type PageHeaderProps = {
  title: string
  description: string
}

function getToday() {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    weekday: "short",
  })
    .format(new Date())
    .replace(".", "")
    .toLocaleUpperCase("pt-BR")
}

export function PageHeader({ description, title }: PageHeaderProps) {
  return (
    <header className="grid gap-y-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-x-8">
      <h1 className="text-3xl font-bold tracking-tight sm:col-start-1 sm:row-start-1 sm:text-4xl">
        {title}
      </h1>

      <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:col-start-1 sm:row-start-2 sm:text-base">
        {description}
      </p>

      <time className="text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase sm:col-start-2 sm:row-start-2 sm:self-center">
        {getToday()}
      </time>
    </header>
  )
}
