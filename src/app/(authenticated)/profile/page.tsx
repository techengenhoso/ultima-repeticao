import { Focus } from "@/components/focus"
import { PageHeader } from "@/components/page-header"
import { PersonalInformation } from "@/components/personal-information"

export default function ProfilePage() {
  return (
    <div className="space-y-8">
      <PageHeader
        description="Gerencie seus dados pessoais e foco de treino"
        title="Perfil"
      />

      <PersonalInformation />

      <Focus />
    </div>
  )
}
