"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useExercise } from "@/contexts/exercise-context"
import {
  exerciseDifficultyLabel,
  muscleGroupLabel,
  muscleLabel,
} from "@/modules/exercises/domain/exercise"
import { DetailSection } from "./exercise-detail-section"

const preventOutsideDismissal = (event: { preventDefault: () => void }) =>
  event.preventDefault()

export function ExerciseDetails() {
  const { details: exercise, setDetails: onClose } = useExercise()

  const sections = exercise
    ? [
        {
          content: (
            <dl className="grid gap-5 sm:grid-cols-2">
              <DetailSection
                title="Grupo principal"
                value={muscleGroupLabel[exercise.muscleGroup]}
              />

              <DetailSection
                title="Músculos principais"
                value={exercise.primaryMuscles
                  .map(muscle => muscleLabel[muscle] ?? muscle)
                  .join(", ")}
              />

              <DetailSection
                title="Músculos secundários"
                value={exercise.secondaryMuscles
                  .map(muscle => muscleLabel[muscle] ?? muscle)
                  .join(", ")}
              />

              <DetailSection
                title="Dificuldade"
                value={exerciseDifficultyLabel[exercise.difficulty]}
              />
            </dl>
          ),
          detailCount: "4 informações",
          key: "general",
          label: "Informações gerais",
        },
        {
          content: (
            <dl className="space-y-5">
              <DetailSection
                title="Padrão de movimento"
                value={exercise.movementPattern}
              />

              <DetailSection title="Posição inicial" value={exercise.startingPosition} />

              <DetailSection
                title="Execução do movimento"
                value={exercise.movementExecution}
              />
            </dl>
          ),
          detailCount: "3 instruções",
          key: "movement",
          label: "Movimento",
        },
        {
          content: (
            <dl>
              <DetailSection
                title="Cuidados importantes"
                value={exercise.importantCautions}
              />
            </dl>
          ),
          detailCount: "1 orientação",
          key: "cautions",
          label: "Cuidados",
        },
      ]
    : []

  return (
    <Dialog onOpenChange={open => !open && onClose(null)} open={!!exercise}>
      <DialogContent
        className="flex max-h-[calc(100dvh-2rem)] min-w-0 flex-col gap-4 overflow-hidden px-4 py-8 sm:max-w-xl sm:px-6 sm:py-8"
        onPointerDownOutside={preventOutsideDismissal}
      >
        <DialogHeader>
          <DialogTitle className="pr-10 normal-case tracking-normal">
            {exercise?.name}
          </DialogTitle>

          <DialogDescription>
            {exercise?.source === "default"
              ? "Exercício padrão"
              : "Exercício personalizado"}
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-0 overflow-y-auto overscroll-contain">
          <Accordion className="gap-3" collapsible defaultValue="general" type="single">
            {sections.map((section, index) => (
              <AccordionItem
                className="border border-l-2 border-l-primary"
                key={section.key}
                value={section.key}
              >
                <AccordionTrigger className="items-center bg-muted/50 px-4 py-3 hover:no-underline">
                  <span className="flex min-w-0 items-center gap-3">
                    <span className="flex size-9 shrink-0 items-center justify-center bg-primary text-sm font-bold text-primary-foreground">
                      {index + 1}
                    </span>
                    <span className="flex min-w-0 flex-col gap-0.5">
                      <span>{section.label}</span>
                      <span className="text-xs font-normal text-muted-foreground">
                        {section.detailCount}
                      </span>
                    </span>
                  </span>
                </AccordionTrigger>

                <AccordionContent className="h-auto border-t bg-card px-4 pt-4">
                  {section.content}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </DialogContent>
    </Dialog>
  )
}
