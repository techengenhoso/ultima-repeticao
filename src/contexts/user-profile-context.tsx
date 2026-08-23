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

interface UserProfileContext {
  user: User | null
  profile: Profile | null
  isLoadingUserProfile: boolean
  saveProfile: (input: ProfileEditable) => Promise<void>
  refreshProfile: () => Promise<void>
}

const UserProfileContext = createContext({} as UserProfileContext)

export function UserProfileProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => auth.currentUser)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoadingUserProfile, setIsLoadingUserProfile] = useState(true)

  useEffect(
    () =>
      onAuthStateChanged(auth, async currentUser => {
        setIsLoadingUserProfile(true)

        setUser(currentUser)

        try {
          setProfile(currentUser ? await get(currentUser.uid) : null)
        } finally {
          setIsLoadingUserProfile(false)
        }
      }),
    []
  )

  const saveProfile = useCallback(
    async (data: ProfileEditable) => {
      if (!user) throw new Error("Usuário não autenticado")
      const result = await create(user.uid, data)
      setProfile(result)
    },
    [user]
  )

  const refreshProfile = useCallback(async () => {
    const currentUser = auth.currentUser

    if (!currentUser) {
      setProfile(null)
      return
    }

    setProfile(await get(currentUser.uid))
  }, [])

  const value = useMemo(
    () => ({
      user,
      profile,
      isLoadingUserProfile,
      saveProfile,
      refreshProfile,
    }),
    [user, profile, isLoadingUserProfile, saveProfile, refreshProfile]
  )

  return (
    <UserProfileContext.Provider value={value}>{children}</UserProfileContext.Provider>
  )
}

export function useUserProfile() {
  const context = useContext(UserProfileContext)
  if (!context) throw new Error("Context userProfile não encontrado")
  return context
}
