import type { Metadata } from "next"
import { ProgressDashboard } from "@/components/progress/progress-dashboard"

export const metadata: Metadata = {
  title: "Evolução | Última Repetição",
  description: "Acompanhe suas avaliações corporais e seu desempenho nos treinos",
}

export default function ProgressPage() {
  return <ProgressDashboard />
}
