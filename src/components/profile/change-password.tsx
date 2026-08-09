"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { FirebaseError } from "firebase/app"
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
import { passwordSchema } from "@/lib/schemas-zod"
import { useUserProfile } from "@/providers/user-profile"

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Campo obrigatório"),
    newPassword: passwordSchema,
    passwordConfirmation: passwordSchema,
  })
  .refine(values => values.newPassword === values.passwordConfirmation, {
    message: "As senhas não coincidem",
    path: ["passwordConfirmation"],
  })

type ChangePasswordValues = z.infer<typeof changePasswordSchema>

const changePasswordErrors: Record<string, string> = {
  "auth/invalid-credential": "A senha atual está incorreta",
  "auth/requires-recent-login": "Entre novamente na conta antes de alterar a senha",
  "auth/too-many-requests": "Muitas tentativas, aguarde alguns minutos",
  "auth/user-mismatch": "Não foi possível confirmar sua identidade",
  "auth/weak-password": "Escolha uma senha mais forte",
  "auth/wrong-password": "A senha atual está incorreta",
}

export function ChangePassword() {
  const { user, isLoading } = useUserProfile()

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
  } = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      passwordConfirmation: "",
    },
  })

  async function onSubmit(values: ChangePasswordValues) {
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
      const message =
        error instanceof FirebaseError ? changePasswordErrors[error.code] : undefined

      toast.error(message ?? "Não foi possível alterar")
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
          id="change-password-form"
          onSubmit={handleSubmit(onSubmit)}
        >
          <PasswordField
            autoComplete="current-password"
            disabled={isLoading || isSubmitting}
            error={errors.currentPassword}
            icon={<LockKeyholeIcon aria-hidden="true" />}
            id="current-password"
            label="Senha atual"
            placeholder="Digite sua senha atual"
            {...register("currentPassword")}
          />

          <PasswordField
            autoComplete="new-password"
            disabled={isLoading || isSubmitting}
            error={errors.newPassword}
            icon={<LockKeyholeIcon aria-hidden="true" />}
            id="new-password"
            label="Nova senha"
            placeholder="Digite a nova senha"
            {...register("newPassword")}
          />

          <PasswordField
            autoComplete="new-password"
            disabled={isLoading || isSubmitting}
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
          disabled={isLoading || isSubmitting}
          form="change-password-form"
          type="submit"
        >
          {isSubmitting && <LoaderCircleIcon className="animate-spin" />}
          {isSubmitting ? "Salvando" : "Salvar"}
        </Button>
      </CardContent>
    </Card>
  )
}
