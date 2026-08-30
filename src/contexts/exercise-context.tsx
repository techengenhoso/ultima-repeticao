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
import {
  type ExerciseFilters,
  emptyExerciseFilters,
  filterExercises,
  mergeExercises,
} from "@/lib/exercises/catalog"
import type {
  CustomExercise,
  DefaultExerciseOverride,
  Exercise,
  ExerciseInput,
} from "@/lib/exercises/types"
import {
  createCustomExerciseRepository,
  DuplicateExerciseNameError,
  deleteCustomExerciseRepository,
  listCustomExercisesRepository,
  listDefaultExerciseOverridesRepository,
  saveDefaultExerciseOverrideRepository,
  updateCustomExerciseRepository,
} from "@/repositories/exercise-repository"
import { defaultExercises } from "@/seeds/default-exercises"

function useExerciseState() {
  const { user } = useUser()

  const [customExercises, setCustomExercises] = useState<CustomExercise[]>([])
  const [defaultOverrides, setDefaultOverrides] = useState<DefaultExerciseOverride[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [filters, setFilters] = useState<ExerciseFilters>(emptyExerciseFilters)
  const [formExercise, setFormExercise] = useState<Exercise | null | undefined>()
  const [details, setDetails] = useState<Exercise | null>(null)
  const [deleting, setDeleting] = useState<CustomExercise | null>(null)

  const loadExercises = useCallback(async () => {
    setIsLoading(true)

    try {
      const [custom, overrides] = await Promise.all([
        listCustomExercisesRepository(user.uid),
        listDefaultExerciseOverridesRepository(user.uid),
      ])

      setCustomExercises(custom)
      setDefaultOverrides(overrides)
    } catch {
      toast.error("Não foi possível carregar seus exercícios")
    } finally {
      setIsLoading(false)
    }
  }, [user])

  useEffect(() => {
    void loadExercises()
  }, [loadExercises])

  const exercises = useMemo(
    () => mergeExercises(defaultExercises, customExercises, defaultOverrides),
    [customExercises, defaultOverrides]
  )

  const filteredExercises = useMemo(
    () => filterExercises(exercises, filters),
    [exercises, filters]
  )

  async function saveExercise(
    exercise: Exercise | null | undefined,
    values: ExerciseInput
  ) {
    try {
      if (exercise?.source === "default") {
        const saved = await saveDefaultExerciseOverrideRepository(
          user.uid,
          exercise.id,
          values
        )
        setDefaultOverrides(current => [
          ...current.filter(item => item.id !== saved.id),
          saved,
        ])
        toast.success("Exercício padrão atualizado")
      } else if (exercise) {
        const saved = await updateCustomExerciseRepository(user.uid, exercise.id, values)
        setCustomExercises(current =>
          current.map(item => (item.id === saved.id ? saved : item))
        )
        toast.success("Exercício atualizado")
      } else {
        const saved = await createCustomExerciseRepository(user.uid, values)
        setCustomExercises(current => [...current, saved])
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
      await deleteCustomExerciseRepository(user.uid, exercise.id)
      setCustomExercises(current => current.filter(item => item.id !== exercise.id))
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
