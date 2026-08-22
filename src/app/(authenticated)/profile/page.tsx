import type { Metadata } from "next"
import { PageHeader } from "@/components/page-header"
import { ChangePassword } from "@/components/profile/change-password"
import { Focus } from "@/components/profile/focus"
import { PersonalInformation } from "@/components/profile/personal-information"

export const metadata: Metadata = {
  title: "Perfil | Última Repetição",
  description: "Consulte e atualize suas informações pessoais",
}

export default function ProfilePage() {
  return (
    <div className="space-y-8">
      <PageHeader
        description="Gerencie seus dados pessoais e foco de treino"
        title="Perfil"
      />

      <PersonalInformation />

      <ChangePassword />

      <Focus />
    </div>
  )
}
