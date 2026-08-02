"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { FirebaseError } from "firebase/app"
import { signInWithEmailAndPassword } from "firebase/auth"
import { EyeIcon, EyeOffIcon, LoaderCircleIcon } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { auth } from "@/lib/firebase"

const signInSchema = z.object({
  email: z.email("Informe um e-mail válido"),
  password: z.string().min(1, "Informe sua senha"),
})

type SignInData = z.infer<typeof signInSchema>

const authenticationErrors: Record<string, string> = {
  "auth/invalid-credential": "E-mail ou senha incorretos",
  "auth/invalid-email": "Informe um e-mail válido",
  "auth/too-many-requests": "Muitas tentativas, aguarde alguns minutos e tente novamente",
  "auth/user-disabled": "Esta conta foi desativada",
}

export function SignInForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [authenticationError, setAuthenticationError] = useState<string | null>(null)
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm<SignInData>({ resolver: zodResolver(signInSchema) })

  async function onSubmit(data: SignInData) {
    setAuthenticationError(null)

    try {
      await signInWithEmailAndPassword(auth, data.email, data.password)
      router.replace("/")
      router.refresh()
    } catch (error) {
      const message =
        error instanceof FirebaseError ? authenticationErrors[error.code] : undefined

      setAuthenticationError(message ?? "Não foi possível entrar, tente novamente")
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
        <div className="flex items-center justify-between gap-4">
          <Label htmlFor="password">Senha</Label>
          <Link
            className="text-xs font-medium text-primary underline-offset-4 hover:underline"
            href="/forgot-password"
          >
            Esqueci minha senha
          </Link>
        </div>
        <div className="relative">
          <Input
            {...register("password")}
            aria-describedby={errors.password ? "password-error" : undefined}
            aria-invalid={Boolean(errors.password)}
            autoComplete="current-password"
            className="pr-11"
            id="password"
            placeholder="Digite sua senha"
            type={showPassword ? "text" : "password"}
          />
          <button
            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
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
        {errors.password && (
          <p className="text-xs text-destructive" id="password-error">
            {errors.password.message}
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
        {isSubmitting ? "Entrando" : "Entrar"}
      </Button>
    </form>
  )
}
