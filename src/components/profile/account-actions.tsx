"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { LockKeyholeIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { ConfirmationDialog } from "@/components/confirmation-dialog"
import { PasswordField } from "@/components/password-field"
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

        <ConfirmationDialog
          confirmForm="account-deletion-form"
          confirmLabel="Excluir"
          confirmType="submit"
          description="Todos os seus dados como perfil, exercícios, fichas, treinos, avaliações corporais e outros serão excluídos sem possibilidade de recuperar."
          isPending={isSubmitting}
          onOpenChange={handleDialogChange}
          open={isDialogOpen}
          pendingLabel="Excluindo"
          title="Exclusão permanente"
          trigger={
            <Button
              disabled={isSigningOut || isSubmitting}
              size="lg"
              variant="destructive"
            >
              Excluir conta
            </Button>
          }
        >
          <form
            className="grid gap-5"
            id="account-deletion-form"
            onSubmit={handleSubmit(handleDeleteAccount)}
          >
            <PasswordField
              autoComplete="current-password"
              disabled={isSubmitting}
              error={errors.password}
              icon={<LockKeyholeIcon aria-hidden="true" />}
              id="account-deletion-password"
              placeholder="Digite sua senha"
              {...register("password")}
            />
          </form>
        </ConfirmationDialog>
      </CardContent>
    </Card>
  )
}
