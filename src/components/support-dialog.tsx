"use client"

import { InfoIcon, MailIcon } from "lucide-react"
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
import { Item, ItemContent, ItemMedia, ItemTitle } from "./ui/item"

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
        <Button aria-label="Suporte" className={className} size="icon" variant="secondary">
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

        <Item variant="muted">
          <ItemMedia>
            <MailIcon aria-hidden="true" />
          </ItemMedia>

          <ItemContent className="break-all">
            <ItemTitle>{supportEmail}</ItemTitle>
          </ItemContent>
        </Item>

        <DialogFooter className="w-full sm:justify-stretch sm:*:flex-1">
          <Button asChild variant="secondary">
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
