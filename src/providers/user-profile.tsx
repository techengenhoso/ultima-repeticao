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
  getUserName,
  getUserProfile,
  saveUserProfile as persistUserProfile,
  type UserProfile,
  type UserProfileInput,
} from "@/services/user-profile"

interface UserProfileContextValue {
  user: User | null
  profile: UserProfile | null
  isLoading: boolean
  userName: string
  saveProfile: (input: UserProfileInput) => Promise<void>
  refreshProfile: () => Promise<void>
}

const UserProfileContext = createContext<UserProfileContextValue | null>(null)

export function UserProfileProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => auth.currentUser)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refreshProfile = useCallback(async () => {
    const currentUser = auth.currentUser

    if (!currentUser) {
      setProfile(null)
      return
    }

    setProfile(await getUserProfile(currentUser.uid))
  }, [])

  useEffect(
    () =>
      onAuthStateChanged(auth, async currentUser => {
        setUser(currentUser)
        setIsLoading(true)

        try {
          setProfile(currentUser ? await getUserProfile(currentUser.uid) : null)
        } finally {
          setIsLoading(false)
        }
      }),
    []
  )

  const saveProfile = useCallback(
    async (input: UserProfileInput) => {
      if (!user) throw new Error("Usuário não autenticado")
      if (!user.email) throw new Error("E-mail do usuário não encontrado")
      const savedProfile = await persistUserProfile(user.uid, user.email, input)
      setProfile(savedProfile)
    },
    [user]
  )

  const value = useMemo(
    () => ({
      user,
      profile,
      isLoading,
      userName: getUserName(profile?.fullName, user?.displayName),
      saveProfile,
      refreshProfile,
    }),
    [isLoading, profile, refreshProfile, saveProfile, user]
  )

  return (
    <UserProfileContext.Provider value={value}>{children}</UserProfileContext.Provider>
  )
}

export function useUserProfile() {
  const context = useContext(UserProfileContext)
  if (!context) throw new Error("context não encontrado")
  return context
}
