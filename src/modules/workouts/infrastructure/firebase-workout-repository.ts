import type { WorkoutRepository } from "@/modules/workouts/application/ports/workout-repository"
import {
  activateWorkoutRepository,
  createWorkoutRepository,
  deactivateWorkoutRepository,
  deleteWorkoutRepository,
  listWorkoutsRepository,
  updateWorkoutRepository,
} from "./firebase-workout-data-source"

export const firebaseWorkoutRepository: WorkoutRepository = {
  list: listWorkoutsRepository,
  create: createWorkoutRepository,
  update: updateWorkoutRepository,
  delete: deleteWorkoutRepository,
  activate: activateWorkoutRepository,
  deactivate: deactivateWorkoutRepository,
}
