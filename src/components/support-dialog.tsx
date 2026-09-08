"use client"

import { InfoIcon } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const supportEmail = "techengenhoso@outlook.com"
const supportEmailSubject = "Suporte - Última Repetição"

export function SupportDialog({ className }: { className?: string }) {
  async function copySupportEmail() {
    try {
      await navigator.clipboard.writeText(supportEmail)
      toast.success("Endereço de e-mail copiado")
    } catch {
      toast.error("Não foi possível copiar o endereço de e-mail")
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button aria-label="Suporte" className={className} size="icon" variant="outline">
          <InfoIcon />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader className="pr-12">
          <DialogTitle>Suporte</DialogTitle>

          <DialogDescription>
            No momento, o suporte é realizado exclusivamente por e-mail
          </DialogDescription>
        </DialogHeader>

        <p className="break-all rounded-none border bg-muted px-4 py-3 font-medium">
          {supportEmail}
        </p>

        <DialogFooter className="w-full sm:justify-stretch sm:*:flex-1">
          <Button asChild variant="outline">
            <a
              href={`mailto:${supportEmail}?subject=${encodeURIComponent(supportEmailSubject)}`}
            >
              Enviar e-mail
            </a>
          </Button>

          <Button onClick={() => void copySupportEmail()}>Copiar endereço</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
