"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import {
  CalendarDaysIcon,
  LoaderCircleIcon,
  MailIcon,
  UserIcon,
  UsersIcon,
} from "lucide-react"
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
import {
  formatBrazilianDateInput,
  formatIsoDateToBrazilian,
  parseBrazilianDate,
} from "@/lib/date"
import { genderOptionsSelectField } from "@/lib/options-select-field"
import { dateSchema, emailSchema, genderSchema, textSchema } from "@/lib/schemas-zod"
import { useUserProfile } from "@/providers/user-profile"
import { TextField } from "../text-field"

const personalInformationSchema = z.object({
  fullName: textSchema,
  email: emailSchema,
  birthDate: dateSchema,
  gender: genderSchema,
})

type PersonalInformationSchema = z.infer<typeof personalInformationSchema>

export function PersonalInformation() {
  const { user, profile, isLoading, saveProfile } = useUserProfile()

  const {
    control,
    handleSubmit,
    register,
    reset,
    formState: { errors, isLoading: isLoadingForm, isSubmitting },
  } = useForm<PersonalInformationSchema>({
    resolver: zodResolver(personalInformationSchema),
  })

  // revisar, existe somente aqui até o momento
  const birthDateField = register("birthDate")

  // revisar essa definição dos valores
  useEffect(
    () =>
      reset({
        fullName: profile?.fullName ?? user?.displayName ?? "",
        email: profile?.email ?? user?.email ?? "",
        birthDate: formatIsoDateToBrazilian(profile?.birthDate),
        gender: profile?.gender ?? "",
      }),
    [profile, reset, user]
  )

  // revisar o funcionamento desta função
  async function onSubmit(values: PersonalInformationSchema) {
    try {
      await saveProfile({
        fullName: values.fullName.trim(),
        birthDate: values.birthDate ? parseBrazilianDate(values.birthDate) : null,
        gender: values.gender || null,
      })
      toast.success("Atualizados com sucesso")
    } catch {
      toast.error("Não foi possível salvar")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dados pessoais</CardTitle>
        <CardDescription>Mantenha suas informações pessoais atualizadas</CardDescription>
      </CardHeader>

      <CardContent>
        <form
          className="grid gap-5 sm:grid-cols-2"
          id="personalDataForm"
          onSubmit={handleSubmit(onSubmit)}
        >
          <TextField
            autoComplete="name"
            disabled={isLoading || isLoadingForm || isSubmitting}
            error={errors.fullName}
            icon={<UserIcon aria-hidden="true" />}
            id="fullName"
            label="Nome completo"
            placeholder="Digite seu nome completo"
            type="text"
            {...register("fullName")}
          />

          <TextField
            aria-readonly="true"
            description="O endereço de e-mail não pode ser alterado"
            disabled
            error={errors.email}
            icon={<MailIcon aria-hidden="true" />}
            id="email"
            label="E-mail"
            readOnly
            type="email"
            {...register("email")}
          />

          <TextField
            {...birthDateField}
            disabled={isLoading || isLoadingForm || isSubmitting}
            error={errors.birthDate}
            icon={<CalendarDaysIcon aria-hidden="true" />}
            id="birthDate"
            inputMode="numeric"
            label="Data de nascimento"
            onChange={event => {
              event.target.value = formatBrazilianDateInput(event.target.value)
              return birthDateField.onChange(event)
            }}
            placeholder="DD/MM/AAAA"
            type="text"
          />

          <Controller
            control={control}
            name="gender"
            render={({ field, fieldState }) => (
              <SelectField
                disabled={isLoading || isLoadingForm || isSubmitting}
                error={fieldState.error}
                icon={<UsersIcon aria-hidden="true" />}
                id="gender"
                label="Gênero"
                onChange={field.onChange}
                options={genderOptionsSelectField}
                value={field.value}
              />
            )}
          />
        </form>

        <Button
          className="w-full mt-(--card-spacing)"
          disabled={isLoading || isLoadingForm || isSubmitting}
          form="personalDataForm"
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
