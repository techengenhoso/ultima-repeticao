import { HistoryIcon } from "lucide-react"
import type { Metadata } from "next"
import { PlaceholderPage } from "@/components/placeholder-page"

export const metadata: Metadata = {
  title: "Histórico | Última Repetição",
  description: "Consulte os treinos realizados e acompanhe seu desempenho",
}

export default function HistoryPage() {
  return (
    <PlaceholderPage
      description="Reveja os treinos realizados ao longo do tempo"
      icon={HistoryIcon}
      title="Histórico"
    />
  )
}
