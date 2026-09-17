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
import { WorkoutAiAssistant } from "@/components/workouts/ai/workout-ai-assistant"
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

        <DialogContent className="w-[calc(100%-2rem)] sm:max-w-lg">
          <DialogHeader className="pr-10">
            <DialogTitle>Como deseja criar sua ficha?</DialogTitle>

            <DialogDescription>
              Você pode montar cada dia manualmente ou começar com uma sugestão do agente
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-3 sm:grid-cols-2">
            <Button
              className="h-auto min-h-24 flex-col items-start gap-2 p-4 text-left"
              onClick={createManually}
              type="button"
              variant="outline"
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
              <span>Com ajuda do agente</span>
              <span className="text-xs font-normal leading-tight text-primary-foreground/80">
                <span className="block">Receba uma sugestão</span>
                <span className="block">e ajuste antes de</span>
                <span className="block">salvar</span>
              </span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <WorkoutAiAssistant
        key={user.uid}
        onOpenChange={setAssistantOpen}
        open={assistantOpen}
      />
    </>
  )
}
