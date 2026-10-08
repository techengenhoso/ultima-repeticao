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
import { ItemGroup } from "@/components/ui/item"
import { useExercise } from "@/contexts/exercise-context"
import {
  exerciseDifficultyLabel,
  muscleGroupLabel,
  muscleLabel,
} from "@/modules/exercises/domain/exercise"
import { DetailSection } from "./exercise-detail-section"

export function ExerciseDetails() {
  const { details: exercise, setDetails: onClose } = useExercise()

  const sections = exercise
    ? [
        {
          content: (
            <ItemGroup className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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
            </ItemGroup>
          ),
          detailCount: "4 informações",
          key: "general",
          label: "Informações gerais",
        },
        {
          content: (
            <ItemGroup>
              <DetailSection
                title="Padrão de movimento"
                value={exercise.movementPattern}
              />

              <DetailSection title="Posição inicial" value={exercise.startingPosition} />

              <DetailSection
                title="Execução do movimento"
                value={exercise.movementExecution}
              />
            </ItemGroup>
          ),
          detailCount: "3 instruções",
          key: "movement",
          label: "Movimento",
        },
        {
          content: (
            <ItemGroup>
              <DetailSection
                title="Cuidados importantes"
                value={exercise.importantCautions}
              />
            </ItemGroup>
          ),
          detailCount: "1 orientação",
          key: "cautions",
          label: "Cuidados",
        },
      ]
    : []

  return (
    <Dialog onOpenChange={open => !open && onClose(null)} open={!!exercise}>
      <DialogContent className="max-h-[calc(100dvh-2rem)] sm:max-w-xl">
        <DialogHeader className="pr-12">
          <DialogTitle>{exercise?.name}</DialogTitle>

          <DialogDescription>
            {exercise?.source === "default"
              ? "Exercício padrão"
              : "Exercício personalizado"}
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-0 overflow-y-auto overscroll-contain">
          <Accordion collapsible defaultValue="general" type="single">
            {sections.map((section, index) => (
              <AccordionItem
                className="data-open:bg-card"
                key={section.key}
                value={section.key}
              >
                <AccordionTrigger className="items-center bg-muted/50 px-4 py-4 hover:bg-muted hover:no-underline aria-expanded:bg-muted">
                  <span className="flex min-w-0 items-center gap-3">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground">
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

                <AccordionContent className="h-auto pt-4">
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
