import type { Metadata } from "next"
import type { ReactNode } from "react"
import { AppShell } from "@/components/app-shell"
import { UserProfileProvider } from "@/contexts/user-profile-context"

export const metadata: Metadata = {
  title: "Início | Última Repetição",
  description: "Crie, organize e acompanhe suas rotinas de treino",
}

export default function AuthenticatedLayout({ children }: { children: ReactNode }) {
  return (
    <UserProfileProvider>
      <AppShell>{children}</AppShell>
    </UserProfileProvider>
  )
}
