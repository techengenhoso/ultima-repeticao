import type { Workout, WorkoutInput } from "../domain/workout"
import {
  filterWorkouts,
  sortWorkouts,
  type WorkoutFilters,
} from "../domain/workout-library"
import type { WorkoutRepository } from "./ports/workout-repository"

export interface WorkoutUseCases {
  list(uid: string): Promise<Workout[]>
  filter(workouts: Workout[], filters: WorkoutFilters): Workout[]
  save(
    uid: string,
    id: string | undefined,
    input: WorkoutInput,
    creationId?: string
  ): Promise<Workout>
  activate(uid: string, id: string): Promise<void>
  deactivate(uid: string, id: string): Promise<void>
  remove(uid: string, id: string): Promise<void>
  replace(workouts: Workout[], workout: Workout): Workout[]
  activateInList(workouts: Workout[], id: string): Workout[]
  deactivateInList(workouts: Workout[], id: string): Workout[]
  removeFromList(workouts: Workout[], id: string): Workout[]
}

export function createWorkoutUseCases(repository: WorkoutRepository): WorkoutUseCases {
  return {
    async list(uid) {
      return sortWorkouts(await repository.list(uid))
    },
    filter: (workouts, filters) => filterWorkouts(workouts, filters),
    save: (uid, id, input, creationId) =>
      id ? repository.update(uid, id, input) : repository.create(uid, input, creationId),
    activate: (uid, id) => repository.activate(uid, id),
    deactivate: (uid, id) => repository.deactivate(uid, id),
    remove: (uid, id) => repository.delete(uid, id),
    replace: (workouts, workout) =>
      sortWorkouts([...workouts.filter(item => item.id !== workout.id), workout]),
    activateInList: (workouts, id) =>
      sortWorkouts(workouts.map(item => ({ ...item, isActive: item.id === id }))),
    deactivateInList: (workouts, id) =>
      sortWorkouts(
        workouts.map(item => (item.id === id ? { ...item, isActive: false } : item))
      ),
    removeFromList: (workouts, id) => workouts.filter(item => item.id !== id),
  }
}
