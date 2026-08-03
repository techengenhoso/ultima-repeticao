import type { Metadata } from "next"
import Link from "next/link"
import { Blur } from "@/components/blur"
import { Logo } from "@/components/logo"
import { ThemeToggle } from "@/components/theme-toggle"
import { SignUpForm } from "./sign-up-form"

export const metadata: Metadata = {
  title: "Criar Conta | Última Repetição",
  description: "Crie sua conta para acompanhar seus treinos e sua evolução",
}

export default function SignupPage() {
  return (
    <main className="relative flex min-h-svh items-center justify-center overflow-hidden bg-background px-4 py-16">
      <Blur />

      <div className="absolute right-4 top-4 sm:right-6 sm:top-6">
        <ThemeToggle />
      </div>

      <section className="relative w-full max-w-md border border-border bg-card p-6 shadow-2xl shadow-primary/5 sm:p-10">
        <div className="mb-8">
          <Logo />

          <p className="mb-2 mt-6 text-xs font-semibold tracking-[0.2em] text-primary uppercase">
            Última Repetição
          </p>

          <h1 className="text-3xl font-bold tracking-tight">Crie sua conta</h1>

          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Comece agora a acompanhar seus treinos e sua evolução
          </p>
        </div>

        <SignUpForm />

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Já possui uma conta?{" "}
          <Link
            className="font-semibold text-primary underline-offset-4 hover:underline"
            href="/sign-in"
          >
            Entrar
          </Link>
        </p>
      </section>
    </main>
  )
}
