import type { Metadata } from "next"
import type { ReactNode } from "react"
import { AppShell } from "@/components/app-shell"
import { ProfileProvider } from "@/contexts/profile-context"
import { UserProvider } from "@/contexts/user-context"

export const metadata: Metadata = {
  title: "Início | Última Repetição",
  description: "Crie, organize e acompanhe suas rotinas de treino",
}

export default function AuthenticatedLayout({ children }: { children: ReactNode }) {
  return (
    <UserProvider>
      <ProfileProvider>
        <AppShell>{children}</AppShell>
      </ProfileProvider>
    </UserProvider>
  )
}
