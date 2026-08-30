"use client"

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react"
import { useUser } from "@/contexts/user-context"
import {
  ensureProfileRepository,
  type Profile,
  type ProfileEditable,
  saveProfileRepository,
} from "@/repositories/profile-repository"

function useProfileState() {
  const { user } = useUser()

  const [profile, setProfile] = useState<Profile | null>(null)
  const [loadingError, setLoadingError] = useState<unknown>(null)

  useEffect(() => {
    let isActive = true

    setProfile(null)
    setLoadingError(null)

    ensureProfileRepository(user.uid)
      .then(result => {
        if (isActive) setProfile(result)
      })
      .catch(error => {
        if (isActive) setLoadingError(error)
      })

    return () => {
      isActive = false
    }
  }, [user.uid])

  const saveProfile = useCallback(
    async (data: ProfileEditable) => {
      const result = await saveProfileRepository(user.uid, data)
      setProfile(result)
    },
    [user.uid]
  )

  const refreshProfile = useCallback(async () => {
    setProfile(await ensureProfileRepository(user.uid))
  }, [user.uid])

  if (loadingError) throw loadingError
  if (!profile) return null

  return { profile, saveProfile, refreshProfile }
}

type ProfileContext = NonNullable<ReturnType<typeof useProfileState>>

const ProfileContext = createContext<ProfileContext | null>(null)

export function ProfileProvider({ children }: { children: ReactNode }) {
  const value = useProfileState()

  if (!value) return null

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
}

export function useProfile() {
  const context = useContext(ProfileContext)
  if (!context) throw new Error("ProfileProvider não encontrado")
  return context
}
