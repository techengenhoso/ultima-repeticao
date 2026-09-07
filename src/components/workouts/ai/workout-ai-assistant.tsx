"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { LoaderCircleIcon, SparklesIcon } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import {
  type Control,
  type FieldPath,
  FormProvider,
  useForm,
  useWatch,
} from "react-hook-form"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useProfile } from "@/contexts/profile-context"
import { useWorkout } from "@/contexts/workout-context"
import {
  type AiWorkoutInput,
  type AiWorkoutResult,
  aiWorkoutInputSchema,
} from "@/modules/workouts/application/workout-generation-schema"
import { WorkoutGenerationError } from "@/modules/workouts/application/workout-generation-use-cases"
import { useWorkoutGenerationUseCases } from "@/modules/workouts/presentation/workout-generation-use-cases-context"
import {
  WorkoutAiBasics,
  WorkoutAiPreferences,
  WorkoutAiSafety,
} from "./workout-ai-fields"
import { WorkoutAiReview } from "./workout-ai-review"

function profileDefaults(profile: ReturnType<typeof useProfile>["profile"]) {
  return {
    goal: profile.goal ?? undefined,
    experienceLevel: profile.experience ?? undefined,
  }
}

const steps: { title: string; fields: FieldPath<AiWorkoutInput>[] }[] = [
  {
    title: "Seu planejamento",
    fields: ["name", "goal", "experienceLevel", "daysPerWeek", "durationMinutes"],
  },
  {
    title: "Preferências e movimentos",
    fields: [
      "priorityMuscleGroups",
      "excludedMuscleGroups",
      "preferredExercises",
      "avoidedExercises",
      "excludedMovementPatterns",
    ],
  },
  {
    title: "Segurança e geração",
    fields: ["healthNotes", "additionalNotes", "safetyFlags", "safetyConfirmed"],
  },
]

const dialogHeightByStep = ["", "sm:h-[50rem]", ""] as const

function generationError(error: unknown, signal: AbortSignal) {
  if (signal.aborted) return "A geração demorou mais que o esperado, tente novamente"
  if (error instanceof WorkoutGenerationError) return error.message
  return "Não foi possível gerar a ficha, confira sua conexão e tente novamente"
}

function useSafetyBlock(
  control: Control<AiWorkoutInput>,
  generationAttempted: boolean,
  safetyBlock: (
    input: Pick<AiWorkoutInput, "safetyConfirmed" | "safetyFlags">
  ) => string | null
) {
  const values = useWatch({ control: control })

  if (!generationAttempted && !values.safetyFlags?.length) return null

  return safetyBlock({
    safetyConfirmed: values.safetyConfirmed ?? false,
    safetyFlags: values.safetyFlags ?? [],
  })
}

function submitLabel(pending: boolean, step: number) {
  if (pending) return "Gerando ficha"
  return step < 2 ? "Continuar" : "Gerar sugestão"
}

export function WorkoutAiAssistant() {
  const { profile } = useProfile()
  const { exercises, isLoading, loadingError } = useWorkout()
  const workoutGenerationUseCases = useWorkoutGenerationUseCases()
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(0)
  const [result, setResult] = useState<AiWorkoutResult | null>(null)
  const [originalInput, setOriginalInput] = useState<AiWorkoutInput | null>(null)
  const [revision, setRevision] = useState(0)
  const [generating, setGenerating] = useState(false)
  const [saving, setSaving] = useState(false)
  const [discarding, setDiscarding] = useState(false)
  const [error, setError] = useState("")
  const [generationAttempted, setGenerationAttempted] = useState(false)
  const activeRequest = useRef<AbortController | null>(null)
  const heading = useRef<HTMLHeadingElement>(null)
  const form = useForm<AiWorkoutInput>({
    mode: "onSubmit",
    reValidateMode: "onChange",
    resolver: zodResolver(aiWorkoutInputSchema, {
      error: () => "Confira o valor informado",
    }),
    defaultValues: {
      name: "",
      ...profileDefaults(profile),
      priorityMuscleGroups: [],
      excludedMuscleGroups: [],
      preferredExercises: [],
      avoidedExercises: [],
      excludedMovementPatterns: [],
      healthNotes: "",
      additionalNotes: "",
      safetyFlags: [],
      safetyConfirmed: false,
    },
  })
  const safety = useSafetyBlock(
    form.control,
    generationAttempted,
    workoutGenerationUseCases.safetyBlock
  )
  const visibleSafety = step === 2 ? safety : null
  const hasFieldError = steps[step].fields.some(field => field in form.formState.errors)
  const pending = form.formState.isSubmitting || generating || saving
  const submitDisabled = pending || Boolean(error || visibleSafety) || hasFieldError
  useEffect(() => {
    const subscription = form.watch(() => setError(""))
    return () => subscription.unsubscribe()
  }, [form.watch])
  useEffect(() => () => activeRequest.current?.abort(), [])
  useEffect(() => {
    if (open && (result || step >= 0)) heading.current?.focus()
  }, [open, step, result])

  async function next() {
    if (await form.trigger(steps[step].fields, { shouldFocus: true })) {
      setError("")
      setStep(Math.min(step + 1, 2))
    }
  }
  async function generate(input: AiWorkoutInput) {
    if (activeRequest.current) return

    const blocked = workoutGenerationUseCases.safetyBlock(input)

    if (blocked) {
      setError(blocked)
      return
    }

    const controller = new AbortController()

    activeRequest.current = controller

    setGenerating(true)
    setError("")

    const timeout = setTimeout(() => controller.abort(), 85000)

    try {
      const generated = await workoutGenerationUseCases.generate(
        input,
        exercises,
        controller.signal
      )
      setOriginalInput(input)
      setResult(generated)
      setRevision(value => value + 1)
    } catch (failure) {
      setError(generationError(failure, controller.signal))
    } finally {
      clearTimeout(timeout)
      activeRequest.current = null
      setGenerating(false)
    }
  }

  function discard() {
    setOpen(false)
    setDiscarding(false)
    setResult(null)
    setOriginalInput(null)
    setError("")
    setStep(0)
    setGenerationAttempted(false)
    form.reset()
  }

  function requestClose() {
    if (pending) return
    if (result || form.formState.isDirty) setDiscarding(true)
    else discard()
  }

  return (
    <>
      <Dialog
        onOpenChange={value => {
          if (value) {
            form.reset({
              ...form.formState.defaultValues,
              ...profileDefaults(profile),
            })
            setOpen(true)
          } else requestClose()
        }}
        open={open}
      >
        <DialogTrigger asChild>
          <Button disabled={isLoading || loadingError} type="button" variant="outline">
            <SparklesIcon />
            Nova ficha com IA
          </Button>
        </DialogTrigger>

        <DialogContent
          className={`flex max-h-[calc(100dvh-2rem)] min-w-0 flex-col gap-4 overflow-hidden p-4 sm:max-w-4xl sm:p-6 ${dialogHeightByStep[step]}`}
          showCloseButton={!pending}
        >
          <DialogHeader className="pr-8">
            <DialogTitle>Nova ficha com IA</DialogTitle>

            <DialogDescription>
              Uma sugestão montada por regras a partir das suas respostas e da biblioteca.
              Revise sua ficha. Informe a carga inicial de cada exercício ou ajuste durante
              o treino
            </DialogDescription>
          </DialogHeader>

          <div className="min-h-0 w-full min-w-0 overflow-x-hidden overflow-y-auto overscroll-contain scrollbar-none [&::-webkit-scrollbar]:hidden">
            {result && originalInput ? (
              <WorkoutAiReview
                busy={pending}
                error={error}
                heading={heading}
                input={originalInput}
                key={revision}
                onCancel={requestClose}
                onRegenerate={() => generate(originalInput)}
                onSaved={discard}
                onSavingChange={setSaving}
                result={result}
              />
            ) : (
              <FormProvider {...form}>
                <form
                  className="space-y-5"
                  onSubmit={event => {
                    if (submitDisabled) {
                      event.preventDefault()
                      return
                    }
                    if (step < 2) {
                      event.preventDefault()
                      void next()
                    } else {
                      setGenerationAttempted(true)
                      if (workoutGenerationUseCases.safetyBlock(form.getValues())) {
                        event.preventDefault()
                        setError("")
                        return
                      }
                      void form.handleSubmit(generate, errors => {
                        setError("")
                        const invalidStep = steps.findIndex(item =>
                          item.fields.some(field => field in errors)
                        )
                        setStep(Math.max(0, invalidStep))
                      })(event)
                    }
                  }}
                >
                  <div>
                    <h2 className="font-semibold outline-none" ref={heading} tabIndex={-1}>
                      {steps[step].title}
                    </h2>

                    <p aria-live="polite" className="text-xs text-muted-foreground">
                      Etapa {step + 1} de {steps.length}
                    </p>
                  </div>

                  <fieldset className="min-w-0 space-y-5" disabled={pending}>
                    {step === 0 && <WorkoutAiBasics />}
                    {step === 1 && <WorkoutAiPreferences exercises={exercises} />}
                    {step === 2 && <WorkoutAiSafety />}
                  </fieldset>

                  {visibleSafety && (
                    <p
                      className="border border-destructive p-3 text-sm text-destructive"
                      role="alert"
                    >
                      {visibleSafety}
                    </p>
                  )}
                  {error && (
                    <p className="text-sm text-destructive" role="alert">
                      {error}
                    </p>
                  )}
                  {pending && (
                    <output className="flex items-start gap-2 text-sm text-muted-foreground">
                      <LoaderCircleIcon className="size-4 shrink-0 animate-spin" />A
                      geração pode levar alguns segundos, aguarde
                    </output>
                  )}
                  <div className="flex flex-col-reverse gap-3 border-t pt-4 sm:flex-row sm:justify-between">
                    <Button
                      disabled={pending}
                      onClick={() =>
                        step ? setStep(current => current - 1) : requestClose()
                      }
                      type="button"
                      variant="outline"
                    >
                      {step ? "Voltar" : "Fechar"}
                    </Button>
                    <Button disabled={submitDisabled} type="submit">
                      {submitLabel(pending, step)}
                    </Button>
                  </div>
                </form>
              </FormProvider>
            )}

            <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
              A ficha gerada é uma sugestão educativa e não substitui a avaliação de um
              profissional de educação física, médico ou fisioterapeuta. Em caso de dor,
              lesão ou condição de saúde, procure orientação profissional
            </p>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog onOpenChange={setDiscarding} open={discarding}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Descartar criação da ficha</AlertDialogTitle>

            <AlertDialogDescription>
              Suas respostas e a ficha temporária serão descartadas
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Continuar editando</AlertDialogCancel>

            <Button onClick={discard} type="button" variant="destructive">
              Descartar
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
