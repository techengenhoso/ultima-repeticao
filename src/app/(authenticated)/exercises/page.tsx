import { ExerciseLibrary } from "@/components/exercises/exercise-library"
import { PageHeader } from "@/components/page-header"

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
