import type { Metadata } from "next"
import { PageHeader } from "@/components/page-header"
import { WorkoutCreateOrEdit } from "@/components/workouts/workout-create-or-edit"
import { WorkoutDelete } from "@/components/workouts/workout-delete"
import { WorkoutDetails } from "@/components/workouts/workout-details"
import { WorkoutList } from "@/components/workouts/workout-list"
import { WorkoutsFilter } from "@/components/workouts/workouts-filter"
import { WorkoutProvider } from "@/contexts/workout-context"

export const metadata: Metadata = {
  title: "Treinos | Última Repetição",
  description: "Crie, organize e acompanhe suas rotinas de treino",
}

export default function WorkoutsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        description="Monte e organize seus dias, exercícios, séries e repetições"
        title="Meus treinos"
      />

      <WorkoutProvider>
        <WorkoutsFilter />

        <WorkoutList />

        <WorkoutCreateOrEdit />

        <WorkoutDetails />

        <WorkoutDelete />
      </WorkoutProvider>
    </div>
  )
}
