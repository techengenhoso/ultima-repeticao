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
import type {
  AuthenticatedUser,
  UserEditable,
} from "@/modules/users/domain/authenticated-user"
import { useAuthenticationUseCases } from "@/modules/users/presentation/authentication-use-cases-context"

function useUserState() {
  const authentication = useAuthenticationUseCases()
  const [user, setUser] = useState<AuthenticatedUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [, renderUpdatedUser] = useReducer(current => current + 1, 0)

  useEffect(
    () =>
      authentication.observe(currentUser => {
        setUser(currentUser)
        setIsLoading(false)
      }),
    [authentication]
  )

  const saveUser = useCallback(
    async (data: UserEditable) => {
      if (!user) throw new Error("Usuário não autenticado")
      await authentication.updateUser(user, data)
      renderUpdatedUser()
    },
    [authentication, user]
  )

  const changePasswordUser = useCallback(
    async (currentPassword: string, newPassword: string) => {
      if (!user) throw new Error("Usuário não autenticado")
      await authentication.changePassword(user, currentPassword, newPassword)
    },
    [authentication, user]
  )

  if (isLoading || !user) return null

  return {
    user,
    saveUser,
    changePasswordUser,
    signOutUser: authentication.signOut,
    deleteAccountUser: authentication.deleteAccount,
  }
}

type UserContext = NonNullable<ReturnType<typeof useUserState>>

const UserContext = createContext<UserContext | null>(null)

export function UserProvider({ children }: { children: ReactNode }) {
  const value = useUserState()

  if (!value) return null

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export function useUser() {
  const context = useContext(UserContext)
  if (!context) throw new Error("UserProvider não encontrado")
  return context
}
