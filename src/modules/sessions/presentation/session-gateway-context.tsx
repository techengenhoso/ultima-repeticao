"use client"

import { createContext, type ReactNode, useContext } from "react"
import type { SessionGateway } from "../application/ports/session-gateway"

const SessionGatewayContext = createContext<SessionGateway | null>(null)

export function SessionGatewayProvider({
  children,
  gateway,
}: {
  children: ReactNode
  gateway: SessionGateway
}) {
  return (
    <SessionGatewayContext.Provider value={gateway}>
      {children}
    </SessionGatewayContext.Provider>
  )
}

export function useSessionGateway() {
  const gateway = useContext(SessionGatewayContext)
  if (!gateway) throw new Error("SessionGatewayProvider não encontrado")
  return gateway
}
