"use client"

import { DumbbellIcon, InfoIcon, LogOutIcon } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { type ReactNode, useState } from "react"
import { MainNavigation } from "@/components/main-navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { useUser } from "@/contexts/user-context"
import { Logo } from "./logo"

export function AppShell({ children }: { children: ReactNode }) {
  const router = useRouter()
  const { user, signOutUser } = useUser()

  const [isSigningOut, setIsSigningOut] = useState(false)

  async function handleSignOut() {
    setIsSigningOut(true)

    try {
      await signOutUser()
      router.replace("/sign-in")
    } finally {
      setIsSigningOut(false)
    }
  }

  return (
    <div className="min-h-svh bg-muted/30 md:grid md:grid-cols-[16rem_1fr]">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-sidebar-border bg-sidebar text-sidebar-foreground md:flex md:flex-col">
        <Link
          className="flex h-20 items-center gap-3 border-b border-sidebar-border px-6"
          href="/"
        >
          <Logo />

          <span>
            <p className="block text-xs font-semibold tracking-[0.16em] text-primary uppercase">
              Última
            </p>

            <p className="block text-lg font-bold leading-tight uppercase">Repetição</p>
          </span>
        </Link>

        <div className="flex-1 py-5">
          <MainNavigation />
        </div>

        <div className="border-t border-sidebar-border p-4">
          <div className="mb-3 min-w-0 px-2">
            <p className="truncate text-sm font-semibold">
              {user.displayName?.trim() || "Usuário"}
            </p>

            <p className="truncate text-xs text-muted-foreground">{user.email}</p>
          </div>

          <div className="flex w-full min-w-0 gap-2">
            <ThemeToggle />

            <Button aria-label="Suporte" disabled size="icon" variant="outline">
              <InfoIcon />
            </Button>

            <Button
              className="min-w-0 flex-1 shrink px-2"
              disabled={isSigningOut}
              onClick={handleSignOut}
              variant="outline"
            >
              {isSigningOut ? "Saindo" : "Sair da conta"}
            </Button>
          </div>
        </div>
      </aside>

      <div className="min-w-0 md:col-start-2">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-background/95 px-4 backdrop-blur sm:px-6 md:hidden">
          <Link className="flex items-center gap-2" href="/">
            <span className="flex size-9 items-center justify-center bg-primary text-primary-foreground">
              <DumbbellIcon aria-hidden="true" className="size-4" />
            </span>

            <span>
              <p className="block text-xs font-semibold tracking-[0.16em] text-primary uppercase">
                Última
              </p>

              <p className="block text-lg font-bold leading-tight uppercase">Repetição</p>
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <ThemeToggle />

            <Button
              aria-label="Suporte"
              className="md:hidden"
              disabled
              size="icon"
              variant="outline"
            >
              <InfoIcon />
            </Button>

            <Button
              aria-label="Sair da conta"
              className="md:hidden"
              disabled={isSigningOut}
              onClick={handleSignOut}
              size="icon"
              variant="outline"
            >
              <LogOutIcon />
            </Button>
          </div>
        </header>

        <main className="mx-auto w-full max-w-7xl px-4 py-6 pb-24 sm:px-6 md:pb-8 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t bg-background/95 backdrop-blur md:hidden">
        <MainNavigation mobile />
      </div>
    </div>
  )
}
