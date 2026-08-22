import { ActivityIcon } from "lucide-react"
import type { Metadata } from "next"
import { PlaceholderPage } from "@/components/placeholder-page"

export const metadata: Metadata = {
  title: "Evolução | Última Repetição",
  description: "Visualize seu progresso e acompanhe a evolução dos seus resultados",
}

export default function ProgressPage() {
  return (
    <PlaceholderPage
      description="Acompanhe seus resultados e sua constância"
      icon={ActivityIcon}
      title="Evolução"
    />
  )
}
