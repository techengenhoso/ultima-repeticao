"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { LoaderCircleIcon } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import {
  type Control,
  type FieldPath,
  FormProvider,
  type UseFormReturn,
  useForm,
  useWatch,
} from "react-hook-form"
import { ConfirmationDialog } from "@/components/confirmation-dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useProfile } from "@/contexts/profile-context"
import { useWorkout } from "@/contexts/workout-context"
import {
  type WorkoutGeneratorInput,
  type WorkoutGeneratorResult,
  workoutGeneratorInputSchema,
} from "@/modules/workouts/application/workout-generation-schema"
import { WorkoutGenerationError } from "@/modules/workouts/application/workout-generation-use-cases"
import { normalizeWorkoutName } from "@/modules/workouts/domain/workout-name"
import { useWorkoutGenerationUseCases } from "@/modules/workouts/presentation/workout-generation-use-cases-context"
import {
  WorkoutGenerationBasics,
  WorkoutGenerationPreferences,
  WorkoutGenerationSafety,
} from "./workout-generation-fields"
import { WorkoutGenerationReview } from "./workout-generation-review"

function profileDefaults(profile: ReturnType<typeof useProfile>["profile"]) {
  return {
    goal: profile.goal ?? undefined,
    experienceLevel: profile.experience ?? undefined,
  }
}

const steps: { title: string; fields: FieldPath<WorkoutGeneratorInput>[] }[] = [
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

function generationError(error: unknown, signal: AbortSignal) {
  if (signal.aborted) return "A geração demorou mais que o esperado, tente novamente"
  if (error instanceof WorkoutGenerationError) return error.message
  return "Não foi possível gerar a ficha, confira sua conexão e tente novamente"
}

function useSafetyBlock(
  control: Control<WorkoutGeneratorInput>,
  generationAttempted: boolean,
  safetyBlock: (
    input: Pick<WorkoutGeneratorInput, "safetyConfirmed" | "safetyFlags">
  ) => string | null
) {
  const values = useWatch({ control: control })

  if (!generationAttempted && !values.safetyFlags?.length) return null

  return safetyBlock({
    safetyConfirmed: values.safetyConfirmed ?? false,
    safetyFlags: values.safetyFlags ?? [],
  })
}

function submitLabel(step: number) {
  return step < 2 ? "Continuar" : "Gerar sugestão"
}

interface WorkoutGenerationAssistantProps {
  open: boolean
  onOpenChange(open: boolean): void
}

interface WorkoutGenerationFormProps {
  error: string
  exercises: ReturnType<typeof useWorkout>["exercises"]
  form: UseFormReturn<WorkoutGeneratorInput>
  heading: React.RefObject<HTMLHeadingElement | null>
  onGenerate(input: WorkoutGeneratorInput): Promise<void>
  onNext(): Promise<void>
  onRequestClose(): void
  pending: boolean
  safetyBlock: (input: WorkoutGeneratorInput) => string | null
  setError(error: string): void
  setGenerationAttempted(attempted: boolean): void
  setStep(step: number): void
  step: number
  submitDisabled: boolean
  visibleSafety: string | null
}

function WorkoutGenerationForm({
  error,
  exercises,
  form,
  heading,
  onGenerate,
  onNext,
  onRequestClose,
  pending,
  safetyBlock,
  setError,
  setGenerationAttempted,
  setStep,
  step,
  submitDisabled,
  visibleSafety,
}: WorkoutGenerationFormProps) {
  return (
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
            void onNext()
          } else {
            setGenerationAttempted(true)
            if (safetyBlock(form.getValues())) {
              event.preventDefault()
              setError("")
              return
            }
            void form.handleSubmit(onGenerate, errors => {
              setError("")
              const invalidStep = steps.findIndex(item =>
                item.fields.some(field => field in errors)
              )
              setStep(Math.max(0, invalidStep))
            })(event)
          }
        }}
      >
        <div className="flex justify-start">
          <Badge
            aria-live="polite"
            className="h-auto flex-col items-start gap-0 p-0 text-left text-muted-foreground leading-tight whitespace-normal"
            variant="ghost"
          >
            <span className="font-medium">{steps[step].title}</span>
            <span>
              Etapa {step + 1} de {steps.length}
            </span>
          </Badge>
        </div>
        <h2 className="sr-only" ref={heading} tabIndex={-1}>
          {steps[step].title}
        </h2>

        <fieldset className="min-w-0 space-y-5" disabled={pending}>
          {step === 0 && <WorkoutGenerationBasics />}
          {step === 1 && <WorkoutGenerationPreferences exercises={exercises} />}
          {step === 2 && <WorkoutGenerationSafety />}
        </fieldset>

        {visibleSafety && (
          <Alert variant="destructive">
            <AlertDescription>{visibleSafety}</AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          <Button
            disabled={pending}
            onClick={() => (step ? setStep(step - 1) : onRequestClose())}
            type="button"
            variant="secondary"
          >
            {step ? "Voltar" : "Cancelar"}
          </Button>
          <Button disabled={submitDisabled} type="submit">
            {pending && <LoaderCircleIcon aria-hidden="true" className="animate-spin" />}
            {pending ? "Gerando ficha" : submitLabel(step)}
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}

export function WorkoutGenerationAssistant({
  open,
  onOpenChange,
}: WorkoutGenerationAssistantProps) {
  const { profile } = useProfile()
  const { exercises, workouts } = useWorkout()
  const workoutGenerationUseCases = useWorkoutGenerationUseCases()
  const [step, setStep] = useState(0)
  const [result, setResult] = useState<WorkoutGeneratorResult | null>(null)
  const [originalInput, setOriginalInput] = useState<WorkoutGeneratorInput | null>(null)
  const [revision, setRevision] = useState(0)
  const [reviewDayOpen, setReviewDayOpen] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [saving, setSaving] = useState(false)
  const [discarding, setDiscarding] = useState(false)
  const [error, setError] = useState("")
  const [generationAttempted, setGenerationAttempted] = useState(false)
  const activeRequest = useRef<AbortController | null>(null)
  const heading = useRef<HTMLHeadingElement>(null)
  const wasOpen = useRef(false)
  const form = useForm<WorkoutGeneratorInput>({
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    resolver: zodResolver(workoutGeneratorInputSchema, {
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
  const visibleSafety = step === 2 && generationAttempted ? safety : null
  const pending = form.formState.isSubmitting || generating || saving
  const submitDisabled = pending
  useEffect(() => {
    const subscription = form.watch(() => setError(""))
    return () => subscription.unsubscribe()
  }, [form.watch])
  useEffect(() => () => activeRequest.current?.abort(), [])
  useEffect(() => {
    if (open && !wasOpen.current) {
      form.reset({
        ...form.formState.defaultValues,
        ...profileDefaults(profile),
      })
    }
    wasOpen.current = open
  }, [form, open, profile])
  useEffect(() => {
    if (open && (result || step >= 0)) heading.current?.focus()
  }, [open, step, result])

  async function next() {
    const name = form.getValues("name")
    if (
      step === 0 &&
      workouts.some(
        workout => normalizeWorkoutName(workout.name) === normalizeWorkoutName(name)
      )
    ) {
      form.setError("name", { message: "Você já possui uma ficha com esse nome" })
      return
    }
    form.clearErrors(steps[step].fields)
    if (await form.trigger(steps[step].fields, { shouldFocus: true })) {
      setError("")
      setStep(Math.min(step + 1, 2))
    }
  }
  async function generate(input: WorkoutGeneratorInput) {
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
      setReviewDayOpen(false)
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
    onOpenChange(false)
    setDiscarding(false)
    setResult(null)
    setOriginalInput(null)
    setReviewDayOpen(false)
    setError("")
    setStep(0)
    setGenerationAttempted(false)
    form.reset()
  }

  function requestClose() {
    if (pending) return
    setDiscarding(true)
  }

  const reviewNeedsScroll = reviewDayOpen || (result?.plan.days.length ?? 0) > 2

  return (
    <>
      <Dialog
        onOpenChange={value => {
          if (value) onOpenChange(true)
          else requestClose()
        }}
        open={open}
      >
        <DialogContent
          className={`flex min-h-0 max-h-[calc(100dvh-2rem)] flex-col gap-4 sm:max-w-xl ${reviewNeedsScroll ? "h-[calc(100dvh-2rem)] sm:h-[min(50rem,calc(100dvh-2rem))]" : ""}`}
          showCloseButton={!pending}
        >
          <DialogHeader className="pr-12">
            <DialogTitle>Nova ficha automática</DialogTitle>

            <DialogDescription className="sr-only">
              Assistente para criar uma ficha automática
            </DialogDescription>
          </DialogHeader>

          {result && originalInput ? (
            <div className="min-h-0 w-full min-w-0 flex-1 overflow-hidden">
              <WorkoutGenerationReview
                busy={pending}
                error={error}
                heading={heading}
                input={originalInput}
                key={revision}
                onCancel={requestClose}
                onOpenDayChange={value => setReviewDayOpen(value !== "")}
                onRegenerate={() => generate(originalInput)}
                onSaved={discard}
                onSavingChange={setSaving}
                result={result}
              />
            </div>
          ) : (
            <ScrollArea className="min-h-0 flex-1 [&_[data-slot=scroll-area-viewport]]:max-h-[inherit]">
              <WorkoutGenerationForm
                error={error}
                exercises={exercises}
                form={form}
                heading={heading}
                onGenerate={generate}
                onNext={next}
                onRequestClose={requestClose}
                pending={pending}
                safetyBlock={workoutGenerationUseCases.safetyBlock}
                setError={setError}
                setGenerationAttempted={setGenerationAttempted}
                setStep={setStep}
                step={step}
                submitDisabled={submitDisabled}
                visibleSafety={visibleSafety}
              />
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>

      <ConfirmationDialog
        cancelLabel="Continuar editando"
        confirmLabel="Descartar"
        description="Ao fechar os dados preenchidos nesta ficha não serão salvos. Esta ação não poderá ser desfeita"
        onConfirm={discard}
        onOpenChange={setDiscarding}
        open={discarding}
        title="Descartar alterações"
      />
    </>
  )
}
