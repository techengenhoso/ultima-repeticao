"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import { useUserProfile } from "@/contexts/user-profile-context"
import { mergeExercises } from "@/lib/exercises/catalog"
import { systemExercises } from "@/lib/exercises/system-exercises"
import type {
  CustomExercise,
  Exercise,
  ExerciseInput,
  SystemExerciseOverride,
} from "@/lib/exercises/types"
import {
  createCustomExercise,
  DuplicateExerciseNameError,
  deleteCustomExercise,
  listCustomExercises,
  listSystemExerciseOverrides,
  saveSystemExerciseOverride,
  updateCustomExercise,
} from "@/services/exercises"

export function useExerciseLibrary() {
  const { user, isLoadingUserProfile: isLoadingProfile } = useUserProfile()
  const [customExercises, setCustomExercises] = useState<CustomExercise[]>([])
  const [systemOverrides, setSystemOverrides] = useState<SystemExerciseOverride[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)

  const loadExercises = useCallback(async () => {
    if (!user) return

    setIsLoading(true)
    try {
      const [custom, overrides] = await Promise.all([
        listCustomExercises(user.uid),
        listSystemExerciseOverrides(user.uid),
      ])
      setCustomExercises(custom)
      setSystemOverrides(overrides)
    } catch {
      toast.error("Não foi possível carregar seus exercícios")
    } finally {
      setIsLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (isLoadingProfile) return
    if (user) void loadExercises()
    else {
      setCustomExercises([])
      setSystemOverrides([])
      setIsLoading(false)
    }
  }, [isLoadingProfile, loadExercises, user])

  const exercises = useMemo(
    () => mergeExercises(systemExercises, customExercises, systemOverrides),
    [customExercises, systemOverrides]
  )

  async function saveExercise(
    exercise: Exercise | null | undefined,
    values: ExerciseInput
  ) {
    if (!user) return false

    try {
      if (exercise?.source === "system") {
        const saved = await saveSystemExerciseOverride(user.uid, exercise.id, values)
        setSystemOverrides(current => [
          ...current.filter(item => item.id !== saved.id),
          saved,
        ])
        toast.success("Exercício padrão atualizado")
      } else if (exercise) {
        const saved = await updateCustomExercise(user.uid, exercise.id, values)
        setCustomExercises(current =>
          current.map(item => (item.id === saved.id ? saved : item))
        )
        toast.success("Exercício atualizado")
      } else {
        const saved = await createCustomExercise(user.uid, values)
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
    if (!user) return false

    setIsDeleting(true)
    try {
      await deleteCustomExercise(user.uid, exercise.id)
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

  return { exercises, isDeleting, isLoading, removeExercise, saveExercise }
}
