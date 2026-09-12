import type { Metadata } from "next"
import { SessionScreen } from "@/components/sessions/session-screen"

export const metadata: Metadata = { title: "Treino em execução | Última Repetição" }

export default async function WorkoutSessionPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <SessionScreen id={id} />
}
