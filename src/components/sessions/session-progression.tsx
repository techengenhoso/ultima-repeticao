"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { CheckIcon, LoaderCircleIcon } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import {
  type IncrementSettings,
  type LoadSuggestion,
  loadSchema,
  type SessionExercise,
  type WorkoutSession,
} from "@/modules/sessions/domain/session"
import { useSessionGateway } from "@/modules/sessions/presentation/session-gateway-context"

type SuggestionResult = Awaited<
  ReturnType<ReturnType<typeof useSessionGateway>["suggest"]>
>

const customLoadFormSchema = z.object({
  customLoad: loadSchema,
  customRepetitions: z.number().int().min(1).max(100),
})

type CustomLoadForm = z.infer<typeof customLoadFormSchema>

const defaultIncrementSettings: IncrementSettings = {
  percentage: 2.5,
  roundingStep: 0.5,
}

const labels = {
  increase: "Aumento sugerido",
  increaseRepetitions: "Mais repetições sugeridas",
  maintain: "Manutenção sugerida",
  decrease: "Redução sugerida",
  insufficientData: "Dados insuficientes",
}

function loadForDecision(
  choice: "accept" | "maintain" | "custom",
  suggestion: LoadSuggestion,
  customLoad?: number
) {
  if (choice === "custom") return customLoad
  if (choice === "maintain") return suggestion.currentLoad
  return suggestion.suggestedLoad ?? suggestion.currentLoad
}

function RecordedLoadDecision({ exercise }: { exercise: SessionExercise }) {
  const decision = exercise.decision
  if (!decision) return null

  return (
    <section aria-label="Próxima carga registrada" className="space-y-5">
      <Card className="bg-muted/40 shadow-none ring-0" size="sm">
        <CardContent>
          <Item className="p-0" size="sm">
            <ItemMedia className="bg-primary text-primary-foreground" variant="image">
              <CheckIcon aria-hidden="true" />
            </ItemMedia>

            <ItemContent>
              <Badge>Progressão concluída</Badge>

              <ItemTitle className="mt-1 text-lg">Próxima carga definida</ItemTitle>

              <ItemDescription>
                Esta decisão será usada como referência no próximo treino
              </ItemDescription>
            </ItemContent>
          </Item>
        </CardContent>
      </Card>

      <ItemGroup className="grid gap-3 sm:grid-cols-2">
        <Item variant="muted">
          <ItemContent>
            <ItemDescription>Carga definida</ItemDescription>

            <ItemTitle className="mt-1 text-2xl tabular-nums">
              {decision.load} kg
            </ItemTitle>
          </ItemContent>
        </Item>

        <Item variant="muted">
          <ItemContent>
            <ItemDescription>Repetição definida</ItemDescription>

            <ItemTitle className="mt-1 text-2xl tabular-nums">
              {decision.repetitions ?? "Sem alteração"}
            </ItemTitle>
          </ItemContent>
        </Item>
      </ItemGroup>
    </section>
  )
}

function SuggestionResult({
  canDecide,
  suggestion,
  targetSets,
}: {
  canDecide: boolean
  suggestion: LoadSuggestion
  targetSets: number
}) {
  return (
    <div aria-live="polite" className="space-y-5">
      <Card className="bg-muted/40 shadow-none ring-0" size="sm">
        <CardContent>
          <Item className="p-0" size="sm">
            <ItemMedia className="bg-primary text-primary-foreground" variant="image">
              <span className="text-lg font-semibold">+</span>
            </ItemMedia>

            <ItemContent>
              <Badge>{labels[suggestion.action]}</Badge>

              <ItemTitle className="mt-1 text-lg">
                Sugestão para o próximo treino
              </ItemTitle>

              <ItemDescription>{suggestion.reason}</ItemDescription>
            </ItemContent>
          </Item>
        </CardContent>
      </Card>

      {!canDecide && (
        <p className="text-sm">
          A decisão deve ser registrada no treino concluído mais recente
        </p>
      )}

      {suggestion.action === "increaseRepetitions" ? (
        <Item variant="muted">
          <ItemContent>
            <ItemDescription>Próximo treino</ItemDescription>
            <ItemTitle className="mt-1 line-clamp-none">
              {targetSets} séries de {suggestion.suggestedRepetitions} repetições com{" "}
              {suggestion.currentLoad} kg
            </ItemTitle>
          </ItemContent>
        </Item>
      ) : (
        <ItemGroup className="grid gap-3 sm:grid-cols-2">
          <Item variant="muted">
            <ItemContent>
              <ItemDescription>Carga atual</ItemDescription>
              <ItemTitle className="mt-1 text-xl tabular-nums">
                {suggestion.basedOnSessionIds.length
                  ? `${suggestion.currentLoad} kg`
                  : "A definir"}
              </ItemTitle>
            </ItemContent>
          </Item>
          <Item variant="muted">
            <ItemContent>
              <ItemDescription>Nova carga</ItemDescription>
              <ItemTitle className="mt-1 text-xl tabular-nums">
                {suggestion.suggestedLoad !== undefined
                  ? `${suggestion.suggestedLoad} kg`
                  : "A definir"}
              </ItemTitle>
            </ItemContent>
          </Item>
        </ItemGroup>
      )}
    </div>
  )
}

function NewLoadProgression({
  session,
  index,
  onClose,
  onUpdated,
  prefetchedSuggestion,
}: {
  session: WorkoutSession
  index: number
  onClose: () => void
  onUpdated: (session: WorkoutSession) => void
  prefetchedSuggestion?: SuggestionResult
}) {
  const gateway = useSessionGateway()
  const exercise = session.exercises[index]
  const latestSet = exercise?.sets.filter(set => set.completed && !set.warmup).at(-1)
  const form = useForm<z.input<typeof customLoadFormSchema>, unknown, CustomLoadForm>({
    resolver: zodResolver(customLoadFormSchema),
    defaultValues: {
      customLoad: latestSet?.load ?? 0,
      customRepetitions: latestSet?.performedRepetitions ?? 1,
    },
  })
  const [result, setResult] = useState<SuggestionResult | null>(
    prefetchedSuggestion ?? null
  )
  const [pending, setPending] = useState(false)
  const [customDialogOpen, setCustomDialogOpen] = useState(false)
  const lock = useRef(false)
  const settings = exercise?.incrementSettings ?? defaultIncrementSettings

  useEffect(() => {
    if (prefetchedSuggestion) {
      setResult(prefetchedSuggestion)
      setPending(false)
      return
    }
    let current = true
    setPending(true)
    gateway
      .suggest({
        action: "suggest",
        id: session.id,
        exerciseIndex: index,
        settings,
      })
      .then(value => {
        if (current) setResult(value)
      })
      .catch(failure => {
        if (current)
          toast.error(
            failure instanceof Error
              ? failure.message
              : "Não foi possível calcular a sugestão"
          )
      })
      .finally(() => {
        if (current) setPending(false)
      })
    return () => {
      current = false
    }
  }, [session.id, index, gateway.suggest, prefetchedSuggestion, settings])

  async function decide(
    choice: "accept" | "maintain" | "custom",
    custom?: CustomLoadForm
  ) {
    if (lock.current || pending || !result) return
    const load = loadForDecision(choice, result.suggestion, custom?.customLoad)
    if (load === undefined) return
    lock.current = true
    setPending(true)
    try {
      const saved = await gateway.mutate({
        action: "decide",
        id: session.id,
        version: session.version,
        exerciseIndex: index,
        choice,
        settings,
        load,
        repetitions: custom?.customRepetitions,
      })
      onUpdated(saved)
      if (choice === "custom") setCustomDialogOpen(false)
      onClose()
      toast.success("Decisão de carga salva")
    } catch (failure) {
      toast.error(
        failure instanceof Error ? failure.message : "Não foi possível salvar a decisão"
      )
    } finally {
      lock.current = false
      setPending(false)
    }
  }

  const suggestion = result?.suggestion
  const canDecide = result?.latestSessionId === session.id
  const canSaveSuggestion = canDecide && suggestion?.action !== "insufficientData"

  function openCustomDialog() {
    if (!suggestion) return
    form.reset({
      customLoad: suggestion.suggestedLoad ?? suggestion.currentLoad,
      customRepetitions:
        suggestion.suggestedRepetitions ?? latestSet?.performedRepetitions ?? 1,
    })
    setCustomDialogOpen(true)
  }

  return (
    <div>
      {suggestion && exercise && (
        <>
          <SuggestionResult
            canDecide={canDecide}
            suggestion={suggestion}
            targetSets={exercise.targetSets}
          />

          <DialogFooter className="mt-6">
            <Button disabled={pending} onClick={onClose} type="button" variant="secondary">
              Cancelar
            </Button>

            <Button
              disabled={pending || !canDecide}
              onClick={openCustomDialog}
              type="button"
              variant="secondary"
            >
              Alterar
            </Button>

            <Button
              disabled={pending || !canSaveSuggestion}
              onClick={() => void decide("accept")}
              type="button"
            >
              {pending && <LoaderCircleIcon className="animate-spin" />}
              {pending ? "Salvando" : "Salvar"}
            </Button>
          </DialogFooter>
        </>
      )}

      <Dialog onOpenChange={setCustomDialogOpen} open={customDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Progressão manual</DialogTitle>

            <DialogDescription>
              Informe a carga e as repetições desejadas para utilizar como progressão do
              exercício
            </DialogDescription>
          </DialogHeader>

          <form
            className="space-y-5"
            onSubmit={form.handleSubmit(values => void decide("custom", values))}
          >
            <Field>
              <FieldLabel htmlFor={`custom-load-${index}`}>Carga</FieldLabel>

              <Input
                disabled={pending}
                id={`custom-load-${index}`}
                inputMode="decimal"
                step={1}
                type="number"
                {...form.register("customLoad", { valueAsNumber: true })}
              />
              <FieldError errors={[form.formState.errors.customLoad]} />
            </Field>

            <Field>
              <FieldLabel htmlFor={`custom-repetitions-${index}`}>Repetições</FieldLabel>

              <Input
                disabled={pending}
                id={`custom-repetitions-${index}`}
                inputMode="numeric"
                step={1}
                type="number"
                {...form.register("customRepetitions", { valueAsNumber: true })}
              />
              <FieldError errors={[form.formState.errors.customRepetitions]} />
            </Field>

            <DialogFooter>
              <Button
                disabled={pending}
                onClick={() => setCustomDialogOpen(false)}
                type="button"
                variant="secondary"
              >
                Cancelar
              </Button>

              <Button disabled={pending} type="submit">
                {pending && <LoaderCircleIcon className="animate-spin" />}
                {pending ? "Salvando" : "Salvar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export function SessionProgression({
  session,
  index,
  onClose,
  onUpdated,
  prefetchedSuggestion,
}: {
  session: WorkoutSession
  index: number
  onClose: () => void
  onUpdated: (session: WorkoutSession) => void
  prefetchedSuggestion?: SuggestionResult
}) {
  const exercise = session.exercises[index]

  if (!exercise) return null

  if (exercise.decision) return <RecordedLoadDecision exercise={exercise} />

  return (
    <NewLoadProgression
      index={index}
      onClose={onClose}
      onUpdated={onUpdated}
      prefetchedSuggestion={prefetchedSuggestion}
      session={session}
    />
  )
}
