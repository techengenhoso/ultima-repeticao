"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { cn } from "cn"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import {
  CalendarDaysIcon,
  LoaderCircleIcon,
  MailIcon,
  UserIcon,
  UsersIcon,
} from "lucide-react"
import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { ComboboxField } from "@/components/combobox-field"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { InputGroup, InputGroupAddon, InputGroupButton } from "@/components/ui/input-group"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useProfile } from "@/contexts/profile-context"
import { useUser } from "@/contexts/user-context"
import { formatIsoDateToBrazilian, parseBrazilianDate } from "@/lib/date"
import { genders } from "@/lib/options-select"
import { dateSchema, emailSchema, genderSchema, textSchema } from "@/lib/schemas-zod"
import { TextField } from "../text-field"

const personalInformationSchema = z.object({
  fullName: textSchema,
  email: emailSchema,
  birthDate: dateSchema,
  gender: genderSchema,
})

type PersonalInformationSchema = z.infer<typeof personalInformationSchema>

export function PersonalInformation() {
  const { user, saveUser } = useUser()
  const { profile, saveProfile } = useProfile()
  const [isBirthDatePickerOpen, setIsBirthDatePickerOpen] = useState(false)
  const [birthDatePickerMonth, setBirthDatePickerMonth] = useState<Date>()

  const {
    control,
    handleSubmit,
    register,
    reset,
    formState: { errors, isLoading, isSubmitting },
  } = useForm<PersonalInformationSchema>({
    resolver: zodResolver(personalInformationSchema),
    defaultValues: {
      fullName: user.displayName ?? "",
      email: user.email ?? "",
      birthDate: formatIsoDateToBrazilian(profile.birthDate),
      gender: profile.gender ?? "",
    },
  })

  // revisar essa definição dos valores
  useEffect(
    () =>
      reset({
        fullName: user.displayName ?? "",
        email: user.email ?? "",
        birthDate: formatIsoDateToBrazilian(profile.birthDate),
        gender: profile.gender ?? "",
      }),
    [profile, reset, user]
  )

  // revisar o funcionamento desta função
  async function onSubmit(values: PersonalInformationSchema) {
    try {
      await saveUser({ displayName: values.fullName.trim() })
      await saveProfile({
        birthDate: values.birthDate ? (parseBrazilianDate(values.birthDate) ?? "") : "",
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
            disabled={isLoading || isSubmitting}
            error={errors.fullName}
            icon={<UserIcon />}
            id="fullName"
            label="Nome completo"
            placeholder="Digite seu nome completo"
            type="text"
            {...register("fullName")}
          />

          <TextField
            aria-readonly="true"
            disabled
            error={errors.email}
            icon={<MailIcon aria-hidden="true" />}
            id="email"
            label="E-mail"
            readOnly
            tooltip="O endereço de e-mail não pode ser alterado"
            type="email"
            {...register("email")}
          />

          <Controller
            control={control}
            name="birthDate"
            render={({ field, fieldState }) => {
              const isoBirthDate = parseBrazilianDate(field.value)
              const selectedDate = isoBirthDate
                ? new Date(`${isoBirthDate}T00:00:00`)
                : undefined

              return (
                <Field>
                  <FieldLabel htmlFor="birthDate">Data de nascimento</FieldLabel>

                  <InputGroup data-disabled={isLoading || isSubmitting || undefined}>
                    <InputGroupAddon>
                      <CalendarDaysIcon aria-hidden="true" />
                    </InputGroupAddon>

                    <Popover
                      onOpenChange={open => {
                        setIsBirthDatePickerOpen(open)
                        if (open) setBirthDatePickerMonth(selectedDate ?? new Date())
                      }}
                      open={isBirthDatePickerOpen}
                    >
                      <PopoverTrigger asChild>
                        <InputGroupButton
                          aria-describedby={
                            fieldState.error ? "birthDate-error" : undefined
                          }
                          aria-invalid={Boolean(fieldState.error)}
                          className={cn(
                            "h-full flex-1 justify-start rounded-none px-0 pl-1.5 font-normal hover:bg-transparent",
                            !selectedDate && "text-muted-foreground"
                          )}
                          data-slot="input-group-control"
                          disabled={isLoading || isSubmitting}
                          id="birthDate"
                          size="sm"
                        >
                          {selectedDate
                            ? format(selectedDate, "dd 'de' MMMM 'de' yyyy", {
                                locale: ptBR,
                              })
                            : "Selecione sua data de nascimento"}
                        </InputGroupButton>
                      </PopoverTrigger>

                      <PopoverContent align="start" className="w-auto p-0">
                        <Calendar
                          captionLayout="dropdown"
                          disabled={{ after: new Date() }}
                          endMonth={new Date()}
                          locale={ptBR}
                          mode="single"
                          month={birthDatePickerMonth}
                          onMonthChange={setBirthDatePickerMonth}
                          onSelect={date => {
                            field.onChange(date ? format(date, "dd/MM/yyyy") : "")
                            setIsBirthDatePickerOpen(false)
                          }}
                          selected={selectedDate}
                          startMonth={new Date(1900, 0)}
                        />
                      </PopoverContent>
                    </Popover>
                  </InputGroup>

                  <FieldError errors={[fieldState.error]} id="birthDate-error" />
                </Field>
              )
            }}
          />

          <Controller
            control={control}
            name="gender"
            render={({ field, fieldState }) => (
              <ComboboxField
                disabled={isLoading || isSubmitting}
                error={fieldState.error}
                icon={<UsersIcon aria-hidden="true" />}
                id="gender"
                label="Gênero"
                onChange={field.onChange}
                options={genders}
                value={field.value}
              />
            )}
          />
        </form>

        <Button
          className="w-full mt-(--card-spacing)"
          disabled={isLoading || isSubmitting}
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
