"use client"

import { onAuthStateChanged } from "firebase/auth"
import {
  ActivityIcon,
  ArrowRightIcon,
  BicepsFlexedIcon,
  CalendarCheckIcon,
  FlameIcon,
} from "lucide-react"
import { useEffect, useState } from "react"

import { PageHeader } from "@/components/page-header"
import { SummaryCard } from "@/components/summary-card"
import { Button } from "@/components/ui/button"
import { auth } from "@/lib/firebase"

export default function DashboardPage() {
  const [userName, setUserName] = useState(() => auth.currentUser?.displayName)

  useEffect(
    () =>
      onAuthStateChanged(auth, user => {
        setUserName(user?.displayName ?? null)
      }),
    []
  )

  return (
    <div className="space-y-8">
      <PageHeader
        description="Acompanhe sua rotina e mantenha o foco no próximo treino"
        title={`Olá, ${userName}`}
      />

      <section className="border bg-card p-5 shadow-sm sm:p-7">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-stretch gap-4">
            <span className="flex w-14 shrink-0 items-center justify-center bg-primary text-primary-foreground sm:w-16">
              <BicepsFlexedIcon aria-hidden="true" className="size-7" />
            </span>

            <div>
              <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">
                Treino de hoje
              </p>

              <h2 className="mt-1 text-xl font-bold">Nenhum treino programado</h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Seus treinos aparecerão aqui assim que forem cadastrados
              </p>
            </div>
          </div>

          <Button className="w-full sm:w-auto" disabled size="lg">
            Iniciar treino
            <ArrowRightIcon />
          </Button>
        </div>
      </section>

      <section aria-labelledby="summary-title">
        <h2 className="sr-only" id="summary-title">
          Resumo dos treinos
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <SummaryCard
            description="Você ainda não concluiu treinos"
            icon={CalendarCheckIcon}
            label="Treinos concluídos"
            value="0"
          />

          <SummaryCard
            description="Treine para começar sua sequência"
            icon={FlameIcon}
            label="Sequência de treinos"
            value="0"
          />

          <SummaryCard
            description="Registre treinos para acompanhar seu progresso"
            icon={ActivityIcon}
            label="Evolução recente"
            value="0"
          />

          <SummaryCard
            description="Registre treinos para acompanhar seu progresso"
            icon={ActivityIcon}
            label="Evolução recente"
            value="0"
          />
        </div>
      </section>

      <section
        aria-labelledby="recent-activities-title"
        className="border bg-card shadow-sm"
      >
        <div className="border-b px-5 py-4 sm:px-6">
          <h2 className="text-lg font-bold" id="recent-activities-title">
            Atividades recentes
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Seus últimos treinos e registros
          </p>
        </div>

        <div className="flex min-h-16 flex-col items-center justify-center px-5 py-10 text-center">
          <h3 className="font-semibold">Nenhuma atividade registrada</h3>

          <p className="max-w-sm text-sm text-muted-foreground">
            Quando você concluir um treino, ele será exibido nesta área
          </p>
        </div>
      </section>
    </div>
  )
}
