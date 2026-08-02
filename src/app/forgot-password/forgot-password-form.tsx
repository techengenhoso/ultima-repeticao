"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { FirebaseError } from "firebase/app"
import { sendPasswordResetEmail } from "firebase/auth"
import { LoaderCircleIcon, MailCheckIcon } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { auth } from "@/lib/firebase"

const forgotPasswordSchema = z.object({
  email: z.email("Informe um e-mail válido"),
})

type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>

const resetPasswordErrors: Record<string, string> = {
  "auth/invalid-email": "Informe um e-mail válido",
  "auth/too-many-requests": "Muitas tentativas, aguarde alguns minutos e tente novamente",
  "auth/user-disabled": "Esta conta foi desativada",
}

export function ForgotPasswordForm() {
  const [emailSent, setEmailSent] = useState(false)
  const [authenticationError, setAuthenticationError] = useState<string | null>(null)
  const {
    formState: { errors, isSubmitting },
    getValues,
    handleSubmit,
    register,
  } = useForm<ForgotPasswordData>({ resolver: zodResolver(forgotPasswordSchema) })

  async function onSubmit(data: ForgotPasswordData) {
    setAuthenticationError(null)

    try {
      await sendPasswordResetEmail(auth, data.email)
      setEmailSent(true)
    } catch (error) {
      const message =
        error instanceof FirebaseError ? resetPasswordErrors[error.code] : undefined

      setAuthenticationError(
        message ?? "Não foi possível enviar o e-mail, tente novamente"
      )
    }
  }

  if (emailSent) {
    return (
      <div className="space-y-6">
        <output
          aria-live="polite"
          className="block border border-primary/30 bg-primary/10 p-4"
        >
          <MailCheckIcon aria-hidden="true" className="mb-3 size-5 text-primary" />
          <p className="font-medium">Confira sua caixa de entrada</p>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            Se existir uma conta para <strong>{getValues("email")}</strong>, enviaremos as
            instruções para redefinir a senha, lembre de verificar o lixo eletrônico
          </p>
        </output>

        <Button asChild className="w-full" size="lg">
          <Link href="/sign-in">Voltar para entrar</Link>
        </Button>
      </div>
    )
  }

  return (
    <form className="space-y-5" noValidate onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input
          {...register("email")}
          aria-describedby={errors.email ? "email-error" : undefined}
          aria-invalid={Boolean(errors.email)}
          autoComplete="email"
          autoFocus
          id="email"
          placeholder="voce@exemplo.com"
          type="email"
        />
        {errors.email && (
          <p className="text-xs text-destructive" id="email-error">
            {errors.email.message}
          </p>
        )}
      </div>

      {authenticationError && (
        <div
          aria-live="polite"
          className="border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive"
          role="alert"
        >
          {authenticationError}
        </div>
      )}

      <Button className="w-full" disabled={isSubmitting} size="lg" type="submit">
        {isSubmitting && <LoaderCircleIcon className="animate-spin" />}
        {isSubmitting ? "Enviando" : "Enviar instruções"}
      </Button>
    </form>
  )
}
