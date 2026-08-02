"use client"

import { onAuthStateChanged } from "firebase/auth"
import { DumbbellIcon } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { type ReactNode, useEffect, useState } from "react"

import { auth } from "@/lib/firebase"
import { Bluer } from "./bluer"

const publicRoutes = new Set(["/sign-up", "/sign-in", "/forgot-password"])

const minimumLoadingTime = 30000

export function AuthGuard({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  const [isCheckingAuthentication, setIsCheckingAuthentication] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [hasMinimumLoadingTimeElapsed, setHasMinimumLoadingTimeElapsed] = useState(false)

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setHasMinimumLoadingTimeElapsed(true)
    }, minimumLoadingTime)

    return () => window.clearTimeout(timeout)
  }, [])

  useEffect(() => {
    return onAuthStateChanged(auth, user => {
      setIsAuthenticated(Boolean(user))
      setIsCheckingAuthentication(false)
    })
  }, [])

  useEffect(() => {
    if (isCheckingAuthentication || !hasMinimumLoadingTimeElapsed) {
      return
    }

    const isPublicRoute = publicRoutes.has(pathname)

    if (!isAuthenticated && !isPublicRoute) {
      router.replace("/sign-in")
      return
    }

    if (isAuthenticated && isPublicRoute) {
      router.replace("/")
    }
  }, [
    hasMinimumLoadingTimeElapsed,
    isAuthenticated,
    isCheckingAuthentication,
    pathname,
    router,
  ])

  const isPublicRoute = publicRoutes.has(pathname)
  const canRender = isAuthenticated ? !isPublicRoute : isPublicRoute

  if (isCheckingAuthentication || !hasMinimumLoadingTimeElapsed || !canRender) {
    return (
      <main className="relative flex min-h-svh items-center justify-center overflow-hidden bg-background px-6">
        <Bluer />

        <div
          aria-hidden="true"
          className="absolute -right-24 -bottom-24 size-72 border border-primary/10"
        />

        <output
          aria-live="polite"
          className="relative flex w-full max-w-sm flex-col items-center text-center"
        >
          <div className="relative mb-8 flex size-20 items-center justify-center">
            <div className="absolute inset-0 animate-ping bg-primary/10" />

            <div className="relative flex size-16 items-center justify-center bg-primary text-primary-foreground shadow-xl shadow-primary/20">
              <DumbbellIcon aria-hidden="true" className="size-7" />
            </div>
          </div>

          <p className="text-xs font-semibold tracking-[0.25em] text-primary uppercase">
            Última Repetição
          </p>

          <h1 className="mt-3 text-2xl font-bold tracking-tight">Preparando seu treino</h1>

          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Estamos organizando tudo para você continuar evoluindo
          </p>

          <div aria-hidden="true" className="mt-8 flex items-end justify-center gap-1.5">
            <span className="h-3 w-1.5 animate-pulse bg-primary/40" />
            <span className="h-5 w-1.5 animate-pulse bg-primary/70 [animation-delay:150ms]" />
            <span className="h-7 w-1.5 animate-pulse bg-primary [animation-delay:300ms]" />
            <span className="h-5 w-1.5 animate-pulse bg-primary/70 [animation-delay:450ms]" />
            <span className="h-3 w-1.5 animate-pulse bg-primary/40 [animation-delay:600ms]" />
          </div>

          <span className="sr-only">Verificando autenticação</span>
        </output>
      </main>
    )
  }

  return children
}
