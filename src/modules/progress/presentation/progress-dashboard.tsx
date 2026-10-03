"use client"

import { ActivityIcon, DumbbellIcon } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BodyAssessmentsSection } from "./body-assessments/body-assessments-section"
import { PerformancePanel } from "./performance/performance-panel"
import { WorkoutPerformancePanel } from "./performance/workout-performance-panel"

export function ProgressDashboard() {
  return (
    <div className="space-y-6">
      <PageHeader
        description="Acompanhe suas avaliações corporais e o desempenho dos seus treinos"
        title="Evolução"
      />

      <Tabs defaultValue="body">
        <TabsList
          className="grid w-full grid-cols-3 gap-1 rounded-3xl bg-muted p-1 data-[variant=line]:rounded-3xl data-[variant=line]:bg-muted group-data-horizontal/tabs:h-auto"
          variant="line"
        >
          <TabsTrigger
            aria-label="Avaliação corporal"
            className="h-auto min-w-0 flex-col gap-1 rounded-2xl px-2 py-2 text-center text-xs font-medium tracking-normal normal-case whitespace-normal after:hidden group-data-[variant=line]/tabs-list:data-active:bg-background group-data-[variant=line]/tabs-list:data-active:text-foreground"
            value="body"
          >
            <ActivityIcon aria-hidden="true" className="size-4" />
            Corporal
          </TabsTrigger>

          <TabsTrigger
            aria-label="Desempenho dos exercícios"
            className="h-auto min-w-0 flex-col gap-1 rounded-2xl px-2 py-2 text-center text-xs font-medium tracking-normal normal-case whitespace-normal after:hidden group-data-[variant=line]/tabs-list:data-active:bg-background group-data-[variant=line]/tabs-list:data-active:text-foreground"
            value="performance"
          >
            <DumbbellIcon aria-hidden="true" className="size-4" />
            Exercícios
          </TabsTrigger>

          <TabsTrigger
            aria-label="Desempenho dos treinos"
            className="h-auto min-w-0 flex-col gap-1 rounded-2xl px-2 py-2 text-center text-xs font-medium tracking-normal normal-case whitespace-normal after:hidden group-data-[variant=line]/tabs-list:data-active:bg-background group-data-[variant=line]/tabs-list:data-active:text-foreground"
            value="workouts"
          >
            <DumbbellIcon aria-hidden="true" className="size-4" />
            Treinos
          </TabsTrigger>
        </TabsList>

        <TabsContent className="pt-6" value="body">
          <BodyAssessmentsSection />
        </TabsContent>

        <TabsContent className="pt-6" value="performance">
          <PerformancePanel />
        </TabsContent>

        <TabsContent className="pt-6" value="workouts">
          <WorkoutPerformancePanel />
        </TabsContent>
      </Tabs>
    </div>
  )
}
