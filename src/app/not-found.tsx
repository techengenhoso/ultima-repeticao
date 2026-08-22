import { ArrowLeftIcon } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"
import { Logo } from "@/components/logo"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Página Nâo Encontrada | Última Repetição",
  description: "Não foi possível encontrar a página desejada, revise o endereço",
}

export default function NotFound() {
  return (
    <main className="relative flex min-h-svh items-center justify-center overflow-hidden bg-background px-4 py-16">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,color-mix(in_oklch,var(--primary)_18%,transparent),transparent_38%)]"
      />

      <div className="absolute right-4 top-4 sm:right-6 sm:top-6">
        <ThemeToggle />
      </div>

      <section className="relative w-full max-w-2xl border border-border bg-card p-6 shadow-2xl shadow-primary/5 sm:p-10">
        <Logo />

        <p className="mt-10 text-xs font-semibold tracking-[0.2em] text-primary uppercase">
          Erro 404
        </p>

        <h1 className="mt-2 max-w-xl text-4xl font-bold tracking-tight sm:text-5xl">
          Esta página não foi encontrada
        </h1>

        <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground sm:text-base">
          O endereço pode estar incorreto ou a página pode ter sido movida. Volte ao início
          para continuar acompanhando seus treinos
        </p>

        <Button asChild className="mt-8" size="lg">
          <Link href="/">
            <ArrowLeftIcon aria-hidden="true" data-icon="inline-start" />
            Voltar ao início
          </Link>
        </Button>
      </section>
    </main>
  )
}
