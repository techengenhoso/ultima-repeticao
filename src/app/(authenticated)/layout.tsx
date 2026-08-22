import type { Metadata } from "next"
import type { ReactNode } from "react"
import { AppShell } from "@/components/app-shell"
import { UserProfileProvider } from "@/providers/user-profile"

interface Props {
  children: ReactNode
}

export const metadata: Metadata = {
  title: "Início | Última Repetição",
  description: "Crie, organize e acompanhe suas rotinas de treino",
}

export default function AuthenticatedLayout({ children }: Props) {
  return (
    <UserProfileProvider>
      <AppShell>{children}</AppShell>
    </UserProfileProvider>
  )
}
