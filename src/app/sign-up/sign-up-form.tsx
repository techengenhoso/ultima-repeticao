"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { FirebaseError } from "firebase/app"
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import {
  EyeIcon,
  EyeOffIcon,
  LoaderCircleIcon,
  LockIcon,
  MailIcon,
  UserIcon,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import { auth } from "@/lib/firebase"

const signupSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(3, "O nome completo deve ter pelo menos 3 caracteres")
      .max(100, "O nome completo deve ter no máximo 100 caracteres"),
    email: z.email("Informe um e-mail válido"),
    password: z
      .string()
      .trim()
      .min(8, "A senha deve ter pelo menos 8 caracteres")
      .max(50, "A senha deve ter no máximo 50 caracteres")
      .regex(/[a-z]/, "A senha deve conter pelo menos uma letra minúscula")
      .regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula")
      .regex(/[0-9]/, "A senha deve conter pelo menos um número"),
    passwordConfirmation: z
      .string()
      .trim()
      .min(8, "A senha deve ter pelo menos 8 caracteres")
      .max(50, "A senha deve ter no máximo 50 caracteres")
      .regex(/[a-z]/, "A senha deve conter pelo menos uma letra minúscula")
      .regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula")
      .regex(/[0-9]/, "A senha deve conter pelo menos um número"),
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
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      )

      await updateProfile(userCredential.user, { displayName: data.fullName })

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
    <form noValidate onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup className="gap-5">
        <Field>
          <FieldLabel htmlFor="full-name">Nome completo</FieldLabel>

          <InputGroup>
            <InputGroupInput
              {...register("fullName")}
              aria-describedby={errors.fullName ? "full-name-error" : undefined}
              autoComplete="name"
              id="full-name"
              placeholder="Digite seu nome completo"
              type="text"
            />

            <InputGroupAddon>
              <UserIcon aria-hidden="true" />
            </InputGroupAddon>
          </InputGroup>

          <FieldError errors={[errors.fullName]} id="full-name-error" />
        </Field>

        <Field>
          <FieldLabel htmlFor="email">E-mail</FieldLabel>

          <InputGroup>
            <InputGroupInput
              {...register("email")}
              aria-describedby={errors.email ? "email-error" : undefined}
              autoComplete="email"
              id="email"
              placeholder="voce@exemplo.com.br"
              type="email"
            />

            <InputGroupAddon>
              <MailIcon aria-hidden="true" />
            </InputGroupAddon>
          </InputGroup>

          <FieldError errors={[errors.email]} id="email-error" />
        </Field>

        <Field>
          <FieldLabel htmlFor="password">Senha</FieldLabel>

          <InputGroup>
            <InputGroupInput
              {...register("password")}
              aria-describedby={errors.password ? "password-error" : "password-hint"}
              autoComplete="new-password"
              id="password"
              placeholder="Crie uma senha"
              type={showPassword ? "text" : "password"}
            />

            <InputGroupAddon>
              <LockIcon aria-hidden="true" />
            </InputGroupAddon>

            <InputGroupAddon align="inline-end">
              <InputGroupButton
                aria-label={showPassword ? "Ocultar senhas" : "Mostrar senhas"}
                onClick={() => setShowPassword(current => !current)}
                type="button"
              >
                {showPassword ? (
                  <EyeOffIcon className="size-4" />
                ) : (
                  <EyeIcon className="size-4" />
                )}
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>

          <FieldError errors={[errors.password]} id="password-error" />
        </Field>

        <Field>
          <FieldLabel htmlFor="password-confirmation">Confirmar senha</FieldLabel>

          <InputGroup>
            <InputGroupInput
              {...register("passwordConfirmation")}
              aria-describedby={
                errors.passwordConfirmation ? "password-confirmation-error" : undefined
              }
              autoComplete="new-password"
              id="password-confirmation"
              placeholder="Digite a senha novamente"
              type={showPassword ? "text" : "password"}
            />

            <InputGroupAddon>
              <LockIcon aria-hidden="true" />
            </InputGroupAddon>
          </InputGroup>

          <FieldError
            errors={[errors.passwordConfirmation]}
            id="password-confirmation-error"
          />
        </Field>

        {authenticationError && (
          <div
            aria-live="polite"
            className="border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive"
            role="alert"
          >
            {authenticationError}
          </div>
        )}

        <Button className="mt-5 w-full" disabled={isSubmitting} size="lg" type="submit">
          {isSubmitting && <LoaderCircleIcon className="animate-spin" />}
          {isSubmitting ? "Criando conta" : "Criar conta"}
        </Button>
      </FieldGroup>
    </form>
  )
}
