"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { LoaderCircleIcon, LockKeyholeIcon, MailIcon, UserIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { FieldGroup } from "@/components/ui/field"
import { auth, getFirebaseErrorMessage } from "@/lib/firebase"
import { emailSchema, passwordSchema, textSchema } from "@/lib/schemas-zod"
import { PasswordField } from "../password-field"
import { TextField } from "../text-field"

const signUpSchema = z
  .object({
    fullName: textSchema,
    email: emailSchema,
    password: passwordSchema,
    passwordConfirmation: passwordSchema,
  })
  .refine(data => data.password === data.passwordConfirmation, {
    message: "As senhas não coincidem",
    path: ["passwordConfirmation"],
  })

type SignUpSchema = z.infer<typeof signUpSchema>

export function SignUpForm() {
  const router = useRouter()

  const [signUpError, setSignUpError] = useState<string | null>(null)

  const {
    handleSubmit,
    register,
    formState: { errors, isLoading, isSubmitting },
  } = useForm<SignUpSchema>({ resolver: zodResolver(signUpSchema) })

  async function onSubmit(data: SignUpSchema) {
    setSignUpError(null)

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      )

      await updateProfile(userCredential.user, { displayName: data.fullName })

      router.replace("/")
      router.refresh()
    } catch (error) {
      const message = getFirebaseErrorMessage({
        error,
        message: "Não foi possível criar sua conta. Tente novamente.",
      })

      setSignUpError(message)
    }
  }

  return (
    <FieldGroup noValidate onSubmit={handleSubmit(onSubmit)}>
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
        autoComplete="new-password"
        disabled={isLoading || isSubmitting}
        error={errors.password}
        icon={<LockKeyholeIcon />}
        id="password"
        label="Senha"
        placeholder="Crie uma senha"
        {...register("password")}
      />

      <PasswordField
        autoComplete="new-password"
        disabled={isLoading || isSubmitting}
        error={errors.passwordConfirmation}
        icon={<LockKeyholeIcon />}
        id="passwordConfirmation"
        label="Confirmar senha"
        placeholder="Confirmar sua senha"
        {...register("passwordConfirmation")}
      />

      {signUpError && (
        <div
          aria-live="polite"
          className="border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive"
          role="alert"
        >
          {signUpError}
        </div>
      )}

      <Button
        className="w-full mt-(--card-spacing)"
        disabled={isLoading || isSubmitting}
        size="lg"
        type="submit"
      >
        {isSubmitting && <LoaderCircleIcon className="animate-spin" />}
        {isSubmitting ? "Criando conta" : "Criar conta"}
      </Button>
    </FieldGroup>
  )
}
