import type { Metadata } from "next"
import { SessionHistory } from "@/components/sessions/session-history"

export const metadata: Metadata = {
  title: "Evolução | Última Repetição",
  description: "Visualize seu progresso e acompanhe a evolução dos seus resultados",
}

export default function ProgressPage() {
  return <SessionHistory title="Evolução" />
}
