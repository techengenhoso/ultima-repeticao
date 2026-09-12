"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { exerciseHistory } from "@/modules/sessions/domain/progression"
import {
  incrementSchema,
  type LoadSuggestion,
  loadSchema,
  type WorkoutSession,
} from "@/modules/sessions/domain/session"
import { useSessionGateway } from "@/modules/sessions/presentation/session-gateway-context"

const settingsFormSchema = incrementSchema.extend({ customLoad: loadSchema })
type SettingsForm = z.infer<typeof settingsFormSchema>
const labels = {
  increase: "Aumento sugerido",
  maintain: "Manutenção sugerida",
  decrease: "Redução sugerida",
  insufficientData: "Dados insuficientes para progredir",
}

export function SessionProgression({
  session,
  index,
  onUpdated,
}: {
  session: WorkoutSession
  index: number
  onUpdated: (session: WorkoutSession) => void
}) {
  const gateway = useSessionGateway()
  const exercise = session.exercises[index]
  const form = useForm<z.input<typeof settingsFormSchema>, unknown, SettingsForm>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: {
      percentage: 2.5,
      roundingStep: 0.5,
      ...exercise.incrementSettings,
      ...exercise.decision?.settings,
      customLoad:
        exercise.decision?.load ??
        exercise.sets.filter(set => set.completed && !set.warmup).at(-1)?.load ??
        0,
    },
  })
  const [result, setResult] = useState<{
    suggestion: LoadSuggestion
    history: WorkoutSession[]
  } | null>(null)
  const [error, setError] = useState("")
  const [pending, setPending] = useState(false)
  const lock = useRef(false)
  const requestNumber = useRef(0)
  const initialSettings = useRef(
    exercise.decision?.settings ??
      exercise.incrementSettings ?? { percentage: 2.5, roundingStep: 0.5 }
  )
  useEffect(() => {
    let current = true
    setPending(true)
    gateway
      .suggest({
        action: "suggest",
        id: session.id,
        exerciseIndex: index,
        settings: initialSettings.current,
      })
      .then(value => {
        if (current) setResult(value)
      })
      .catch(failure => {
        if (current)
          setError(
            failure instanceof Error
              ? failure.message
              : "Não foi possível consultar o histórico"
          )
      })
      .finally(() => {
        if (current) setPending(false)
      })
    return () => {
      current = false
    }
  }, [session.id, index, gateway.suggest])

  async function calculate(values: SettingsForm) {
    const sequence = ++requestNumber.current
    setPending(true)
    setError("")
    try {
      const { customLoad: _custom, ...settings } = values
      const value = await gateway.suggest({
        action: "suggest",
        id: session.id,
        exerciseIndex: index,
        settings,
      })
      if (sequence === requestNumber.current) setResult(value)
      const saved = value.history.find(item => item.id === session.id)
      if (saved && saved.version !== session.version) onUpdated(saved)
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "Não foi possível calcular")
    } finally {
      setPending(false)
    }
  }
  async function decide(choice: "accept" | "maintain" | "custom", values: SettingsForm) {
    if (lock.current || pending || !result) return
    lock.current = true
    setPending(true)
    setError("")
    try {
      const { customLoad, ...settings } = values
      const saved = await gateway.mutate({
        action: "decide",
        id: session.id,
        version: session.version,
        exerciseIndex: index,
        choice,
        settings,
        load:
          choice === "custom"
            ? customLoad
            : choice === "maintain"
              ? result.suggestion.currentLoad
              : (result.suggestion.suggestedLoad ?? result.suggestion.currentLoad),
      })
      onUpdated(saved)
      toast.success("Decisão de carga salva")
    } catch (failure) {
      setError(
        failure instanceof Error ? failure.message : "Não foi possível salvar a decisão"
      )
    } finally {
      lock.current = false
      setPending(false)
    }
  }
  const history = result ? exerciseHistory(result.history, exercise) : []
  const suggestion = result?.suggestion
  const latestSessionId = history[0]?.session.id
  const canDecide = !latestSessionId || latestSessionId === session.id
  return (
    <div className="space-y-4 border-t pt-4">
      <form
        className="space-y-3"
        onChange={() => setResult(null)}
        onSubmit={form.handleSubmit(calculate)}
      >
        <fieldset className="grid min-w-0 gap-3 sm:grid-cols-2" disabled={pending}>
          {(
            [
              {
                name: "increment",
                label: "Incremento desejado (kg)",
                max: 100,
                step: 0.01,
              },
              {
                name: "equipmentIncrement",
                label: "Menor incremento do equipamento (kg)",
                max: 100,
                step: 0.01,
              },
              {
                name: "roundingStep",
                label: "Arredondamento disponível (kg)",
                max: 100,
                step: 0.01,
              },
              {
                name: "percentage",
                label: "Percentual conservador (%)",
                max: 5,
                step: 0.5,
              },
            ] as const
          ).map(metric => (
            <Field key={metric.name}>
              <FieldLabel htmlFor={`progress-${index}-${metric.name}`}>
                {metric.label}
              </FieldLabel>
              <Input
                id={`progress-${index}-${metric.name}`}
                inputMode="decimal"
                max={metric.max}
                min={metric.name === "percentage" ? 0.5 : 0.01}
                placeholder="Opcional"
                step={metric.step}
                type="number"
                {...form.register(metric.name, {
                  setValueAs: value => (value === "" ? undefined : Number(value)),
                })}
              />
              <FieldError errors={[form.formState.errors[metric.name]]} />
            </Field>
          ))}
        </fieldset>
        <Button disabled={pending} type="submit" variant="outline">
          Calcular sugestão
        </Button>
      </form>
      {pending && <output className="block text-sm">Consultando desempenho</output>}
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
      {suggestion && (
        <div aria-live="polite" className="space-y-3 border p-3">
          <h3 className="font-semibold">{labels[suggestion.action]}</h3>
          {!canDecide && latestSessionId && (
            <p className="text-sm">
              A decisão deve ser registrada na{" "}
              <Link
                className="underline"
                href={`/workouts/sessions/${encodeURIComponent(latestSessionId)}`}
              >
                sessão concluída mais recente
              </Link>
            </p>
          )}
          <p className="text-sm">
            Carga atual:{" "}
            {suggestion.basedOnSessionIds.length
              ? `${suggestion.currentLoad} kg`
              : "A definir"}{" "}
            · Sugestão:{" "}
            {suggestion.suggestedLoad !== undefined
              ? `${suggestion.suggestedLoad} kg`
              : "A definir"}
          </p>
          <p className="text-sm">{suggestion.reason}</p>
          <p className="text-xs text-muted-foreground">
            Confiança {suggestion.confidence === "low" ? "menor" : "normal"} · Nenhuma
            carga será alterada sem sua escolha
          </p>
          <ul className="space-y-1 text-xs text-muted-foreground">
            {suggestion.basedOnSessionIds.map(id => (
              <li key={id}>
                Dados de{" "}
                {new Date(
                  result?.history.find(item => item.id === id)?.startedAt ??
                    session.startedAt
                ).toLocaleString("pt-BR")}{" "}
                · Sessão <span className="break-all">{id}</span>
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <Button
              disabled={
                pending ||
                !canDecide ||
                suggestion.action === "insufficientData" ||
                suggestion.suggestedLoad === undefined ||
                exercise.painReported
              }
              onClick={() => void form.handleSubmit(values => decide("accept", values))()}
              type="button"
            >
              Aceitar sugestão
            </Button>
            <Button
              disabled={pending || !canDecide}
              onClick={() =>
                void form.handleSubmit(values => decide("maintain", values))()
              }
              type="button"
              variant="outline"
            >
              Manter carga atual
            </Button>
          </div>
          <Field>
            <FieldLabel htmlFor={`custom-load-${index}`}>
              Ou informe outra carga
            </FieldLabel>
            <Input
              disabled={pending || !canDecide}
              id={`custom-load-${index}`}
              inputMode="decimal"
              max={1000}
              min={0}
              step={0.01}
              type="number"
              {...form.register("customLoad", { valueAsNumber: true })}
            />
            <FieldError errors={[form.formState.errors.customLoad]} />
          </Field>
          <Button
            disabled={pending || !canDecide}
            onClick={() => void form.handleSubmit(values => decide("custom", values))()}
            type="button"
            variant="outline"
          >
            Confirmar minha carga
          </Button>
        </div>
      )}
      <ExerciseHistoryList history={history} />
    </div>
  )
}

function ExerciseHistoryList({
  history,
}: {
  history: ReturnType<typeof exerciseHistory>
}) {
  const validSets = history.flatMap(item =>
    item.exercise.sets.filter(set => set.completed && !set.warmup)
  )
  const best = [...validSets].sort(
    (a, b) => b.load - a.load || b.performedRepetitions - a.performedRepetitions
  )[0]
  const loads = history.flatMap(item => {
    const load = item.exercise.sets
      .filter(set => set.completed && !set.warmup)
      .at(-1)?.load
    return load === undefined ? [] : [load]
  })
  const newestLoad = loads[0]
  const oldestLoad = loads.at(-1)
  if (!history.length) return null
  return (
    <section aria-label="Histórico do exercício" className="space-y-3">
      <h3 className="font-semibold">Últimas {history.length} sessões concluídas</h3>
      {newestLoad !== undefined && oldestLoad !== undefined && (
        <p className="text-sm">
          Carga registrada no período: {oldestLoad} kg → {newestLoad} kg · Variação de{" "}
          {Math.round((newestLoad - oldestLoad) * 100) / 100} kg
        </p>
      )}
      {best && (
        <p className="text-sm">
          Melhor série neste período: {best.load} kg × {best.performedRepetitions}{" "}
          repetições · Maior carga, com repetições como desempate
        </p>
      )}
      <p className="text-xs text-muted-foreground">
        Aquecimentos não entram no melhor desempenho · Compare também repetições, RIR e
        técnica
      </p>
      <ol className="space-y-3">
        {history.map(item => (
          <li className="space-y-1 border p-3 text-sm" key={item.session.id}>
            <p className="font-medium">
              {new Date(item.session.startedAt).toLocaleString("pt-BR")}
            </p>
            <p>
              {item.exercise.sets.filter(set => set.completed && !set.warmup).length}/
              {item.exercise.targetSets} séries de trabalho concluídas
            </p>
            {item.exercise.sets
              .filter(set => !set.warmup)
              .map(set => (
                <p key={set.setNumber}>
                  Série {set.setNumber}:{" "}
                  {set.completed
                    ? `${set.load} kg × ${set.performedRepetitions} · RIR ${set.perceivedRir ?? "não informado"}`
                    : "Incompleta"}
                </p>
              ))}
          </li>
        ))}
      </ol>
    </section>
  )
}
