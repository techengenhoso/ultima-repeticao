"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { FlagIcon, LoaderCircleIcon, MedalIcon } from "lucide-react"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { SelectField } from "@/components/select-field"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useUserProfile } from "@/providers/user-profile"

const focusSchema = z.object({
  goal: z.string(),
  experience: z.string(),
})

type FocusValues = z.infer<typeof focusSchema>

export function Focus() {
  const { profile, isLoading, saveProfile } = useUserProfile()

  const {
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FocusValues>({
    resolver: zodResolver(focusSchema),
    defaultValues: { goal: "", experience: "" },
  })

  useEffect(
    () =>
      reset({
        goal: profile?.goal ?? "",
        experience: profile?.experience ?? "",
      }),
    [profile, reset]
  )

  async function onSubmit(values: FocusValues) {
    try {
      await saveProfile({
        goal: values.goal || null,
        experience: values.experience || null,
      })
      toast.success("Atualizado com sucesso")
    } catch {
      toast.error("Não foi possível salvar")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Foco</CardTitle>
        <CardDescription>Conte um pouco sobre o seu momento de treino</CardDescription>
      </CardHeader>

      <CardContent>
        <form
          className="grid gap-5 sm:grid-cols-2"
          id="focus-form"
          onSubmit={handleSubmit(onSubmit)}
        >
          <SelectField
            disabled={isLoading || isSubmitting}
            error={errors.goal}
            icon={<FlagIcon aria-hidden="true" />}
            id="goal"
            label="Objetivo"
            onChange={value =>
              setValue("goal", value, {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
            options={[
              { label: "Hipertrofia", value: "hypertrophy" },
              { label: "Emagrecimento", value: "weight-loss" },
              { label: "Condicionamento físico", value: "conditioning" },
              { label: "Força", value: "strength" },
              { label: "Qualidade de vida", value: "quality-of-life" },
            ]}
            value={watch("goal")}
          />

          <SelectField
            disabled={isLoading || isSubmitting}
            error={errors.experience}
            icon={<MedalIcon aria-hidden="true" />}
            id="experience"
            label="Experiência"
            onChange={value =>
              setValue("experience", value, {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
            options={[
              { label: "Iniciante", value: "beginner" },
              { label: "Básico", value: "basic" },
              { label: "Intermediário", value: "intermediate" },
              { label: "Avançado", value: "advanced" },
              { label: "Especialista", value: "expert" },
            ]}
            value={watch("experience")}
          />
        </form>

        <Button
          className="w-full mt-(--card-spacing)"
          disabled={isLoading || isSubmitting}
          form="focus-form"
          type="submit"
        >
          {isSubmitting && <LoaderCircleIcon className="animate-spin" />}
          {isSubmitting ? "Salvando" : "Salvar"}
        </Button>
      </CardContent>
    </Card>
  )
}
