import type { Metadata } from "next"
import { ProgressDashboard } from "@/modules/progress/presentation/progress-dashboard"

export const metadata: Metadata = {
  title: "Evolução | Última Repetição",
  description: "Acompanhe suas avaliações corporais e o desempenho dos seus treinos",
}

export default function ProgressPage() {
  return <ProgressDashboard />
}
