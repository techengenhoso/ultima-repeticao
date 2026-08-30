import type { Metadata } from "next"
import { ExerciseCreateOrEdit } from "@/components/exercises/exercise-create-or-edit"
import { ExerciseDelete } from "@/components/exercises/exercise-delete"
import { ExerciseDetails } from "@/components/exercises/exercise-details"
import { ExerciseList } from "@/components/exercises/exercise-list"
import { ExercisesFilter } from "@/components/exercises/exercises-filter"
import { PageHeader } from "@/components/page-header"
import { ExerciseProvider } from "@/contexts/exercise-context"

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

      <ExerciseProvider>
        <ExercisesFilter />

        <ExerciseList />

        <ExerciseCreateOrEdit />

        <ExerciseDetails />

        <ExerciseDelete />
      </ExerciseProvider>
    </div>
  )
}
