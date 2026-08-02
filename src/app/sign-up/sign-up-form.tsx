"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { FirebaseError } from "firebase/app"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { EyeIcon, EyeOffIcon, LoaderCircleIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { auth } from "@/lib/firebase"

const signupSchema = z
  .object({
    email: z.email("Informe um e-mail válido"),
    password: z
      .string()
      .min(8, "A senha deve ter pelo menos 8 caracteres")
      .max(50, "A senha deve ter no máximo 50 caracteres")
      .regex(/[a-z]/, "A senha deve conter pelo menos uma letra minúscula")
      .regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula")
      .regex(/[0-9]/, "A senha deve conter pelo menos um número"),
    passwordConfirmation: z.string().min(1, "Confirme sua senha"),
  })
  .refine(data => data.password === data.passwordConfirmation, {
    message: "As senhas não coincidem",
    path: ["passwordConfirmation"],
  })

type SignupData = z.infer<typeof signupSchema>

const signupErrors: Record<string, string> = {
  "auth/email-already-in-use": "Já existe uma conta com este e-mail",
  "auth/invalid-email": "Informe um e-mail válido",
  "auth/operation-not-allowed": "A criação de contas está indisponível no momento",
  "auth/too-many-requests": "Muitas tentativas, aguarde alguns minutos e tente novamente",
  "auth/weak-password": "Escolha uma senha mais forte",
}

export function SignUpForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [authenticationError, setAuthenticationError] = useState<string | null>(null)
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm<SignupData>({ resolver: zodResolver(signupSchema) })

  async function onSubmit(data: SignupData) {
    setAuthenticationError(null)

    try {
      await createUserWithEmailAndPassword(auth, data.email, data.password)
      router.replace("/")
      router.refresh()
    } catch (error) {
      const message = error instanceof FirebaseError ? signupErrors[error.code] : undefined

      setAuthenticationError(
        message ?? "Não foi possível criar sua conta, tente novamente"
      )
    }
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

      <div className="space-y-2">
        <Label htmlFor="password">Senha</Label>
        <div className="relative">
          <Input
            {...register("password")}
            aria-describedby={errors.password ? "password-error" : "password-hint"}
            aria-invalid={Boolean(errors.password)}
            autoComplete="new-password"
            className="pr-11"
            id="password"
            placeholder="Crie uma senha"
            type={showPassword ? "text" : "password"}
          />
          <button
            aria-label={showPassword ? "Ocultar senhas" : "Mostrar senhas"}
            className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
            onClick={() => setShowPassword(current => !current)}
            type="button"
          >
            {showPassword ? (
              <EyeOffIcon className="size-4" />
            ) : (
              <EyeIcon className="size-4" />
            )}
          </button>
        </div>
        {errors.password ? (
          <p className="text-xs text-destructive" id="password-error">
            {errors.password.message}
          </p>
        ) : (
          <p className="text-xs text-muted-foreground" id="password-hint">
            Use de 8 a 50 caracteres, com letra maiúscula, minúscula e número
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password-confirmation">Confirmar senha</Label>
        <Input
          {...register("passwordConfirmation")}
          aria-describedby={
            errors.passwordConfirmation ? "password-confirmation-error" : undefined
          }
          aria-invalid={Boolean(errors.passwordConfirmation)}
          autoComplete="new-password"
          id="password-confirmation"
          placeholder="Digite a senha novamente"
          type={showPassword ? "text" : "password"}
        />
        {errors.passwordConfirmation && (
          <p className="text-xs text-destructive" id="password-confirmation-error">
            {errors.passwordConfirmation.message}
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
        {isSubmitting ? "Criando conta" : "Criar conta"}
      </Button>
    </form>
  )
}
