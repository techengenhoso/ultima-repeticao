import { PageHeader } from "@/components/page-header"
import { ChangePassword } from "@/components/profile/change-password"
import { Focus } from "@/components/profile/focus"
import { PersonalInformation } from "@/components/profile/personal-information"

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
