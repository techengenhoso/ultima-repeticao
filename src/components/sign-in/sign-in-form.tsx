"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { signInWithEmailAndPassword } from "firebase/auth"
import { LoaderCircleIcon, LockKeyholeIcon, MailIcon } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { FieldGroup } from "@/components/ui/field"
import { auth, getFirebaseErrorMessage } from "@/lib/firebase"
import { requiredSchema } from "@/lib/schemas-zod"
import { PasswordField } from "../password-field"
import { TextField } from "../text-field"

const signInSchema = z.object({
  email: requiredSchema,
  password: requiredSchema,
})

type SignInSchema = z.infer<typeof signInSchema>

export function SignInForm() {
  const router = useRouter()

  const [signInError, setSignInError] = useState<string | null>(null)

  const {
    handleSubmit,
    register,
    formState: { errors, isLoading, isSubmitting },
  } = useForm<SignInSchema>({ resolver: zodResolver(signInSchema) })

  async function onSubmit(data: SignInSchema) {
    setSignInError(null)

    try {
      await signInWithEmailAndPassword(auth, data.email, data.password)

      router.replace("/")
      router.refresh()
    } catch (error) {
      const message = getFirebaseErrorMessage({
        error,
        message: "Não foi possível entrar. Tente novamente.",
      })

      setSignInError(message)
    }
  }

  return (
    <FieldGroup noValidate onSubmit={handleSubmit(onSubmit)}>
      <TextField
        autoComplete="email"
        disabled={isLoading || isSubmitting}
        error={errors.email}
        icon={<MailIcon />}
        id="email"
        label="E-mail"
        placeholder="voce@exemplo.com.br"
        type="email"
        {...register("email")}
      />

      <PasswordField
        autoComplete="current-password"
        disabled={isLoading || isSubmitting}
        error={errors.password}
        icon={<LockKeyholeIcon />}
        id="password"
        label="Senha"
        placeholder="Digite sua senha"
        {...register("password")}
      >
        <Link
          className="text-xs font-medium text-primary underline-offset-4 hover:underline"
          href="/forgot-password"
        >
          Esqueci minha senha
        </Link>
      </PasswordField>

      {signInError && (
        <div
          aria-live="polite"
          className="border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive"
          role="alert"
        >
          {signInError}
        </div>
      )}

      <Button
        className="w-full mt-(--card-spacing)"
        disabled={isLoading || isSubmitting}
        size="lg"
        type="submit"
      >
        {isSubmitting && <LoaderCircleIcon className="animate-spin" />}
        {isSubmitting ? "Entrando" : "Entrar"}
      </Button>
    </FieldGroup>
  )
}
