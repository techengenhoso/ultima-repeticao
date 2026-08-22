import { ClipboardListIcon } from "lucide-react"
import type { Metadata } from "next"
import { PlaceholderPage } from "@/components/placeholder-page"

export const metadata: Metadata = {
  title: "Treinos | Última Repetição",
  description: "Crie, organize e acompanhe suas rotinas de treino",
}

export default function WorkoutsPage() {
  return (
    <PlaceholderPage
      description="Organize e consulte suas fichas de treino"
      icon={ClipboardListIcon}
      title="Treinos"
    />
  )
}
