"use client"

import { createContext, type ReactNode, useContext } from "react"
import type { SessionDraftStore } from "../application/ports/session-draft-store"

const SessionDraftStoreContext = createContext<SessionDraftStore | null>(null)

export function SessionDraftStoreProvider({
  children,
  store,
}: {
  children: ReactNode
  store: SessionDraftStore
}) {
  return (
    <SessionDraftStoreContext.Provider value={store}>
      {children}
    </SessionDraftStoreContext.Provider>
  )
}

export function useSessionDraftStore() {
  const store = useContext(SessionDraftStoreContext)
  if (!store) throw new Error("SessionDraftStoreProvider não encontrado")
  return store
}
