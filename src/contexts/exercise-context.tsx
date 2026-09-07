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
import { DuplicateExerciseNameError } from "@/modules/exercises/application/ports/exercise-repository"
import type {
  CustomExercise,
  Exercise,
  ExerciseInput,
} from "@/modules/exercises/domain/exercise"
import {
  type ExerciseFilters,
  emptyExerciseFilters,
} from "@/modules/exercises/domain/exercise-library"
import { useExerciseUseCases } from "@/modules/exercises/presentation/exercise-use-cases-context"

function useExerciseState() {
  const { user } = useUser()
  const exerciseUseCases = useExerciseUseCases()

  const [exercises, setExercises] = useState<Exercise[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [filters, setFilters] = useState<ExerciseFilters>(emptyExerciseFilters)
  const [formExercise, setFormExercise] = useState<Exercise | null | undefined>()
  const [details, setDetails] = useState<Exercise | null>(null)
  const [deleting, setDeleting] = useState<CustomExercise | null>(null)

  const loadExercises = useCallback(async () => {
    setIsLoading(true)

    try {
      setExercises(await exerciseUseCases.list(user.uid))
    } catch {
      toast.error("Não foi possível carregar seus exercícios")
    } finally {
      setIsLoading(false)
    }
  }, [exerciseUseCases, user.uid])

  useEffect(() => {
    void loadExercises()
  }, [loadExercises])

  const filteredExercises = useMemo(
    () => exerciseUseCases.filter(exercises, filters),
    [exerciseUseCases, exercises, filters]
  )

  async function saveExercise(
    exercise: Exercise | null | undefined,
    values: ExerciseInput
  ) {
    try {
      await exerciseUseCases.save(user.uid, exercise, values)
      await loadExercises()
      if (exercise?.source === "default") {
        toast.success("Exercício padrão atualizado")
      } else if (exercise) {
        toast.success("Exercício atualizado")
      } else {
        toast.success("Exercício criado")
      }

      return true
    } catch (error) {
      if (error instanceof DuplicateExerciseNameError) {
        toast.error("Você já possui um exercício com esse nome")
      } else {
        toast.error("Não foi possível salvar o exercício")
      }
      return false
    }
  }

  async function removeExercise(exercise: CustomExercise) {
    setIsDeleting(true)
    try {
      await exerciseUseCases.remove(user.uid, exercise.id)
      await loadExercises()
      toast.success("Exercício excluído")
      return true
    } catch {
      toast.error("Não foi possível excluir o exercício")
      return false
    } finally {
      setIsDeleting(false)
    }
  }

  async function handleSaveExercise(values: ExerciseInput) {
    if (await saveExercise(formExercise, values)) setFormExercise(undefined)
  }

  async function confirmDelete() {
    if (deleting && (await removeExercise(deleting))) setDeleting(null)
  }

  return {
    confirmDelete,
    deleting,
    details,
    filteredExercises,
    formExercise,
    handleSaveExercise,
    isDeleting,
    isLoading,
    setDeleting,
    setDetails,
    setFilters,
    setFormExercise,
  }
}

type ExerciseContext = ReturnType<typeof useExerciseState>

const ExerciseContext = createContext<ExerciseContext | null>(null)

export function ExerciseProvider({ children }: { children: ReactNode }) {
  const value = useExerciseState()

  return <ExerciseContext.Provider value={value}>{children}</ExerciseContext.Provider>
}

export function useExercise() {
  const context = useContext(ExerciseContext)
  if (!context) throw new Error("ExerciseProvider não encontrado")
  return context
}
