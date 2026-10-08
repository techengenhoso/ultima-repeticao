"use client"

import { SparklesIcon, SquarePenIcon } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { WorkoutGenerationAssistant } from "@/components/workouts/generator/workout-generation-assistant"
import { useUser } from "@/contexts/user-context"
import { useWorkout } from "@/contexts/workout-context"

export function WorkoutCreateChoice() {
  const { user } = useUser()
  const { isLoading, loadingError, setFormWorkout } = useWorkout()
  const [choiceOpen, setChoiceOpen] = useState(false)
  const [assistantOpen, setAssistantOpen] = useState(false)

  function createManually() {
    setChoiceOpen(false)
    setFormWorkout(null)
  }

  function createWithAssistant() {
    setChoiceOpen(false)
    setAssistantOpen(true)
  }

  return (
    <>
      <Dialog onOpenChange={setChoiceOpen} open={choiceOpen}>
        <DialogTrigger asChild>
          <Button type="button">Nova ficha</Button>
        </DialogTrigger>

        <DialogContent className="max-h-[calc(100dvh-2rem)] sm:max-w-xl">
          <DialogHeader className="pr-12">
            <DialogTitle>Como deseja criar sua ficha?</DialogTitle>

            <DialogDescription>
              Você pode montar cada dia manualmente ou começar com uma sugestão automática
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-3 sm:grid-cols-2">
            <Button
              className="h-auto min-h-24 flex-col items-start gap-2 p-4 text-left"
              onClick={createManually}
              type="button"
              variant="secondary"
            >
              <SquarePenIcon />
              <span>Criar manualmente</span>
              <span className="text-xs font-normal leading-tight text-muted-foreground">
                <span className="block">Monte sua ficha, dia</span>
                <span className="block">por dia, no seu</span>
                <span className="block">ritmo</span>
              </span>
            </Button>

            <Button
              className="h-auto min-h-24 flex-col items-start gap-2 p-4 text-left"
              disabled={isLoading || loadingError}
              onClick={createWithAssistant}
              type="button"
            >
              <SparklesIcon />
              <span>Montar automaticamente</span>
              <span className="text-xs font-normal leading-tight text-primary-foreground/80">
                <span className="block">Receba uma sugestão baseada</span>
                <span className="block">nas suas preferências</span>
                <span className="block">e ajuste antes de salvar</span>
              </span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <WorkoutGenerationAssistant
        key={user.uid}
        onOpenChange={setAssistantOpen}
        open={assistantOpen}
      />
    </>
  )
}
