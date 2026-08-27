"use client"

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react"
import {
  changePasswordUserRepository,
  onAuthStateChangedUserRepository,
  saveUserRepository,
  signOutUserRepository,
  User,
  type UserEditable,
} from "@/repositories/user-repository"

interface UserContext {
  user: User
  saveUser: (input: UserEditable) => Promise<void>
  changePasswordUser: (currentPassword: string, newPassword: string) => Promise<void>
  signOutUser: () => Promise<void>
}

const UserContext = createContext<UserContext | null>(null)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [, renderUpdatedUser] = useReducer(current => current + 1, 0)

  useEffect(
    () =>
      onAuthStateChangedUserRepository(currentUser => {
        setUser(currentUser)
        setIsLoading(false)
      }),
    []
  )

  const saveUser = useCallback(
    async (data: UserEditable) => {
      if (!user) throw new Error("Usuário não autenticado")
      await saveUserRepository(user, data)
      renderUpdatedUser()
    },
    [user]
  )

  const changePasswordUser = useCallback(
    async (currentPassword: string, newPassword: string) => {
      if (!user) throw new Error("Usuário não autenticado")
      await changePasswordUserRepository(user, currentPassword, newPassword)
    },
    [user]
  )

  if (isLoading || !user) return null

  const value: UserContext = {
    user,
    saveUser,
    changePasswordUser,
    signOutUser: signOutUserRepository,
  }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export function useUser() {
  const context = useContext(UserContext)
  if (!context) throw new Error("UserProvider não encontrado")
  return context
}
