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
import {
  formatBrazilianDateInput,
  formatIsoDateToBrazilian,
  parseBrazilianDate,
} from "@/lib/date"
import { useUserProfile } from "@/providers/user-profile"
import { InputField } from "./input-field"

const personalSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(3, "Deve ter pelo menos 3 caracteres")
    .max(100, "Deve ter no máximo 100 caracteres"),
  email: z.email("Valor inválido"),
  birthDate: z
    .string()
    .refine(value => !value || parseBrazilianDate(value), "Use o formato DD/MM/AAAA")
    .refine(
      value =>
        !value ||
        (parseBrazilianDate(value) ?? "") <= new Date().toISOString().slice(0, 10),
      "Não pode ser futura"
    ),
  gender: z.string(),
})

type PersonalValues = z.infer<typeof personalSchema>

export function PersonalInformation() {
  const { user, profile, isLoading, saveProfile } = useUserProfile()

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PersonalValues>({
    resolver: zodResolver(personalSchema),
    defaultValues: { fullName: "", email: "", birthDate: "", gender: "" },
  })

  const birthDateField = register("birthDate")

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

  async function onSubmit(values: PersonalValues) {
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
          id="personal-data-form"
          onSubmit={handleSubmit(onSubmit)}
        >
          <InputField
            autoComplete="name"
            disabled={isLoading || isSubmitting}
            error={errors.fullName}
            icon={<UserIcon aria-hidden="true" />}
            id="fullName"
            label="Nome completo"
            placeholder="Digite seu nome completo"
            type="text"
            {...register("fullName")}
          />

          <InputField
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

          <InputField
            {...birthDateField}
            disabled={isLoading || isSubmitting}
            error={errors.birthDate}
            icon={<CalendarDaysIcon aria-hidden="true" />}
            id="birthDate"
            inputMode="numeric"
            label="Data de nascimento"
            maxLength={10}
            onChange={event => {
              event.target.value = formatBrazilianDateInput(event.target.value)
              return birthDateField.onChange(event)
            }}
            placeholder="DD/MM/AAAA"
            type="text"
          />

          <SelectField
            disabled={isLoading || isSubmitting}
            error={errors.gender}
            icon={<UsersIcon aria-hidden="true" />}
            id="gender"
            label="Gênero"
            onChange={value =>
              setValue("gender", value, {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
            options={[
              { label: "Feminino", value: "female" },
              { label: "Masculino", value: "male" },
              { label: "Outro", value: "other" },
            ]}
            value={watch("gender")}
          />
        </form>

        <Button
          className="w-full mt-(--card-spacing)"
          disabled={isLoading || isSubmitting}
          form="personal-data-form"
          type="submit"
        >
          {isSubmitting && <LoaderCircleIcon className="animate-spin" />}
          {isSubmitting ? "Salvando" : "Salvar"}
        </Button>
      </CardContent>
    </Card>
  )
}
