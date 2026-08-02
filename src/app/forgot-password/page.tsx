import { ArrowLeftIcon } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"
import { Bluer } from "@/components/bluer"
import { Logo } from "@/components/logo"
import { ThemeToggle } from "@/components/theme-toggle"
import { ForgotPasswordForm } from "./forgot-password-form"

export const metadata: Metadata = {
  title: "Recuperar Senha | Última Repetição",
  description: "Receba por e-mail as instruções para redefinir sua senha",
}

export default function ForgotPasswordPage() {
  return (
    <main className="relative flex min-h-svh items-center justify-center overflow-hidden bg-background px-4 py-16">
      <Bluer />

      <div className="absolute right-4 top-4 sm:right-6 sm:top-6">
        <ThemeToggle />
      </div>

      <section className="relative w-full max-w-md border border-border bg-card p-6 shadow-2xl shadow-primary/5 sm:p-10">
        <Link
          className="mb-6 inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase transition-colors hover:text-foreground"
          href="/sign-in"
        >
          <ArrowLeftIcon aria-hidden="true" className="size-3.5" />
          Voltar
        </Link>

        <div className="mb-8">
          <Logo />

          <p className="mb-2 mt-6 text-xs font-semibold tracking-[0.2em] text-primary uppercase">
            Última Repetição
          </p>

          <h1 className="text-3xl font-bold tracking-tight">Recupere sua senha</h1>

          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Informe o e-mail da sua conta para receber as instruções de redefinição
          </p>
        </div>

        <ForgotPasswordForm />
      </section>
    </main>
  )
}
