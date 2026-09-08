"use client"

import type { ReactNode } from "react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { cn } from "@/lib/utils"
import type { AssessmentGroup } from "@/modules/body-assessments/presentation/fields"

type AssessmentGroupPanel = {
  key: AssessmentGroup
  label: string
  measureCount: number
}

export function BodyAssessmentGroupsAccordion({
  className,
  groups,
  renderContent,
}: {
  className?: string
  groups: AssessmentGroupPanel[]
  renderContent: (group: AssessmentGroup) => ReactNode
}) {
  if (!groups.length) return null

  return (
    <Accordion
      className={cn("gap-3", className)}
      collapsible
      defaultValue={groups[0].key}
      type="single"
    >
      {groups.map((group, index) => (
        <AccordionItem
          className="border data-[state=open]:border-l-2 data-[state=open]:border-l-primary"
          key={group.key}
          value={group.key}
        >
          <AccordionTrigger className="items-center bg-muted/50 px-4 py-3 hover:no-underline">
            <span className="flex min-w-0 items-center gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center bg-primary text-sm font-bold text-primary-foreground">
                {index + 1}
              </span>
              <span className="flex min-w-0 flex-col gap-0.5">
                <span>{group.label}</span>
                <span className="text-xs font-normal text-muted-foreground">
                  {group.measureCount} medidas
                </span>
              </span>
            </span>
          </AccordionTrigger>
          <AccordionContent className="h-auto border-t bg-card px-4 pt-4">
            {renderContent(group.key)}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
