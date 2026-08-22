"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth"
import { LoaderCircleIcon, LockKeyholeIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { PasswordField } from "@/components/password-field"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getFirebaseErrorMessage } from "@/lib/firebase"
import { passwordSchema, requiredSchema } from "@/lib/schemas-zod"
import { useUserProfile } from "@/providers/user-profile"

const changePasswordSchema = z
  .object({
    currentPassword: requiredSchema,
    newPassword: passwordSchema,
    passwordConfirmation: passwordSchema,
  })
  .refine(data => data.newPassword === data.passwordConfirmation, {
    message: "As senhas não coincidem",
    path: ["passwordConfirmation"],
  })

type ChangePasswordSchema = z.infer<typeof changePasswordSchema>

export function ChangePassword() {
  const { user, isLoading } = useUserProfile()

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isLoading: isLoadingForm, isSubmitting },
  } = useForm<ChangePasswordSchema>({ resolver: zodResolver(changePasswordSchema) })

  // revisar menos a parte catch
  async function onSubmit(values: ChangePasswordSchema) {
    if (!user?.email) {
      toast.error("Não foi possível identificar o endereço de e-mail")
      return
    }

    if (!user.providerData.some(provider => provider.providerId === "password")) {
      toast.error("Esta conta não utiliza senha para entrar")
      return
    }

    try {
      const credential = EmailAuthProvider.credential(user.email, values.currentPassword)

      await reauthenticateWithCredential(user, credential)
      await updatePassword(user, values.newPassword)

      reset()

      toast.success("Senha alterada com sucesso")
    } catch (error) {
      const message = getFirebaseErrorMessage({
        error,
        message: "Não foi possível alterar sua senha. Tente novamente.",
      })

      toast.error(message)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Alterar senha</CardTitle>
        <CardDescription>Confirme sua senha atual e escolha uma nova</CardDescription>
      </CardHeader>

      <CardContent>
        <form
          className="grid gap-5 sm:grid-cols-2"
          id="changePasswordForm"
          onSubmit={handleSubmit(onSubmit)}
        >
          <PasswordField
            autoComplete="current-password"
            disabled={isLoading || isLoadingForm || isSubmitting}
            error={errors.currentPassword}
            icon={<LockKeyholeIcon aria-hidden="true" />}
            id="current-password"
            label="Senha atual"
            placeholder="Digite sua senha atual"
            {...register("currentPassword")}
          />

          <PasswordField
            autoComplete="new-password"
            disabled={isLoading || isLoadingForm || isSubmitting}
            error={errors.newPassword}
            icon={<LockKeyholeIcon aria-hidden="true" />}
            id="new-password"
            label="Nova senha"
            placeholder="Digite a nova senha"
            {...register("newPassword")}
          />

          <PasswordField
            autoComplete="new-password"
            disabled={isLoading || isLoadingForm || isSubmitting}
            error={errors.passwordConfirmation}
            icon={<LockKeyholeIcon aria-hidden="true" />}
            id="password-confirmation"
            label="Confirmar nova senha"
            placeholder="Digite a nova senha novamente"
            {...register("passwordConfirmation")}
          />
        </form>

        <Button
          className="w-full mt-(--card-spacing)"
          disabled={isLoading || isLoadingForm || isSubmitting}
          form="changePasswordForm"
          type="submit"
        >
          {isSubmitting && <LoaderCircleIcon className="animate-spin" />}
          {isSubmitting ? "Salvando" : "Salvar"}
        </Button>
      </CardContent>
    </Card>
  )
}
