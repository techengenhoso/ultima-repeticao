"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { FlagIcon, LoaderCircleIcon, MedalIcon } from "lucide-react"
import { useEffect } from "react"
import { Controller, useForm } from "react-hook-form"
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
import { useUserProfile } from "@/contexts/user-profile-context"
import {
  experienceOptionsSelectField,
  goalOptionsSelectField,
} from "@/lib/options-select-field"
import { experienceSchema, goalSchema } from "@/lib/schemas-zod"

const focusSchema = z.object({
  goal: goalSchema,
  experience: experienceSchema,
})

type FocusSchema = z.infer<typeof focusSchema>

export function Focus() {
  const { profile, isLoadingUserProfile: isLoadingProfile, saveProfile } = useUserProfile()

  const {
    control,
    handleSubmit,
    reset,
    formState: { isLoading, isSubmitting },
  } = useForm<FocusSchema>({
    resolver: zodResolver(focusSchema),
    defaultValues: {
      goal: profile?.goal ?? "",
      experience: profile?.experience ?? "",
    },
  })

  // revisar essa definição dos valores
  useEffect(
    () =>
      reset({
        goal: profile?.goal ?? "",
        experience: profile?.experience ?? "",
      }),
    [profile, reset]
  )

  // revisar o funcionamento desta função
  async function onSubmit(values: FocusSchema) {
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
          id="focusForm"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Controller
            control={control}
            name="goal"
            render={({ field, fieldState }) => (
              <SelectField
                disabled={isLoadingProfile || isLoading || isSubmitting}
                error={fieldState.error}
                icon={<FlagIcon aria-hidden="true" />}
                id="goal"
                label="Objetivo"
                onChange={field.onChange}
                options={goalOptionsSelectField}
                value={field.value}
              />
            )}
          />

          <Controller
            control={control}
            name="experience"
            render={({ field, fieldState }) => (
              <SelectField
                disabled={isLoadingProfile || isLoading || isSubmitting}
                error={fieldState.error}
                icon={<MedalIcon aria-hidden="true" />}
                id="experience"
                label="Experiência"
                onChange={field.onChange}
                options={experienceOptionsSelectField}
                value={field.value}
              />
            )}
          />
        </form>

        <Button
          className="w-full mt-(--card-spacing)"
          disabled={isLoadingProfile || isLoading || isSubmitting}
          form="focusForm"
          size="lg"
          type="submit"
        >
          {isSubmitting && <LoaderCircleIcon className="animate-spin" />}
          {isSubmitting ? "Salvando" : "Salvar"}
        </Button>
      </CardContent>
    </Card>
  )
}
