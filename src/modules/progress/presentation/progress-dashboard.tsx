"use client"

import { ActivityIcon, DumbbellIcon } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BodyAssessmentsSection } from "./body-assessments/body-assessments-section"
import { PerformancePanel } from "./performance/performance-panel"

export function ProgressDashboard() {
  return (
    <div className="space-y-6">
      <PageHeader
        description="Acompanhe suas avaliações corporais e seu desempenho nos treinos"
        title="Evolução"
      />
      <Tabs defaultValue="body">
        <TabsList
          className="h-auto w-full justify-start gap-6 border-b bg-transparent p-0"
          variant="line"
        >
          <TabsTrigger
            className="h-auto flex-none px-0 py-3 text-sm font-medium tracking-normal normal-case after:hidden data-active:!text-primary"
            value="body"
          >
            <ActivityIcon aria-hidden="true" className="size-4" />
            Avaliação corporal
          </TabsTrigger>
          <TabsTrigger
            className="h-auto flex-none px-0 py-3 text-sm font-medium tracking-normal normal-case after:hidden data-active:!text-primary"
            value="performance"
          >
            <DumbbellIcon aria-hidden="true" className="size-4" />
            Desempenho nos treinos
          </TabsTrigger>
        </TabsList>
        <TabsContent className="pt-6" value="body">
          <BodyAssessmentsSection />
        </TabsContent>
        <TabsContent className="pt-6" value="performance">
          <PerformancePanel />
        </TabsContent>
      </Tabs>
    </div>
  )
}
