import type { Metadata } from "next"
import { SessionScreen } from "@/components/sessions/session-screen"

export const metadata: Metadata = { title: "Sessão de treino | Última Repetição" }
export default async function SessionPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <SessionScreen id={id} />
}
