"use client"

import { onAuthStateChanged, type User } from "firebase/auth"
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import { auth } from "@/lib/firebase"
import {
  create,
  get,
  type Profile,
  type ProfileEditable,
} from "@/repositories/profile-repository"

interface ProfileContext {
  user: User | null
  profile: Profile | null
  isLoadingProfile: boolean
  refreshProfile: () => Promise<void>
  saveProfile: (input: ProfileEditable) => Promise<void>
}
const ProfileContext = createContext({} as ProfileContext)

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => auth.currentUser)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)

  useEffect(
    () =>
      onAuthStateChanged(auth, async currentUser => {
        setIsLoadingProfile(true)
        setUser(currentUser)

        try {
          setProfile(currentUser ? await get(currentUser.uid) : null)
        } finally {
          setIsLoadingProfile(false)
        }
      }),
    []
  )

  const refreshProfile = useCallback(async () => {
    const currentUser = auth.currentUser

    if (!currentUser) {
      setProfile(null)
      return
    }

    setProfile(await get(currentUser.uid))
  }, [])

  const saveProfile = useCallback(
    async (data: ProfileEditable) => {
      if (!user) throw new Error("Usuário não autenticado")
      const result = await create(user.uid, data)
      setProfile(result)
    },
    [user]
  )

  const value = useMemo(
    () => ({
      user,
      profile,
      isLoadingProfile,
      saveProfile,
      refreshProfile,
    }),
    [user, profile, isLoadingProfile, refreshProfile, saveProfile]
  )

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
}

export function useProfile() {
  const context = useContext(ProfileContext)
  if (!context) throw new Error("context não encontrado")
  return context
}
