"use client"

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import { toast } from "sonner"
import { useUser } from "@/contexts/user-context"
import type { Exercise } from "@/modules/exercises/domain/exercise"
import { useExerciseUseCases } from "@/modules/exercises/presentation/exercise-use-cases-context"
import type { Workout, WorkoutInput } from "@/modules/workouts/domain/workout"
import { emptyWorkoutFilters } from "@/modules/workouts/domain/workout-library"
import { useWorkoutUseCases } from "@/modules/workouts/presentation/workout-use-cases-context"

function useWorkoutState() {
  const { user } = useUser()
  const exerciseUseCases = useExerciseUseCases()
  const workoutUseCases = useWorkoutUseCases()
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadingError, setLoadingError] = useState(false)
  const [filters, setFilters] = useState(emptyWorkoutFilters)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isActivating, setIsActivating] = useState(false)
  const [formWorkout, setFormWorkout] = useState<Workout | null | undefined>()
  const [details, setDetails] = useState<Workout | null>(null)
  const [deleting, setDeleting] = useState<Workout | null>(null)

  const loadWorkouts = useCallback(async () => {
    setIsLoading(true)
    setLoadingError(false)
    try {
      const [loadedWorkouts, loadedExercises] = await Promise.all([
        workoutUseCases.list(user.uid),
        exerciseUseCases.list(user.uid),
      ])
      setWorkouts(loadedWorkouts)
      setExercises(loadedExercises)
    } catch {
      setLoadingError(true)
    } finally {
      setIsLoading(false)
    }
  }, [exerciseUseCases, user.uid, workoutUseCases])

  useEffect(() => {
    void loadWorkouts()
  }, [loadWorkouts])

  const exercisesByReference = useMemo(
    () =>
      new Map(exercises.map(exercise => [`${exercise.source}:${exercise.id}`, exercise])),
    [exercises]
  )

  const filteredWorkouts = useMemo(
    () => workoutUseCases.filter(workouts, filters),
    [filters, workoutUseCases, workouts]
  )

  async function saveWorkout(workout: Workout | null | undefined, values: WorkoutInput) {
    try {
      const saved = await workoutUseCases.save(user.uid, workout?.id, values)
      setWorkouts(current => workoutUseCases.replace(current, saved))
      toast.success(workout?.id ? "Ficha atualizada" : "Ficha criada")
      return true
    } catch {
      toast.error("Não foi possível salvar a ficha")
      return false
    }
  }

  async function createGeneratedWorkout(values: WorkoutInput, creationId: string) {
    const saved = await workoutUseCases.save(user.uid, undefined, values, creationId)
    setWorkouts(current => workoutUseCases.replace(current, saved))
    toast.success("Ficha criada")
    return saved
  }

  async function activateWorkout(workout: Workout) {
    setIsActivating(true)
    try {
      await workoutUseCases.activate(user.uid, workout.id)
      setWorkouts(current => workoutUseCases.activateInList(current, workout.id))
      toast.success("Ficha definida como ativa")
    } catch {
      toast.error("Não foi possível ativar a ficha")
    } finally {
      setIsActivating(false)
    }
  }

  async function deactivateWorkout(workout: Workout) {
    setIsActivating(true)
    try {
      await workoutUseCases.deactivate(user.uid, workout.id)
      setWorkouts(current => workoutUseCases.deactivateInList(current, workout.id))
      toast.success("Ficha desativada")
    } catch {
      toast.error("Não foi possível desativar a ficha")
    } finally {
      setIsActivating(false)
    }
  }

  function duplicateWorkout(workout: Workout) {
    setFormWorkout({
      ...workout,
      id: "",
      name: `${workout.name} — Cópia`,
      isActive: false,
      days: workout.days.map(day => ({
        ...day,
        id: crypto.randomUUID(),
        exercises: day.exercises.map(exercise => ({
          ...exercise,
          id: crypto.randomUUID(),
        })),
      })),
    })
  }

  async function removeWorkout(workout: Workout) {
    setIsDeleting(true)
    try {
      await workoutUseCases.remove(user.uid, workout.id)
      setWorkouts(current => workoutUseCases.removeFromList(current, workout.id))
      toast.success("Ficha excluída")
      return true
    } catch {
      toast.error("Não foi possível excluir a ficha")
      return false
    } finally {
      setIsDeleting(false)
    }
  }

  async function handleSaveWorkout(values: WorkoutInput) {
    if (await saveWorkout(formWorkout, values)) setFormWorkout(undefined)
  }

  async function confirmDelete() {
    if (deleting && (await removeWorkout(deleting))) setDeleting(null)
  }

  return {
    activateWorkout,
    confirmDelete,
    createGeneratedWorkout,
    deactivateWorkout,
    deleting,
    details,
    duplicateWorkout,
    exercises,
    exercisesByReference,
    filteredWorkouts,
    formWorkout,
    handleSaveWorkout,
    isActivating,
    isDeleting,
    isLoading,
    loadWorkouts,
    loadingError,
    workouts,
    setDeleting,
    setDetails,
    setFilters,
    setFormWorkout,
  }
}

type WorkoutContext = ReturnType<typeof useWorkoutState>

const WorkoutContext = createContext<WorkoutContext | null>(null)

export function WorkoutProvider({ children }: { children: ReactNode }) {
  const value = useWorkoutState()

  return <WorkoutContext.Provider value={value}>{children}</WorkoutContext.Provider>
}

export function useWorkout() {
  const context = useContext(WorkoutContext)
  if (!context) throw new Error("WorkoutProvider não encontrado")
  return context
}
