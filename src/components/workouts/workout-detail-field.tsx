import type { ReactNode } from "react"

interface Props {
  children: ReactNode
  label: string
}

export function WorkoutDetailField({ children, label }: Props) {
  return (
    <div className="space-y-2">
      <p className="font-medium">{label}</p>
      <div className="flex min-h-11 items-center border bg-muted/20 px-3 py-2 text-sm">
        {children}
      </div>
    </div>
  )
}
