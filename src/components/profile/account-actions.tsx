"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { LoaderCircleIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
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
import { Input } from "@/components/ui/input"
import { useUser } from "@/contexts/user-context"
import {
  type AccountDeletionInput,
  accountDeletionConfirmation,
  accountDeletionSchema,
} from "@/modules/users/domain/account-deletion"

export function AccountActions() {
  const router = useRouter()
  const { deleteAccountUser, signOutUser } = useUser()
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
      await deleteAccountUser(input.confirmation)
      toast.success("Conta excluída permanentemente")
      router.replace("/sign-in")
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Não foi possível excluir sua conta. Tente novamente"
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
          variant="outline"
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
              <AlertDialogTitle>Excluir conta</AlertDialogTitle>

              <AlertDialogDescription>
                Todos os seus dados como perfil, exercícios, fichas, sessões, avaliações
                corporais e outros serão excluídos sem possibilidade de recuperar.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <form className="grid gap-5" onSubmit={handleSubmit(handleDeleteAccount)}>
              <Input
                aria-describedby={
                  errors.confirmation ? "account-deletion-error" : undefined
                }
                aria-invalid={Boolean(errors.confirmation)}
                autoComplete="off"
                disabled={isSubmitting}
                id="account-deletion"
                placeholder={`digite ${accountDeletionConfirmation} e clique em confirmar`}
                {...register("confirmation")}
              />

              {errors.confirmation && (
                <p className="text-sm text-destructive" id="account-deletion-error">
                  {errors.confirmation.message}
                </p>
              )}

              <AlertDialogFooter className="gap-3">
                <AlertDialogCancel disabled={isSubmitting}>Cancelar</AlertDialogCancel>

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
