"use client"

import type { ReactNode } from "react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { ScrollArea } from "@/components/ui/scroll-area"
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
  scrollContent = false,
}: {
  className?: string
  groups: AssessmentGroupPanel[]
  renderContent: (group: AssessmentGroup) => ReactNode
  scrollContent?: boolean
}) {
  if (!groups.length) return null

  return (
    <Accordion
      className={className}
      collapsible
      defaultValue={groups[0].key}
      type="single"
    >
      {groups.map((group, index) => (
        <AccordionItem className="data-open:bg-card" key={group.key} value={group.key}>
          <AccordionTrigger className="items-center bg-muted/50 px-4 py-4 hover:bg-muted hover:no-underline aria-expanded:bg-muted">
            <span className="flex min-w-0 items-center gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground">
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
          <AccordionContent className="h-auto pt-4">
            {scrollContent ? (
              <ScrollArea className="h-fit max-h-[min(24rem,calc(100dvh-24rem))] [&_[data-slot=scroll-area-viewport]]:max-h-[inherit]">
                {renderContent(group.key)}
              </ScrollArea>
            ) : (
              renderContent(group.key)
            )}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
