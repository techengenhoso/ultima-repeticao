import type { ReactNode } from "react"

import { AppShell } from "@/components/app-shell"
import { UserProfileProvider } from "@/providers/user-profile"

export default function AuthenticatedLayout({ children }: { children: ReactNode }) {
  return (
    <UserProfileProvider>
      <AppShell>{children}</AppShell>
    </UserProfileProvider>
  )
}
