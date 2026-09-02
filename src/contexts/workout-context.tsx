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
import { mergeExercises } from "@/lib/exercises/catalog"
import type { Exercise } from "@/lib/exercises/types"
import { emptyWorkoutFilters, filterWorkouts, sortWorkouts } from "@/lib/workouts/catalog"
import type { Workout, WorkoutInput } from "@/lib/workouts/types"
import {
  listCustomExercisesRepository,
  listDefaultExerciseOverridesRepository,
} from "@/repositories/exercise-repository"
import {
  activateWorkoutRepository,
  createWorkoutRepository,
  deactivateWorkoutRepository,
  deleteWorkoutRepository,
  listWorkoutsRepository,
  updateWorkoutRepository,
} from "@/repositories/workout-repository"
import { defaultExercises } from "@/seeds/default-exercises"

function useWorkoutState() {
  const { user } = useUser()
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
      const [loadedWorkouts, custom, overrides] = await Promise.all([
        listWorkoutsRepository(user.uid),
        listCustomExercisesRepository(user.uid),
        listDefaultExerciseOverridesRepository(user.uid),
      ])
      setWorkouts(loadedWorkouts)
      setExercises(mergeExercises(defaultExercises, custom, overrides))
    } catch {
      setLoadingError(true)
    } finally {
      setIsLoading(false)
    }
  }, [user])

  useEffect(() => {
    void loadWorkouts()
  }, [loadWorkouts])

  const exercisesByReference = useMemo(
    () =>
      new Map(exercises.map(exercise => [`${exercise.source}:${exercise.id}`, exercise])),
    [exercises]
  )

  const filteredWorkouts = useMemo(
    () => filterWorkouts(workouts, filters),
    [filters, workouts]
  )

  async function saveWorkout(workout: Workout | null | undefined, values: WorkoutInput) {
    try {
      const saved = workout?.id
        ? await updateWorkoutRepository(user.uid, workout.id, values)
        : await createWorkoutRepository(user.uid, values)
      setWorkouts(current =>
        sortWorkouts([...current.filter(item => item.id !== saved.id), saved])
      )
      toast.success(workout?.id ? "Ficha atualizada" : "Ficha criada")
      return true
    } catch {
      toast.error("Não foi possível salvar a ficha")
      return false
    }
  }

  async function activateWorkout(workout: Workout) {
    setIsActivating(true)
    try {
      await activateWorkoutRepository(user.uid, workout.id)
      setWorkouts(current =>
        sortWorkouts(
          current.map(item => ({
            ...item,
            isActive: item.id === workout.id,
          }))
        )
      )
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
      await deactivateWorkoutRepository(user.uid, workout.id)
      setWorkouts(current =>
        sortWorkouts(
          current.map(item =>
            item.id === workout.id ? { ...item, isActive: false } : item
          )
        )
      )
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
      await deleteWorkoutRepository(user.uid, workout.id)
      setWorkouts(current => current.filter(item => item.id !== workout.id))
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
