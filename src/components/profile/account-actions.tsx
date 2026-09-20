"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { LoaderCircleIcon, LockKeyholeIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { PasswordField } from "@/components/password-field"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useUser } from "@/contexts/user-context"
import {
  type AccountDeletionInput,
  accountDeletionSchema,
} from "@/modules/users/domain/account-deletion"
import { useAuthenticationUseCases } from "@/modules/users/presentation/authentication-use-cases-context"

export function AccountActions() {
  const router = useRouter()
  const { deleteAccountUser, signOutUser } = useUser()
  const authentication = useAuthenticationUseCases()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AccountDeletionInput>({
    resolver: zodResolver(accountDeletionSchema),
  })

  async function handleSignOut() {
    setIsSigningOut(true)

    try {
      await signOutUser()
      router.replace("/sign-in")
    } finally {
      setIsSigningOut(false)
    }
  }

  async function handleDeleteAccount(input: AccountDeletionInput) {
    try {
      await deleteAccountUser(input.password)
      toast.success("Conta excluída permanentemente")
      router.replace("/sign-in")
    } catch (error) {
      toast.error(
        authentication.publicError(
          error,
          "Não foi possível excluir sua conta. Tente novamente"
        )
      )
    }
  }

  function handleDialogChange(open: boolean) {
    if (isSubmitting) return
    setIsDialogOpen(open)
    if (!open) reset()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Conta</CardTitle>
        <CardDescription>Gerencie o acesso e a permanência da sua conta</CardDescription>
      </CardHeader>

      <CardContent className="grid gap-4 sm:grid-cols-2">
        <Button
          disabled={isSigningOut || isSubmitting}
          onClick={handleSignOut}
          size="lg"
          variant="secondary"
        >
          {isSigningOut ? "Saindo" : "Sair da conta"}
        </Button>

        <AlertDialog onOpenChange={handleDialogChange} open={isDialogOpen}>
          <AlertDialogTrigger asChild>
            <Button
              disabled={isSigningOut || isSubmitting}
              size="lg"
              variant="destructive"
            >
              Excluir conta
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto">
            <AlertDialogHeader>
              <AlertDialogTitle>Exclusão permanente</AlertDialogTitle>

              <AlertDialogDescription>
                Todos os seus dados como perfil, exercícios, fichas, treinos, avaliações
                corporais e outros serão excluídos sem possibilidade de recuperar.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <form className="grid gap-5" onSubmit={handleSubmit(handleDeleteAccount)}>
              <PasswordField
                autoComplete="current-password"
                disabled={isSubmitting}
                error={errors.password}
                icon={<LockKeyholeIcon aria-hidden="true" />}
                id="account-deletion-password"
                label="Digite sua senha atual para confirmar"
                placeholder="Senha atual"
                {...register("password")}
              />

              <AlertDialogFooter className="gap-3">
                <AlertDialogCancel disabled={isSubmitting} variant="secondary">
                  Cancelar
                </AlertDialogCancel>

                <Button disabled={isSubmitting} type="submit" variant="destructive">
                  {isSubmitting && <LoaderCircleIcon className="animate-spin" />}
                  {isSubmitting ? "Excluindo" : "Confirmar"}
                </Button>
              </AlertDialogFooter>
            </form>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  )
}
