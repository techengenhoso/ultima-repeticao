import type { Metadata } from "next"
import { SessionHistory } from "@/components/sessions/session-history"

export const metadata: Metadata = {
  title: "Histórico | Última Repetição",
  description: "Consulte os treinos realizados e acompanhe seu desempenho",
}

export default function HistoryPage() {
  return <SessionHistory />
}
