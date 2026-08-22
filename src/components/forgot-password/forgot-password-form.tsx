"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { sendPasswordResetEmail } from "firebase/auth"
import { LoaderCircleIcon, MailCheckIcon, MailIcon } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { FieldGroup } from "@/components/ui/field"
import { auth, getFirebaseErrorMessage } from "@/lib/firebase"
import { emailSchema } from "@/lib/schemas-zod"
import { TextField } from "../text-field"

const forgotPasswordSchema = z.object({
  email: emailSchema,
})

type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>

export function ForgotPasswordForm() {
  const [emailSent, setEmailSent] = useState(false)

  const [forgotPasswordError, setForgotPasswordError] = useState<string | null>(null)

  const {
    getValues,
    handleSubmit,
    register,
    formState: { errors, isLoading, isSubmitting },
  } = useForm<ForgotPasswordSchema>({ resolver: zodResolver(forgotPasswordSchema) })

  // revisar a parte do try
  async function onSubmit(data: ForgotPasswordSchema) {
    setForgotPasswordError(null)

    try {
      await sendPasswordResetEmail(auth, data.email)
      setEmailSent(true)
    } catch (error) {
      const message = getFirebaseErrorMessage({
        error,
        message: "Não foi possível enviar o e-mail, tente novamente",
      })

      setForgotPasswordError(message)
    }
  }

  if (emailSent) {
    return (
      <div className="space-y-6">
        <output className="block border border-primary/30 bg-primary/10 p-4">
          <MailCheckIcon className="mb-3 size-5 text-primary" />

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
    <FieldGroup noValidate onSubmit={handleSubmit(onSubmit)}>
      <TextField
        autoComplete="email"
        autoFocus
        disabled={isLoading || isSubmitting}
        error={errors.email}
        icon={<MailIcon />}
        id="email"
        label="E-mail"
        placeholder="voce@exemplo.com.br"
        type="email"
        {...register("email")}
      />

      {forgotPasswordError && (
        <div
          aria-live="polite"
          className="border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive"
          role="alert"
        >
          {forgotPasswordError}
        </div>
      )}

      <Button
        className="w-full mt-(--card-spacing)"
        disabled={isLoading || isSubmitting}
        size="lg"
        type="submit"
      >
        {isSubmitting && <LoaderCircleIcon className="animate-spin" />}
        {isSubmitting ? "Enviando" : "Enviar instruções"}
      </Button>
    </FieldGroup>
  )
}
