import type { Metadata } from "next"
import Link from "next/link"
import { Bluer } from "@/components/bluer"
import { Logo } from "@/components/logo"
import { ThemeToggle } from "@/components/theme-toggle"
import { SignInForm } from "./sign-in-form"

export const metadata: Metadata = {
  title: "Entrar | Última Repetição",
  description: "Entre na sua conta para acompanhar seus treinos e sua evolução",
}

export default function SignInPage() {
  return (
    <main className="relative flex min-h-svh items-center justify-center overflow-hidden bg-background px-4 py-16">
      <Bluer />

      <div className="absolute right-4 top-4 sm:right-6 sm:top-6">
        <ThemeToggle />
      </div>

      <section className="relative w-full max-w-md border border-border bg-card p-6 shadow-2xl shadow-primary/5 sm:p-10">
        <div className="mb-8">
          <Logo />

          <p className="mb-2 mt-6 text-xs font-semibold tracking-[0.2em] text-primary uppercase">
            Última Repetição
          </p>

          <h1 className="text-3xl font-bold tracking-tight">Bem-vindo de volta</h1>

          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Entre para continuar acompanhando seus treinos e sua evolução
          </p>
        </div>

        <SignInForm />

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Ainda não tem uma conta?{" "}
          <Link
            className="font-semibold text-primary underline-offset-4 hover:underline"
            href="/sign-up"
          >
            Criar conta
          </Link>
        </p>
      </section>
    </main>
  )
}
