import type { Metadata } from "next"
import { ExerciseLibrary } from "@/components/exercises/exercise-library"
import { PageHeader } from "@/components/page-header"

export const metadata: Metadata = {
  title: "Exercícios | Última Repetição",
  description: "Consulte e gerencie os exercícios disponíveis para montar seus treinos",
}

export default function ExercisesPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        description="Consulte exercícios padrão e gerencie sua biblioteca pessoal"
        title="Exercícios"
      />

      <ExerciseLibrary />
    </div>
  )
}
