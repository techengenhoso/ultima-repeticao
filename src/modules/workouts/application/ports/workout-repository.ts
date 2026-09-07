import type { Workout, WorkoutInput } from "@/modules/workouts/domain/workout"

export interface WorkoutRepository {
  list(uid: string): Promise<Workout[]>
  create(uid: string, input: WorkoutInput, creationId?: string): Promise<Workout>
  update(uid: string, id: string, input: WorkoutInput): Promise<Workout>
  delete(uid: string, id: string): Promise<void>
  activate(uid: string, id: string): Promise<void>
  deactivate(uid: string, id: string): Promise<void>
}
